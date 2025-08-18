import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  url?: string
  siteName?: string
  images?: string[]
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
  tags?: string[]
  twitterHandle?: string
}

export function generateSEOMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    url = process.env.NEXT_PUBLIC_SITE_URL || 'https://sales-coffee.com',
    siteName = 'Sales Coffee Connector',
    images = ['/og-image.jpg'],
    type = 'website',
    publishedTime,
    modifiedTime,
    authors,
    section,
    tags,
    twitterHandle = '@salescoffe'
  } = config

  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`

  // Construct Open Graph object - Fix: Use proper type from Next.js Metadata
  const openGraph = {
    title: fullTitle,
    description,
    url,
    siteName,
    images: images.map(image => ({
      url: image.startsWith('http') ? image : `${url}${image}`,
      width: 1200,
      height: 630,
      alt: title
    })),
    type: type === 'website' || type === 'article' || type === 'profile' ? type : 'website'
  } as const

  // Add article-specific fields if type is article
  if (type === 'article' && (publishedTime || modifiedTime || authors || section || tags)) {
    Object.assign(openGraph, {
      publishedTime,
      modifiedTime,
      authors,
      section,
      tags
    })
  }

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: tags?.join(', '),
    authors: authors ? authors.map(name => ({ name })) : undefined,
    openGraph,
    twitter: {
      card: 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle || undefined,
      title: fullTitle,
      description,
      images: images.map(image => 
        image.startsWith('http') ? image : `${url}${image}`
      )
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_SITE_VERIFICATION
    }
  }

  return metadata
}

// Pre-configured metadata for common pages
export const defaultSEO: SEOConfig = {
  title: 'Sales Coffee Connector',
  description: 'Connect with fellow sales professionals over coffee. Share experiences, learn new strategies, and build meaningful relationships that drive success.',
  siteName: 'Sales Coffee Connector',
  type: 'website'
}

export const pageSEO = {
  home: (): Metadata => generateSEOMetadata({
    ...defaultSEO,
    title: 'Connect with Sales Professionals | Sales Coffee Connector',
    description: 'Join thousands of sales professionals connecting over coffee. Share experiences, learn strategies, and build relationships that drive your career forward.'
  }),

  about: (): Metadata => generateSEOMetadata({
    ...defaultSEO,
    title: 'About | Sales Coffee Connector',
    description: 'Learn about our mission to connect sales professionals worldwide through meaningful coffee conversations and knowledge sharing.'
  }),

  dashboard: (): Metadata => generateSEOMetadata({
    ...defaultSEO,
    title: 'Dashboard | Sales Coffee Connector',
    description: 'Your personal dashboard for managing connections, scheduling coffee chats, and tracking your networking progress.'
  }),

  login: (): Metadata => generateSEOMetadata({
    ...defaultSEO,
    title: 'Sign In | Sales Coffee Connector',
    description: 'Sign in to your Sales Coffee Connector account to start networking with sales professionals worldwide.'
  }),

  signup: (): Metadata => generateSEOMetadata({
    ...defaultSEO,
    title: 'Get Started | Sales Coffee Connector',
    description: 'Create your free account and start connecting with sales professionals who share your interests and goals.'
  }),

  successStories: (): Metadata => generateSEOMetadata({
    ...defaultSEO,
    title: 'Success Stories | Sales Coffee Connector',
    description: 'Read inspiring stories from sales professionals who have built meaningful connections and achieved success through our platform.',
    type: 'article',
    section: 'Success Stories'
  })
}

// Schema.org structured data helpers
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sales Coffee Connector',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sales-coffee.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sales-coffee.com'}/logo.png`,
    description: 'Connecting sales professionals worldwide through meaningful conversations',
    sameAs: [
      'https://twitter.com/salescoffe',
      'https://linkedin.com/company/sales-coffee-connector'
    ]
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sales Coffee Connector',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sales-coffee.com',
    description: 'Connect with fellow sales professionals over coffee',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sales-coffee.com'}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}