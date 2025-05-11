# Swag AI - Your AI-Powered Wardrobe Assistant

Swag AI is an intelligent wardrobe management system that helps you organize your clothes, generate outfit suggestions, and maintain a digital lookbook of your favorite combinations.

## 🌟 Features

### Core Features
- **Smart Wardrobe Management**
  - Upload clothing items with automatic background removal
  - AI-powered tagging and categorization
  - Advanced filtering and search capabilities
  - Duplicate detection to prevent clutter

- **AI Outfit Generation**
  - Context-aware outfit suggestions based on:
    - Occasion
    - Weather conditions
    - Personal style preferences
  - Real-time feedback system for outfit ratings

- **Digital Lookbook**
  - Save and organize favorite outfits
  - Share outfit combinations
  - Track outfit history and preferences

### Technical Features
- Secure authentication with Supabase
- Real-time data synchronization
- Responsive design for all devices
- Accessible UI with keyboard navigation
- Comprehensive error handling
- Loading states and animations

## 🛠 Tech Stack

- **Frontend**
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Radix UI primitives

- **Backend & Infrastructure**
  - Supabase (Auth, Database, Storage)
  - Google Gemini AI
  - ApyHub (Background Removal)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Google Cloud account (for Gemini AI)
- ApyHub account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/swag-ai.git
   cd swag-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your API keys and configuration values

4. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APYHUB_API_KEY=your_apyhub_api_key
```

## 🚢 Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

The app will be automatically built and deployed. Vercel will provide you with a production URL.

### Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test authentication flow
- [ ] Verify image upload and processing
- [ ] Test outfit generation
- [ ] Check lookbook functionality
- [ ] Verify responsive design
- [ ] Test error handling
- [ ] Check loading states
- [ ] Verify tooltips and accessibility

## 🗺 Roadmap

### Post-MVP Features
- Social sharing capabilities
- Style recommendations based on trends
- Seasonal wardrobe organization
- Shopping recommendations
- Outfit history analytics
- Mobile app development

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent outfit generation
- ApyHub for background removal service
- Supabase for backend infrastructure
- shadcn/ui for beautiful components
