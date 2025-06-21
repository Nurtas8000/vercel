-- Обновляем таблицу платежей с дополнительными полями
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_type VARCHAR(50) DEFAULT 'rental';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS late_fee DECIMAL(10,2) DEFAULT 0;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS notes TEXT;

-- Создаем таблицу для истории платежей
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_id VARCHAR(100),
  payment_metho  NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_id VARCHAR(100),
  payment_method VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Создаем таблицу для настроек платежей
CREATE TABLE IF NOT EXISTS payment_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  auto_pay_enabled BOOLEAN DEFAULT FALSE,
  preferred_payment_method VARCHAR(50) DEFAULT 'kaspi_pay',
  notification_days_before INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для уведомлений о платежах
CREATE TABLE IF NOT EXISTS payment_notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'reminder', 'overdue', 'success', 'failed'
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_payment_history_payment_id ON payment_history(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON payment_history(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_settings_user_id ON payment_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_notifications_user_id ON payment_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_notifications_sent_at ON payment_notifications(sent_at);

-- Функция для автоматического создания уведомлений
CREATE OR REPLACE FUNCTION create_payment_reminder()
RETURNS TRIGGER AS $$
BEGIN
  -- Создаем напоминание за 3 дня до срока платежа
  INSERT INTO payment_notifications (payment_id, user_id, type, message)
  SELECT 
    NEW.id,
    b.renter_id,
    'reminder',
    'Напоминание: платеж ' || NEW.amount || '₸ должен быть внесен ' || NEW.due_date
  FROM bookings b
  WHERE b.id = NEW.booking_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для создания уведомлений
DROP TRIGGER IF EXISTS payment_reminder_trigger ON payments;
CREATE TRIGGER payment_reminder_trigger
  AFTER INSERT ON payments
  FOR EACH ROW
  EXECUTE FUNCTION create_payment_reminder();

-- Функция для обновления статуса просроченных платежей
CREATE OR REPLACE FUNCTION update_overdue_payments()
RETURNS void AS $$
BEGIN
  UPDATE payments 
  SET status = 'overdue'
  WHERE status = 'pending' 
    AND due_date < CURRENT_DATE;
    
  -- Создаем уведомления о просрочке
  INSERT INTO payment_notifications (payment_id, user_id, type, message)
  SELECT 
    p.id,
    b.renter_id,
    'overdue',
    'Просрочен платеж ' || p.amount || '₸. Пожалуйста, внесите оплату как можно скорее.'
  FROM payments p
  JOIN bookings b ON b.id = p.booking_id
  WHERE p.status = 'overdue' 
    AND NOT EXISTS (
      SELECT 1 FROM payment_notifications pn 
      WHERE pn.payment_id = p.id AND pn.type = 'overdue'
    );
END;
$$ LANGUAGE plpgsql;

-- Добавляем тестовые данные для платежей
INSERT INTO payment_history (payment_id, status, amount, transaction_id, payment_method)
SELECT 
  id,
  status,
  amount,
  kaspi_transaction_id,
  payment_method
FROM payments
WHERE kaspi_transaction_id IS NOT NULL;
