# Swag AI - Your AI Wardrobe Assistant

Swag AI is a modern web application that helps users digitize their wardrobe and get AI-powered outfit suggestions. Built with Next.js 14, TypeScript, and Supabase.

## 🌟 Features

- 🔐 **Authentication**
  - Secure user authentication with Supabase
  - Protected routes and API endpoints
  - User profile management

- 👔 **Wardrobe Management**
  - Digital wardrobe organization
  - Upload and categorize clothing items
  - Smart tagging and categorization
  - Visual grid layout for easy browsing

- 🤖 **AI-Powered Features**
  - Smart outfit suggestions using Gemini 2.0 Flash
  - Style recommendations based on preferences
  - Weather-aware outfit planning
  - Personalized fashion advice

- 📱 **User Experience**
  - Responsive design with Tailwind CSS
  - Modern UI components with shadcn/ui
  - Dark/Light mode support
  - Intuitive navigation

## 🛠️ Tech Stack

- **Frontend**
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - React Query for data fetching

- **Backend**
  - Supabase
    - Authentication
    - PostgreSQL Database
    - Storage for images
  - Gemini 2.0 Flash API for AI features

- **Testing**
  - Jest
  - React Testing Library
  - MSW for API mocking

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/siddhartharya1978/swagai.git
   cd swagai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── signin/           # Authentication pages
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── ui/               # Reusable UI components
│   ├── wardrobe/         # Wardrobe management
│   └── outfits/          # Outfit suggestions
├── lib/                  # Utility functions
│   ├── api/              # API clients
│   └── supabase.ts       # Supabase configuration
└── types/                # TypeScript type definitions
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Siddharth Arya** - *Initial work* - [siddhartharya1978](https://github.com/siddhartharya1978)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Gemini AI](https://deepmind.google/technologies/gemini/)
