import { render } from '@testing-library/react';
import { SEO } from '@/components/SEO';
import Head from 'next/head';
import React, { ReactElement } from 'react';

// Mock next/head
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => {
      // Extract title from children and set it
      const titleElement = React.Children.toArray(children).find(
        (child): child is ReactElement => React.isValidElement(child) && child.type === 'title'
      );
      if (titleElement) {
        document.title = titleElement.props.children;
      }

      // Extract meta tags from children and add them to document
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === 'meta') {
          const meta = document.createElement('meta');
          Object.entries(child.props).forEach(([key, value]) => {
            meta.setAttribute(key, value as string);
          });
          document.head.appendChild(meta);
        }
      });

      return null;
    },
  };
});

describe('SEO', () => {
  beforeEach(() => {
    // Reset document title
    document.title = '';
    // Remove any existing meta tags
    document.querySelectorAll('meta').forEach(meta => meta.remove());
  });

  it('renders default title', () => {
    render(<SEO title="Swag AI" description="Your AI-powered personal stylist" />);
    expect(document.title).toBe('Swag AI');
  });

  it('renders custom title', () => {
    render(<SEO title="Custom Title" description="Test Description" />);
    expect(document.title).toBe('Custom Title');
  });

  it('renders custom description', () => {
    render(<SEO title="Test Title" description="Test Description" />);
    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).toHaveAttribute('content', 'Test Description');
  });

  it('renders custom og title', () => {
    render(<SEO title="Test Title" description="Test Description" />);
    const metaOgTitle = document.querySelector('meta[property="og:title"]');
    expect(metaOgTitle).toHaveAttribute('content', 'Test Title');
  });

  it('renders custom og description', () => {
    render(<SEO title="Test Title" description="Test Description" />);
    const metaOgDescription = document.querySelector('meta[property="og:description"]');
    expect(metaOgDescription).toHaveAttribute('content', 'Test Description');
  });

  it('renders custom og image', () => {
    render(<SEO title="Test Title" description="Test Description" ogImage="https://example.com/image.jpg" />);
    const metaOgImage = document.querySelector('meta[property="og:image"]');
    expect(metaOgImage).toHaveAttribute('content', 'https://example.com/image.jpg');
  });

  it('renders all meta tags with custom values', () => {
    render(
      <SEO
        title="Custom Title"
        description="Custom description"
        ogImage="https://example.com/image.jpg"
        ogType="article"
        twitterCard="summary"
        twitterSite="@custom"
        twitterCreator="@custom"
      />
    );

    expect(document.title).toBe('Custom Title');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Custom description'
    );
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Custom Title'
    );
    expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute(
      'content',
      'Custom description'
    );
    expect(document.querySelector('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'article'
    );
    expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://example.com/image.jpg'
    );
    expect(document.querySelector('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary'
    );
    expect(document.querySelector('meta[name="twitter:site"]')).toHaveAttribute(
      'content',
      '@custom'
    );
    expect(document.querySelector('meta[name="twitter:creator"]')).toHaveAttribute(
      'content',
      '@custom'
    );
    expect(document.querySelector('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      'Custom Title'
    );
    expect(document.querySelector('meta[name="twitter:description"]')).toHaveAttribute(
      'content',
      'Custom description'
    );
    expect(document.querySelector('meta[name="twitter:image"]')).toHaveAttribute(
      'content',
      'https://example.com/image.jpg'
    );
  });

  it('renders default values when not provided', () => {
    render(<SEO title="Test Title" description="Test Description" />);

    expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute(
      'content',
      '/og-default.png'
    );
    expect(document.querySelector('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'website'
    );
    expect(document.querySelector('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    );
    expect(document.querySelector('meta[name="twitter:site"]')).toHaveAttribute(
      'content',
      '@swagai'
    );
    expect(document.querySelector('meta[name="twitter:creator"]')).toHaveAttribute(
      'content',
      '@swagai'
    );
  });
}); 