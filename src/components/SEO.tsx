import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  twitterSite?: string
  twitterCreator?: string
}

export function SEO({
  title,
  description,
  ogImage = '/og-default.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterSite = '@swagai',
  twitterCreator = '@swagai',
}: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  )
} 