"use client";
import Link from 'next/link'
import { SEO } from '@/components/SEO'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Swag AI - Your AI Wardrobe Assistant"
        description="Digitize your wardrobe, generate AI-powered outfits, and save your favorite looks with Swag AI. Powered by Next.js, Supabase, and Gemini."
        ogImage="/og-default.png"
      />
      {/* Hero Section */}
      <section className="relative min-h-screen px-6 lg:px-8 py-24 sm:py-32 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Text content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                Swag AI
              </h1>
              <p className="text-3xl mt-6 font-light italic text-purple-100">
                Your Closet, Curated.<br />Your Style, Elevated.
              </p>
              <p className="mt-8 text-xl leading-8 text-purple-100/90">
                Transform your wardrobe with AI-powered style. Get personalized outfit suggestions that match your unique style, body type, and preferences.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <Link 
                  href="/signin" 
                  className="group relative px-8 py-4 text-lg font-medium text-purple-900 bg-white rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/dashboard"
                  className="text-lg font-medium text-white hover:text-purple-200 transition-colors duration-300 flex items-center gap-2"
                >
                  Go to Dashboard
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right column - Hero image */}
            <div className="relative flex justify-center items-center w-full h-[400px] sm:h-[500px] lg:h-[600px]">
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full max-w-xl h-full flex items-center justify-center"
              >
        <Image
                  src="/hero-wardrobe-grid.png"
                  alt="Swag AI wardrobe organization on smartphone"
                  width={600}
                  height={800}
          priority
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-purple-200/80">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-6 h-10 border-2 border-purple-200/80 rounded-full flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1 h-2 bg-purple-200/80 rounded-full mt-2"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-white"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-900/5 to-transparent"></div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-2xl lg:text-center"
          >
            <h2 className="text-base font-semibold leading-7 text-purple-600">Key Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your style
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Discover a new way to organize your wardrobe and elevate your style with AI-powered features designed for the modern fashion enthusiast.
            </p>
          </motion.div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              {/* Feature 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative pl-16 group"
              >
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white text-2xl transition-transform duration-300 group-hover:scale-110">
                  👚
                </div>
                <h3 className="text-lg font-semibold leading-7 text-gray-900">Wardrobe Digitization</h3>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  Easily upload and organize your clothes in a digital closet. No more forgetting what you own!
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative pl-16 group"
              >
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white text-2xl transition-transform duration-300 group-hover:scale-110">
                  🤖
                </div>
                <h3 className="text-lg font-semibold leading-7 text-gray-900">AI Outfit Suggestions</h3>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  Get personalized outfit ideas for any occasion, mood, or weather—powered by advanced AI.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="relative pl-16 group"
              >
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white text-2xl transition-transform duration-300 group-hover:scale-110">
                  📸
                </div>
                <h3 className="text-lg font-semibold leading-7 text-gray-900">Lookbook</h3>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  Save, view, and share your favorite looks. Build your own style archive and get inspired.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 sm:py-32 bg-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-purple-50"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-2xl lg:text-center"
          >
            <h2 className="text-base font-semibold leading-7 text-purple-600">How It Works</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Three simple steps to transform your style
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Getting started with Swag AI is easy. Follow these simple steps to begin your style transformation journey.
            </p>
          </motion.div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
              {/* Step 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col items-center group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-white text-2xl font-bold transition-transform duration-300 group-hover:scale-110">
                    1
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-7 text-gray-900 text-center">Upload Your Clothes</h3>
                <p className="mt-2 text-base leading-7 text-gray-600 text-center">
                  Take photos of your clothing items and upload them to your digital wardrobe.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col items-center group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-white text-2xl font-bold transition-transform duration-300 group-hover:scale-110">
                    2
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-7 text-gray-900 text-center">Get AI-Powered Outfit Suggestions</h3>
                <p className="mt-2 text-base leading-7 text-gray-600 text-center">
                  Let Swag AI recommend outfits tailored to your needs.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col items-center group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-white text-2xl font-bold transition-transform duration-300 group-hover:scale-110">
                    3
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-7 text-gray-900 text-center">Save Your Favorite Looks</h3>
                <p className="mt-2 text-base leading-7 text-gray-600 text-center">
                  Add outfits to your lookbook and revisit them anytime.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-white"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-900/5 to-transparent"></div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-2xl lg:text-center"
          >
            <h2 className="text-base font-semibold leading-7 text-purple-600">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Loved by fashion enthusiasts
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              See how Swag AI is transforming wardrobes and elevating personal style around the world.
            </p>
          </motion.div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* Testimonial 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200 hover:shadow-2xl transition-shadow duration-300"
            >
              <div>
                <div className="flex items-center gap-x-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br from-purple-500 to-pink-500">
                    SC
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold leading-7 tracking-tight text-gray-900">Sarah Chen</h3>
                    <p className="text-sm leading-6 text-gray-600">Fashion Blogger</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  "Swag AI has completely transformed how I organize my wardrobe. The AI suggestions are spot-on and have helped me discover new outfit combinations I never would have thought of!"
                </p>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200 hover:shadow-2xl transition-shadow duration-300"
            >
              <div>
                <div className="flex items-center gap-x-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br from-indigo-500 to-blue-500">
                    MR
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold leading-7 tracking-tight text-gray-900">Michael Rodriguez</h3>
                    <p className="text-sm leading-6 text-gray-600">Tech Professional</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  "As someone who's always struggled with fashion choices, Swag AI has been a game-changer. The app understands my style preferences and helps me make confident fashion decisions."
                </p>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200 hover:shadow-2xl transition-shadow duration-300"
            >
              <div>
                <div className="flex items-center gap-x-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br from-pink-500 to-yellow-500">
                    PP
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold leading-7 tracking-tight text-gray-900">Priya Patel</h3>
                    <p className="text-sm leading-6 text-gray-600">Fashion Designer</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  "The AI's understanding of different body types and style preferences is impressive. It's like having a personal stylist who knows exactly what works for you."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your wardrobe?
            </h2>
            <p className="mt-6 text-lg leading-8 text-purple-100">
              Join thousands of fashion enthusiasts who are already using Swag AI to elevate their style. Start your journey today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link 
                href="/signin" 
                className="group relative px-8 py-4 text-lg font-medium text-purple-900 bg-white rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/dashboard"
                className="text-lg font-medium text-white hover:text-purple-200 transition-colors duration-300 flex items-center gap-2"
              >
                View Demo
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <p className="mt-4 text-sm text-purple-200">
              No credit card required. Free trial available.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-purple-200 text-sm bg-gradient-to-t from-indigo-800 via-purple-800 to-transparent">
        &copy; {new Date().getFullYear()} Swag AI. All rights reserved.
      </footer>
    </div>
  )
}
