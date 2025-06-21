-- Ensure pgcrypto extension is available for crypt() and gen_salt()
-- This script assumes pgcrypto is enabled in the database.

-- Define the public.users table with necessary constraints if it doesn't exist
-- This helps ensure ON CONFLICT clauses for public.users will work.
-- Note: If the table exists with a different structure, this won't alter it.
-- It's best to ensure your main schema script (create-database-schema.sql) ran correctly.
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY, -- Usually references auth.users.id
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

-- Add is_admin column if it doesn't exist (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE public.users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
END $$;


-- Create Admin User in auth.users and public.users
DO $$
DECLARE
    admin_auth_id uuid := '00000000-0000-0000-0000-000000000001'; -- Fixed UUID for admin
    admin_email text := 'admin@bnauto.kz';
    admin_password text := 'admin123456';
BEGIN
    -- Create or update admin in auth.users
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, created_at, updated_at)
    VALUES (admin_auth_id, '00000000-0000-0000-0000-000000000000', admin_email, crypt(admin_password, gen_salt('bf')), NOW(), 'authenticated', 'authenticated', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET -- Use 'id' for admin as it's fixed
        encrypted_password = crypt(admin_password, gen_salt('bf')),
        email = EXCLUDED.email, -- Allow email update if needed for this fixed ID
        updated_at = NOW();

    -- Create or update admin profile in public.users
    INSERT INTO public.users (id, email, full_name, phone, role, verified, is_admin, created_at, updated_at)
    VALUES (admin_auth_id, admin_email, 'Администратор BnAuto', '+7 (777) 000-00-00', 'admin', true, true, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        role = EXCLUDED.role,
        verified = EXCLUDED.verified,
        is_admin = EXCLUDED.is_admin,
        updated_at = NOW();
END $$;

-- Create Test Renter
DO $$
DECLARE
    v_user_id uuid;
    v_email text := 'test.renter@example.com';
    v_password text := 'testpassword';
    v_full_name text := 'Тестовый Арендатор';
    v_phone text := '+7 (700) 111-22-33';
    v_role text := 'renter';
BEGIN
    -- Create or update user in auth.users, get their ID
    INSERT INTO auth.users (instance_id, email, encrypted_password, email_confirmed_at, aud, role, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000', v_email, crypt(v_password, gen_salt('bf')), NOW(), 'authenticated', 'authenticated', NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET
        encrypted_password = crypt(v_password, gen_salt('bf')),
        updated_at = NOW()
    RETURNING id INTO v_user_id;

    -- If user was inserted or updated, v_user_id will be populated.
    IF v_user_id IS NULL THEN
      -- This case should ideally not happen if email is unique and RETURNING id works.
      -- Fallback to select if RETURNING id didn't populate (e.g. if ON CONFLICT DO NOTHING was used and row existed)
      SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
    END IF;

    -- Create or update profile in public.users
    IF v_user_id IS NOT NULL THEN
        INSERT INTO public.users (id, email, full_name, phone, role, verified, created_at, updated_at)
        VALUES (v_user_id, v_email, v_full_name, v_phone, v_role, true, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            full_name = EXCLUDED.full_name,
            phone = EXCLUDED.phone,
            role = EXCLUDED.role,
            verified = EXCLUDED.verified,
            updated_at = NOW();
    ELSE
        RAISE WARNING 'User with email % could not be created or found in auth.users. Profile not created.', v_email;
    END IF;
END $$;

-- Create Test Owner
DO $$
DECLARE
    v_user_id uuid;
    v_email text := 'test.owner@example.com';
    v_password text := 'testpassword';
    v_full_name text := 'Тестовый Арендодатель';
    v_phone text := '+7 (700) 444-55-66';
    v_role text := 'owner';
BEGIN
    -- Create or update user in auth.users, get their ID
    INSERT INTO auth.users (instance_id, email, encrypted_password, email_confirmed_at, aud, role, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000', v_email, crypt(v_password, gen_salt('bf')), NOW(), 'authenticated', 'authenticated', NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET
        encrypted_password = crypt(v_password, gen_salt('bf')),
        updated_at = NOW()
    RETURNING id INTO v_user_id;

    IF v_user_id IS NULL THEN
      SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
    END IF;

    -- Create or update profile in public.users
    IF v_user_id IS NOT NULL THEN
        INSERT INTO public.users (id, email, full_name, phone, role, verified, created_at, updated_at)
        VALUES (v_user_id, v_email, v_full_name, v_phone, v_role, true, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            full_name = EXCLUDED.full_name,
            phone = EXCLUDED.phone,
            role = EXCLUDED.role,
            verified = EXCLUDED.verified,
            updated_at = NOW();
    ELSE
        RAISE WARNING 'User with email % could not be created or found in auth.users. Profile not created.', v_email;
    END IF;
END $$;
