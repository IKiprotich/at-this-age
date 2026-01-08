# at this age

A quiet, reflective web app for capturing personal thoughts at precise moments in your life.

## Concept

**at this age** is built on a simple idea: our thoughts and perspectives change as we age, and there's value in preserving these moments of reflection. 

The app prompts you with "when i was [X] years old, i thought…" and invites you to capture whatever comes to mind. Your age is calculated with precision (down to decimal places), acknowledging that growth happens continuously, not just in whole years.

### Philosophy

- **Time as context**: Each thought is anchored to a specific age, creating a timeline of your evolving perspective
- **Quiet reflection**: The minimal interface removes distractions, focusing entirely on the act of capturing thoughts
- **Self over time**: By revisiting thoughts from different ages, you can observe how your views, concerns, and insights have shifted
- **Duality**: The app recognizes the dual nature of reflection—both the person you were and the person you're becoming

The design is intentionally sparse and calm, using a warm orange palette and serif typography to create a contemplative atmosphere. There's no social sharing, no likes, no comments—just you and your thoughts across time.

## Features

- **Precise age calculation**: Thoughts are tagged with your exact age (e.g., 21.23 years old)
- **Timeline view**: See all your thoughts organized chronologically by age
- **Shareable cards**: Export individual thoughts as beautiful 1080×1080 PNG images with curved, minimal design
- **Minimal interface**: Full-screen, distraction-free experience
- **Private by default**: Your thoughts are yours alone—no public sharing, no social features

## Tech Stack

- **Next.js 14** - React framework with App Router
- **Supabase** - Authentication and database
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **html-to-image** - Image export functionality
- **Playfair Display** - Serif typography

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with favicon
│   ├── page.tsx            # Main app page with auth flow
│   └── globals.css         # Global styles
├── components/
│   ├── Auth.tsx            # Sign in/sign up
│   ├── DateOfBirthSetup.tsx # Initial date of birth collection
│   ├── ThoughtInput.tsx    # Main thought capture interface
│   ├── Timeline.tsx        # Chronological thought display
│   └── ShareCard.tsx        # Export/shareable card modal
└── lib/
    ├── supabase/           # Supabase client and types
    └── utils/              # Age calculation utilities
```
