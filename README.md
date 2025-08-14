# Sales Coffee Connector

![Sales Coffee Connector Preview](https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=1200&h=300&fit=crop&auto=format)

A professional networking platform that connects sales executives for 15-minute virtual coffee chats. The application uses intelligent matching to pair professionals based on complementary skills, experience levels, and learning goals.

## ✨ Features

- **Smart Matching Algorithm** - Algorithmic pairing based on complementary skills and experience
- **Multi-Step Onboarding** - Comprehensive 5-step profile setup process
- **Session Management** - Complete session lifecycle from booking to feedback
- **Professional Profiles** - Rich user profiles with skills, industries, and availability
- **Real-time Dashboard** - Track networking progress and upcoming sessions
- **Success Stories** - Community testimonials and networking outcomes
- **Mobile Responsive** - Optimized experience across all devices
- **Authentication System** - Secure user registration and profile management

## Clone this Bucket and Code Repository

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Bucket and Code Repository](https://img.shields.io/badge/Clone%20this%20Bucket-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=689e0d4badc4af3c1104d05d&clone_repository=689e132badc4af3c1104d07a)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "I want to build an application that allows sales executives to get vitually matched up with other sales executives for 15 minutes virtual calls to chat about their profession, what works and what doesn't, and overall grow their network. Can you do that?"

### Code Generation Prompt

> Build a responsive web application that connects sales executives for 15-minute virtual networking calls. The platform uses intelligent matching to pair professionals based on complementary skills, experience levels, and learning goals.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Cosmic CMS** - Headless CMS for content management
- **React Hook Form + Zod** - Form validation and handling
- **Lucide React** - Icon library
- **Firebase Auth** - Authentication service

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic CMS account with bucket access
- Firebase project (for authentication)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sales-coffee-connector
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
- `COSMIC_BUCKET_SLUG`: Your Cosmic bucket slug
- `COSMIC_READ_KEY`: Your Cosmic read key
- `COSMIC_WRITE_KEY`: Your Cosmic write key (contact support)
- `NEXT_PUBLIC_FIREBASE_*`: Firebase configuration

4. Run the development server:
```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Cosmic SDK Examples

### Fetching Sales Executives
```typescript
import { cosmic } from '@/lib/cosmic'

// Get all active sales executives
const executives = await cosmic.objects
  .find({
    type: 'sales-executives',
    'metadata.account_status': 'active'
  })
  .props(['id', 'title', 'metadata'])
  .depth(1)
```

### Creating a Matching Session
```typescript
// Create new matching session
const session = await cosmic.objects.insertOne({
  type: 'matching-sessions',
  title: `Session ${Date.now()}`,
  metadata: {
    session_id: generateUUID(),
    participant_1: user1.id,
    participant_2: user2.id,
    session_status: 'pending',
    scheduled_datetime: new Date().toISOString()
  }
})
```

### Fetching Skills and Industries
```typescript
// Get skills for onboarding
const skills = await cosmic.objects
  .find({ type: 'skills' })
  .props(['id', 'title', 'metadata'])

// Get industries for profile setup
const industries = await cosmic.objects
  .find({ type: 'industries' })
  .props(['id', 'title', 'metadata'])
```

## 🎯 Cosmic CMS Integration

The application integrates with your Cosmic CMS bucket containing:

- **Sales Executives** - User profiles with skills, experience, and preferences
- **Skills** - Sales competencies categorized by type (prospecting, closing, etc.)
- **Industries** - Business sectors and their characteristics
- **Matching Sessions** - Virtual meeting records with ratings and outcomes
- **Discussion Topics** - Suggested conversation starters for sessions
- **Success Stories** - Community testimonials and networking wins

## 📱 Deployment Options

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect repository to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `out`
4. Add environment variables

### Environment Variables for Production
Set these variables in your hosting platform:
- `COSMIC_BUCKET_SLUG`
- `COSMIC_READ_KEY`  
- `COSMIC_WRITE_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

<!-- README_END -->