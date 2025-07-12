# Blog Scraper & AI Summarizer

A simple Next.js application that scrapes blog content, generates AI summaries, translates to Urdu, and stores data in dual databases.

## Features

- **URL Input**: Simple search bar to input blog URLs
- **Web Scraping**: Extracts content from blog posts
- **AI Summarization**: Static logic-based summarization
- **Urdu Translation**: JavaScript dictionary-based translation
- **Dual Storage**: Summaries in Supabase (PostgreSQL), full text in MongoDB
- **View Modes**: 
  - Scraper: Input URL and get results
  - Get Summaries: View all summaries with pagination (5 per page)
  - Get Full Texts: View all full texts with pagination (5 per page)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Update `.env.local` with your MongoDB connection string:
   ```env
   # Supabase (already configured)
   NEXT_PUBLIC_SUPABASE_URL=https://aqidomqkhpbibqzybalc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # MongoDB (add your connection string)
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB=blog_scraper
   ```

3. **Database Setup**
   - Run the SQL in `database/supabase_schema.sql` in your Supabase project
   - MongoDB collections are created automatically

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Usage

1. **Scraper Mode**: Enter a blog URL, click "Scrape & Summarize"
2. **Get Summaries**: View all saved summaries with pagination
3. **Get Full Texts**: View all full content with pagination
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=blog_scraper

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up Supabase database:
- Go to your Supabase project dashboard
- Navigate to SQL Editor
- Run the SQL script from `database/supabase_schema.sql`

5. Set up MongoDB:
- Create a new database named `blog_scraper`
- The `blog_contents` collection will be created automatically

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser
