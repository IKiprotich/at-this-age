# at this age

A quiet, reflective web app for capturing personal thoughts over time.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
   - Copy your Supabase URL and anon key

3. Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Features

- Capture thoughts with precise age calculation
- Timeline view of all saved thoughts
- Export thoughts as shareable 1080×1080 PNG images
- Minimal, calm interface
# at-this-age
