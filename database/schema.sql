
-- CHRONOS LUXURY WATCHES - FINAL STANDARDIZED SCHEMA
-- Execute this in your Supabase SQL Editor

-- 1. WATCHES TABLE
CREATE TABLE IF NOT EXISTS public.watches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand_id TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT,
    images TEXT[] DEFAULT '{}',
    specifications JSONB DEFAULT '{}',
    stock INTEGER DEFAULT 0,
    category TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    items JSONB NOT NULL,
    total NUMERIC NOT NULL,
    status TEXT DEFAULT 'Pending',
    customer JSONB NOT NULL,
    user_id UUID REFERENCES auth.users(id)
);

-- 3. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    hero_tag TEXT,
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_image_url TEXT,
    hero_primary_btn_text TEXT,
    hero_secondary_btn_text TEXT,
    featured_tag TEXT,
    featured_heading TEXT,
    featured_archive_link_text TEXT,
    immersive_heading TEXT,
    immersive_subheading TEXT,
    immersive_description TEXT,
    immersive_button_text TEXT,
    immersive_image_url TEXT,
    CONSTRAINT single_row CHECK (id = 1)
);

-- 4. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.watches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 6. ROBUST RLS POLICIES
-- Clean up existing to prevent duplication errors
DO $$ 
BEGIN
    -- Watches
    DROP POLICY IF EXISTS "Public Read Watches" ON public.watches;
    CREATE POLICY "Public Read Watches" ON public.watches FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Admin All Watches" ON public.watches;
    CREATE POLICY "Admin All Watches" ON public.watches FOR ALL 
    USING (auth.jwt() ->> 'email' = 'sharifislam02001@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'sharifislam02001@gmail.com');

    -- Site Settings
    DROP POLICY IF EXISTS "Public Read Settings" ON public.site_settings;
    CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Admin All Settings" ON public.site_settings;
    CREATE POLICY "Admin All Settings" ON public.site_settings FOR ALL 
    USING (auth.jwt() ->> 'email' = 'sharifislam02001@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'sharifislam02001@gmail.com');

    -- Orders
    DROP POLICY IF EXISTS "Admin View Orders" ON public.orders;
    CREATE POLICY "Admin View Orders" ON public.orders FOR SELECT 
    USING (auth.jwt() ->> 'email' = 'sharifislam02001@gmail.com');

    DROP POLICY IF EXISTS "Public Create Orders" ON public.orders;
    CREATE POLICY "Public Create Orders" ON public.orders FOR INSERT WITH CHECK (true);

    -- Messages
    DROP POLICY IF EXISTS "Public Insert Messages" ON public.messages;
    CREATE POLICY "Public Insert Messages" ON public.messages FOR INSERT WITH CHECK (true);
    
    DROP POLICY IF EXISTS "Admin Read Messages" ON public.messages;
    CREATE POLICY "Admin Read Messages" ON public.messages FOR SELECT 
    USING (auth.jwt() ->> 'email' = 'sharifislam02001@gmail.com');
END $$;




-- user e jeno data show dekhai


-- CHRONOS DATABASE UPDATE: ORDER VISIBILITY & PERSISTENCE
-- Run this in your Supabase SQL Editor to fix the Profile Order issue.

-- 1. Ensure the user_id column exists and is linked (Safe to run if already exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='user_id') THEN
        ALTER TABLE public.orders ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- 2. Enable RLS (Safe to run multiple times)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3. DROP old conflicting policies to avoid "OR" logic issues
DROP POLICY IF EXISTS "Admin View Orders" ON public.orders;
DROP POLICY IF EXISTS "Users View Own Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Create Orders" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.orders;

-- 4. NEW: Admin Access (Full control for your specific email)
CREATE POLICY "Admin Full Access" ON public.orders
FOR ALL USING (
    auth.jwt() ->> 'email' = 'sharifislam02001@gmail.com'
);

-- 5. NEW: User View Policy (Users can see orders where their ID matches)
CREATE POLICY "Users View Own Orders" ON public.orders
FOR SELECT USING (
    auth.uid() = user_id OR 
    (customer->>'email') = auth.jwt()->>'email'
);

-- 6. NEW: Insert Policy (Allows anyone to place an order, but logs their ID if logged in)
CREATE POLICY "Anyone Can Place Orders" ON public.orders
FOR INSERT WITH CHECK (
    true -- We allow the insert, logic in ShopContext handles setting the user_id
);

-- 7. NEW: Update/Delete Protection
CREATE POLICY "Users Can Only Cancel Own Pending Orders" ON public.orders
FOR DELETE USING (
    (auth.uid() = user_id AND status = 'Pending') OR
    (auth.jwt() ->> 'email' = 'sharifislam02001@gmail.com')
);
