-- Create blog_summaries table in Supabase
CREATE TABLE IF NOT EXISTS blog_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  summary_urdu TEXT NOT NULL,
  mongo_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_blog_summaries_created_at ON blog_summaries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_summaries_url ON blog_summaries(url);

-- Enable Row Level Security
ALTER TABLE blog_summaries ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access" ON blog_summaries FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON blog_summaries FOR INSERT WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_summaries_updated_at
  BEFORE UPDATE ON blog_summaries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
