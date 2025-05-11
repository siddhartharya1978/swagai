import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders hero section', () => {
    render(<Home />);

    expect(screen.getByText('Swag AI')).toBeInTheDocument();
    expect(screen.getByText('Your AI Personal Stylist')).toBeInTheDocument();
    expect(screen.getByText(/digitize your wardrobe, get ai-powered outfit suggestions, and save your favorite looks in your personal lookbook/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up \/ log in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to dashboard/i })).toBeInTheDocument();
  });

  it('renders key features section', () => {
    render(<Home />);

    expect(screen.getByText('Key Features')).toBeInTheDocument();
    expect(screen.getByText('Everything you need to manage your style')).toBeInTheDocument();
    expect(screen.getByText('Wardrobe Digitization')).toBeInTheDocument();
    expect(screen.getByText('Easily upload and organize your clothes in a digital closet. No more forgetting what you own!')).toBeInTheDocument();
    expect(screen.getByText('AI Outfit Suggestions')).toBeInTheDocument();
    expect(screen.getByText('Get personalized outfit ideas for any occasion, mood, or weather—powered by advanced AI.')).toBeInTheDocument();
    expect(screen.getByText('Lookbook')).toBeInTheDocument();
    expect(screen.getByText('Save, view, and share your favorite looks. Build your own style archive and get inspired.')).toBeInTheDocument();
  });

  it('renders how it works section', () => {
    render(<Home />);

    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Three simple steps')).toBeInTheDocument();
    expect(screen.getByText('Upload Your Clothes')).toBeInTheDocument();
    expect(screen.getByText('Take photos of your clothing items and upload them to your digital wardrobe.')).toBeInTheDocument();
    expect(screen.getByText('Get AI-Powered Outfit Suggestions')).toBeInTheDocument();
    expect(screen.getByText('Let Swag AI recommend outfits tailored to your needs.')).toBeInTheDocument();
    expect(screen.getByText('Save Your Favorite Looks')).toBeInTheDocument();
    expect(screen.getByText('Add outfits to your lookbook and revisit them anytime.')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<Home />);

    expect(screen.getByText(/© \d{4} Swag AI/i)).toBeInTheDocument();
  });
}); 