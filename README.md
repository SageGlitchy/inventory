# Inventory Manager

A modern, multi-user inventory management app built with **Next.js** and **Supabase**. Features a clean UI, modular React components, full CRUD, authentication, and user-specific data with Row Level Security (RLS).

## Features
- User authentication (login/signup)
- User-specific inventory (RLS with Supabase)
- Add, edit, delete, and list products
- Search, filter, and sort inventory
- Responsive, modern UI with SCSS modules
- Modal forms, badges, and icon actions

## Live Demo
[https://inventory-xi-gilt.vercel.app/](https://inventory-xi-gilt.vercel.app/)

## Tech Stack
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Supabase](https://supabase.com/)
- [Lucide React](https://lucide.dev/icons/)
- [React Modal](https://reactcommunity.org/react-modal/)
- [Sass/SCSS](https://sass-lang.com/)

## Getting Started

### 1. Clone the repository
```bash
git clone (https://github.com/SageGlitchy/inventory)
cd inventory
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Supabase
- Create a [Supabase](https://supabase.com/) project.
- Create a `products` table with columns: `id`, `name`, `category`, `quantity`, `status`, `user_id` (UUID, default: `auth.uid()`).
- Enable Row Level Security (RLS) and add policies so users only access their own products.
- Get your Supabase URL and anon key.

### 4. Configure environment variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Run the development server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure
```
src/
  components/        # Modular React components (forms, tables, modals, etc.)
  pages/             # Next.js pages (auth, index, API routes)
  styles/            # SCSS modules and global styles
public/              # Static assets
```

## Customization
- Update styles in `src/styles/` for branding.
- Add more product fields or filters as needed.

## License
MIT
