-- Добавляем колонку is_admin если её нет
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Обновляем существующих пользователей
UPDATE public.users 
SET is_admin = true 
WHERE email = 'admin@bnauto.kz';

-- Создаем RLS политики для админов
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE is_admin = true
    )
  );

CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE is_admin = true
    )
  );
