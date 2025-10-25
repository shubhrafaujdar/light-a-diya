# Design Document

## Overview

Dharma.com is designed as a modern Hindu spiritual platform that seamlessly blends traditional devotional content with contemporary digital experiences. The platform architecture supports a multi-feature ecosystem where users can access sacred texts, participate in collaborative rituals, and engage with spiritual content in their preferred language. The design emphasizes cultural authenticity, visual beauty, and technical performance to create a reverent digital sanctuary.

## Architecture

### System Architecture

The platform follows a modern web application architecture with the following key components:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │   Database      │
│   (Next.js)     │◄──►│   (Node.js)      │◄──►│   (Supabase)    │
│                 │    │                  │    │                 │
│ - React UI      │    │ - REST/GraphQL   │    │ - Content Store │
│ - State Mgmt    │    │ - Authentication │    │ - User Data     │
│ - Real-time     │    │ - Real-time WS   │    │ - Sessions      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Technology Stack

- **Frontend**: Next.js 14+ with React, TypeScript, Tailwind CSS
- **Backend**: Supabase for database, authentication, and real-time features
- **Real-time**: Supabase Realtime for collaborative diya lighting
- **Deployment**: Vercel for frontend, Supabase cloud for backend
- **Content Management**: Supabase database with structured content schema

## Components and Interfaces

### Core Components

#### 1. Landing Page Component
- **Purpose**: Spiritual welcome experience with divine imagery
- **Features**: 
  - Full-screen divine artwork background
  - Elegant "Enter" button with spiritual typography
  - Smooth transitions and animations
  - Mobile-responsive design

#### 2. Navigation Header Component
- **Purpose**: Consistent site navigation across all pages
- **Features**:
  - Dharma.com branding
  - Primary navigation: "Aarti Sangrah", "Light a Diya"
  - User authentication status and sign-in button
  - Language toggle (Hindi/English)
  - Responsive mobile menu

#### 3. Aarti Collection Component
- **Purpose**: Browse and display devotional content
- **Features**:
  - Search bar for deity-based filtering
  - Grid layout of deity cards with beautiful imagery
  - Deity names in both Hindi and English
  - Click-through to individual aarti pages

#### 4. Aarti Display Component
- **Purpose**: Present individual prayers with proper formatting
- **Features**:
  - Large deity image with ornate framing
  - Sanskrit/Hindi text with proper Devanagari rendering
  - English transliteration and translation
  - Language toggle functionality
  - Print-friendly formatting

#### 5. Diya Lighting Interface Component
- **Purpose**: Collaborative real-time diya lighting experience
- **Features**:
  - Grid of interactive diya elements
  - Real-time state synchronization
  - User name display on lit diyas
  - Progress counter and celebration statistics
  - Anonymous and authenticated participation modes

### Data Models

#### Content Schema

```typescript
interface Deity {
  id: string;
  name_hindi: string;
  name_english: string;
  image_url: string;
  description_hindi?: string;
  description_english?: string;
  category: string;
}

interface Aarti {
  id: string;
  deity_id: string;
  title_hindi: string;
  title_english: string;
  content_sanskrit: string;
  content_hindi: string;
  content_english: string;
  transliteration: string;
  audio_url?: string;
}

interface Celebration {
  id: string;
  name: string;
  created_by: string;
  created_at: timestamp;
  share_link: string;
  diya_count: number;
  is_active: boolean;
}

interface DiyaLight {
  id: string;
  celebration_id: string;
  position: number;
  lit_by: string;
  lit_at: timestamp;
  user_name: string;
}
```

#### User Schema

```typescript
interface User {
  id: string;
  email?: string;
  google_id?: string;
  display_name: string;
  preferred_language: 'hindi' | 'english';
  created_at: timestamp;
}

interface AnonymousParticipant {
  session_id: string;
  display_name: string;
  celebration_id: string;
}
```

## User Interface Design

### Visual Design System

#### Color Palette
- **Primary**: Deep spiritual blues (#1e3a8a, #3b82f6)
- **Secondary**: Warm golds (#f59e0b, #fbbf24)
- **Accent**: Sacred oranges (#ea580c, #fb923c)
- **Background**: Soft gradients with spiritual imagery
- **Text**: High contrast dark (#1f2937) and light (#f9fafb)

#### Typography
- **Headers**: Elegant serif fonts for spiritual gravitas
- **Hindi/Sanskrit**: Proper Devanagari font stack (Noto Sans Devanagari)
- **English**: Clean sans-serif for readability (Inter, system fonts)
- **Decorative**: Ornate fonts for special elements and deity names

#### Imagery Standards
- **Deity Images**: High-quality, culturally authentic artwork
- **Backgrounds**: Subtle spiritual patterns and gradients
- **Icons**: Minimalist spiritual symbols (lotus, om, diyas)
- **Frames**: Ornate borders for deity portraits and sacred content

### Responsive Design

#### Mobile-First Approach
- **Breakpoints**: 320px, 768px, 1024px, 1280px
- **Navigation**: Collapsible hamburger menu on mobile
- **Content**: Single-column layout with touch-friendly interactions
- **Typography**: Scalable text sizes for readability across devices

#### Desktop Enhancements
- **Layout**: Multi-column grids for content browsing
- **Hover States**: Elegant transitions and interactive feedback
- **Typography**: Larger text sizes for comfortable reading
- **Spacing**: Generous whitespace for visual breathing room

## Error Handling

### Content Loading Errors
- **Graceful Degradation**: Show placeholder content while loading
- **Retry Mechanisms**: Automatic retry for failed content requests
- **Offline Support**: Cache critical spiritual content for offline access
- **Error Messages**: Culturally appropriate, non-technical language

### Real-time Connection Issues
- **Connection Status**: Visual indicators for real-time connectivity
- **Reconnection Logic**: Automatic reconnection with exponential backoff
- **State Synchronization**: Conflict resolution for concurrent diya lighting
- **Fallback Modes**: Degraded functionality when real-time features fail

### Authentication Errors
- **Anonymous Fallback**: Allow content access without authentication
- **Clear Messaging**: Explain authentication requirements for specific features
- **Session Management**: Handle expired sessions gracefully
- **Privacy Respect**: No forced authentication for spiritual content access

## Testing Strategy

### Unit Testing
- **Component Testing**: React component behavior and rendering
- **Utility Functions**: Language switching, content formatting
- **Data Models**: Validation and transformation logic
- **API Integration**: Mock external service responses

### Integration Testing
- **User Flows**: Complete spiritual content browsing experience
- **Authentication**: Google login and anonymous participation flows
- **Real-time Features**: Collaborative diya lighting synchronization
- **Language Switching**: Content translation and persistence

### Performance Testing
- **Content Loading**: Large spiritual text and image optimization
- **Real-time Scalability**: Multiple users in diya lighting sessions
- **Mobile Performance**: Touch interactions and responsive behavior
- **Accessibility**: Screen reader compatibility and keyboard navigation

### Cultural Sensitivity Testing
- **Content Accuracy**: Sanskrit transliteration and translation verification
- **Visual Representation**: Appropriate deity imagery and cultural symbols
- **User Experience**: Respectful interaction patterns for spiritual content
- **Community Feedback**: Beta testing with Hindu community members