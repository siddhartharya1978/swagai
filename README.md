# Swag AI - Your AI Wardrobe Assistant

Swag AI is a modern web application that helps users digitize their wardrobe and get AI-powered outfit suggestions. Built with Next.js 14, TypeScript, and Supabase.

## Features

- 🔐 Secure authentication with Supabase
- 👔 Digital wardrobe management
- 🤖 AI-powered outfit suggestions using Gemini 2.0 Flash
- 📱 Responsive design with Tailwind CSS
- 🎨 Modern UI components with shadcn/ui

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase (Auth, Database, Storage)
- Gemini 2.0 Flash API

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── auth/           # Authentication pages
│   └── dashboard/      # Main app dashboard
├── components/         # React components
│   ├── wardrobe/      # Wardrobe-related components
│   └── outfits/       # Outfit suggestion components
├── contexts/          # React contexts
├── lib/              # Utility functions and configurations
│   ├── api/          # API interaction functions
│   └── supabase.ts   # Supabase client configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
