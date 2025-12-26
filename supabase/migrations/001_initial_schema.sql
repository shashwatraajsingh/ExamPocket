-- Supabase SQL Migration
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE university_type AS ENUM ('aktu', 'abes_ec', 'akgec', 'kiet');
CREATE TYPE material_type_enum AS ENUM ('notes', 'pyq');
CREATE TYPE note_category_enum AS ENUM ('chapter_wise', 'subject_wise');

-- Create materials table
CREATE TABLE IF NOT EXISTS materials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    university university_type NOT NULL,
    material_type material_type_enum NOT NULL,
    note_category note_category_enum,
    subject VARCHAR(255) NOT NULL,
    semester INTEGER CHECK (semester >= 1 AND semester <= 8),
    year INTEGER CHECK (year >= 2000 AND year <= 2100),
    chapter VARCHAR(255),
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    thumbnail_url TEXT,
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table (for future use)
CREATE TABLE IF NOT EXISTS subjects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    university university_type NOT NULL,
    semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_materials_university ON materials(university);
CREATE INDEX IF NOT EXISTS idx_materials_material_type ON materials(material_type);
CREATE INDEX IF NOT EXISTS idx_materials_semester ON materials(semester);
CREATE INDEX IF NOT EXISTS idx_materials_subject ON materials(subject);
CREATE INDEX IF NOT EXISTS idx_materials_created_at ON materials(created_at DESC);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(material_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE materials
    SET view_count = view_count + 1,
        updated_at = NOW()
    WHERE id = material_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(material_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE materials
    SET download_count = download_count + 1,
        updated_at = NOW()
    WHERE id = material_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_materials_updated_at
    BEFORE UPDATE ON materials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for materials"
    ON materials FOR SELECT
    USING (true);

CREATE POLICY "Public read access for subjects"
    ON subjects FOR SELECT
    USING (true);

-- Create policies for authenticated insert/update/delete (admin only)
-- Note: You may want to adjust these based on your authentication setup
CREATE POLICY "Allow all for authenticated users on materials"
    ON materials FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users on subjects"
    ON subjects FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create storage bucket for materials (run in Storage section)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('materials', 'materials', true);

-- Storage policies (run in SQL Editor)
-- CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'materials');
-- CREATE POLICY "Allow uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'materials');
-- CREATE POLICY "Allow deletes" ON storage.objects FOR DELETE USING (bucket_id = 'materials');
