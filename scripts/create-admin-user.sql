-- Ensure pgcrypto extension is available for crypt() and gen_salt()
-- Best to enable this via Supabase Dashboard: Database > Extensions > pgcrypto

-- 1. Define the public.users table with necessary constraints if it doesn't exist.
-- This ensures that if the table is created by this script, 'id' is a PRIMARY KEY
-- and 'email' has a UNIQUE constraint.
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'renter' CHECK (role IN ('renter', 'owner', 'admin')),
    avatar_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add is_admin column to public.users if it doesn't exist.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE public.users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Column "is_admin" added to public.users.';
    ELSE
        RAISE NOTICE 'Column "is_admin" already exists in public.users.';
    END IF;
END $$;

-- 3. Attempt to add PRIMARY KEY on public.users(id) if no PK exists.
-- This is crucial. If public.users exists but 'id' is not its PK, this tries to fix it.
-- Pay attention to any warnings if this block fails.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint ct
        JOIN pg_class c ON c.oid = ct.conrelid
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' AND c.relname = 'users' AND ct.contype = 'p' -- 'p' for primary key
    ) THEN
        RAISE NOTICE 'No PRIMARY KEY found on public.users. Attempting to add PRIMARY KEY on column "id".';
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'id'
        ) THEN
            -- Before adding PK, ensure 'id' column has no NULL values if it's not already NOT NULL
            -- UPDATE public.users SET id = gen_random_uuid() WHERE id IS NULL; -- Example: Fill NULLs, but risky. Better to ensure data quality.
            -- Ensure 'id' column has no duplicate values.
            -- If duplicates exist, ALTER TABLE ... ADD PRIMARY KEY will fail.
            ALTER TABLE public.users ADD CONSTRAINT users_id_ensure_pkey PRIMARY KEY (id);
            RAISE NOTICE 'Successfully added PRIMARY KEY to public.users(id) as users_id_ensure_pkey.';
        ELSE
            RAISE WARNING 'Column "id" does not exist in "public.users". Cannot add PRIMARY KEY.';
        END IF;
    ELSE
        RAISE NOTICE 'PRIMARY KEY already exists on public.users.';
    END IF;
EXCEPTION
    WHEN SQLSTATE '42P07' THEN -- duplicate_object (constraint might already exist with a different name)
        RAISE NOTICE 'PRIMARY KEY constraint (or a constraint with a conflicting name like users_id_ensure_pkey) likely already exists on public.users(id).';
    WHEN OTHERS THEN
        RAISE WARNING 'Failed to add PRIMARY KEY on public.users(id). Error: %. This usually means the "id" column contains NULLs or duplicate values.', SQLERRM;
END $$;

-- 4. Create Admin User
DO $$
DECLARE
    admin_auth_id uuid := '00000000-0000-0000-0000-000000000001';
    admin_email text := 'admin@bnauto.kz';
    admin_password text := 'admin123456';
BEGIN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, created_at, updated_at)
    VALUES (admin_auth_id, '00000000-0000-0000-0000-000000000000', admin_email, crypt(admin_password, gen_salt('bf')), NOW(), 'authenticated', 'authenticated', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        encrypted_password = crypt(admin_password, gen_salt('bf')),
        email = EXCLUDED.email,
        updated_at = NOW();

    INSERT INTO public.users (id, email, full_name, phone, role, verified, is_admin, created_at, updated_at)
    VALUES (admin_auth_id, admin_email, 'Администратор BnAuto', '+7 (777) 000-00-00', 'admin', true, true, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email, full_name = EXCLUDED.full_name, phone = EXCLUDED.phone, role = EXCLUDED.role,
        verified = EXCLUDED.verified, is_admin = EXCLUDED.is_admin, updated_at = NOW();
    RAISE NOTICE 'Admin user processed.';
END $$;

-- 5. Create Test Renter
DO $$
DECLARE
    v_user_id uuid;
    v_email text := 'test.renter@example.com';
    v_password text := 'testpassword';
BEGIN
    INSERT INTO auth.users (instance_id, email, encrypted_password, email_confirmed_at, aud, role, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000', v_email, crypt(v_password, gen_salt('bf')), NOW(), 'authenticated', 'authenticated', NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET
        encrypted_password = crypt(v_password, gen_salt('bf')), updated_at = NOW()
    RETURNING id INTO v_user_id;

    IF v_user_id IS NULL THEN
      SELECT id INTO v_user_id FROM auth.users WHERE email = v_email LIMIT 1;
    END IF;

    IF v_user_id IS NOT NULL THEN
        INSERT INTO public.users (id, email, full_name, phone, role, verified)
        VALUES (v_user_id, v_email, 'Тестовый Арендатор', '+7 (700) 111-22-33', 'renter', true)
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email, full_name = EXCLUDED.full_name, phone = EXCLUDED.phone,
            role = EXCLUDED.role, verified = EXCLUDED.verified, updated_at = NOW();
        RAISE NOTICE 'Test Renter processed with auth_id %', v_user_id;
    ELSE
        RAISE WARNING 'Renter with email % could not be created/found in auth.users. Profile not created.', v_email;
    END IF;
END $$;

-- 6. Create Test Owner
DO $$
DECLARE
    v_user_id uuid;
    v_email text := 'test.owner@example.com';
    v_password text := 'testpassword';
BEGIN
    INSERT INTO auth.users (instance_id, email, encrypted_password, email_confirmed_at, aud, role, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000', v_email, crypt(v_password, gen_salt('bf')), NOW(), 'authenticated', 'authenticated', NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET
        encrypted_password = crypt(v_password, gen_salt('bf')), updated_at = NOW()
    RETURNING id INTO v_user_id;

    IF v_user_id IS NULL THEN
      SELECT id INTO v_user_id FROM auth.users WHERE email = v_email LIMIT 1;
    END IF;

    IF v_user_id IS NOT NULL THEN
        INSERT INTO public.users (id, email, full_name, phone, role, verified)
        VALUES (v_user_id, v_email, 'Тестовый Арендодатель', '+7 (700) 444-55-66', 'owner', true)
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email, full_name = EXCLUDED.full_name, phone = EXCLUDED.phone,
            role = EXCLUDED.role, verified = EXCLUDED.verified, updated_at = NOW();
        RAISE NOTICE 'Test Owner processed with auth_id %', v_user_id;
    ELSE
        RAISE WARNING 'Owner with email % could not be created/found in auth.users. Profile not created.', v_email;
    END IF;
END $$;
