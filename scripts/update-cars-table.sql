-- Добавляем дополнительные поля в таблицу cars
ALTER TABLE cars ADD COLUMN IF NOT EXISTS mileage INTEGER;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS fuel_type VARCHAR(20) DEFAULT 'gasoline';
ALTER TABLE cars ADD COLUMN IF NOT EXISTS transmission VARCHAR(20) DEFAULT 'automatic';
ALTER TABLE cars ADD COLUMN IF NOT EXISTS engine_volume DECIMAL(3,1);

-- Добавляем индексы для поиска
CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON cars(fuel_type);
CREATE INDEX IF NOT EXISTS idx_cars_transmission ON cars(transmission);
CREATE INDEX IF NOT EXISTS idx_cars_mileage ON cars(mileage);

-- Обновляем существующие записи
UPDATE cars SET fuel_type = 'gasoline' WHERE fuel_type IS NULL;
UPDATE cars SET transmission = 'automatic' WHERE transmission IS NULL;
