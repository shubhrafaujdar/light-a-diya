# Diya Lighting Components

This directory contains the interactive diya lighting interface components for collaborative virtual diya ceremonies.

## Components

### Diya.tsx
Individual diya component with the following features:
- **Visual States**: Unlit (gray) and lit (glowing amber/orange gradient)
- **Flame Animation**: Animated flame effect for lit diyas with pulsing glow
- **Interactive**: Click to light (when unlit and enabled)
- **Tooltip**: Shows user name on hover for lit diyas
- **Loading State**: Spinner animation while lighting
- **Accessibility**: Proper ARIA labels and keyboard support

### DiyaGrid.tsx
Grid layout component that manages multiple diyas:
- **Responsive Grid**: Automatically adjusts columns based on total diya count
  - 9 diyas: 3 columns
  - 16 diyas: 4 columns
  - 36 diyas: 6 columns
  - 64 diyas: 8 columns
  - 108+ diyas: 9-12 columns (responsive)
- **Click Handling**: Manages diya lighting with conflict prevention
- **Loading States**: Prevents multiple simultaneous lighting attempts
- **Touch-Friendly**: Optimized spacing for mobile interactions

### CelebrationView.tsx
Main celebration page component with full functionality:
- **Real-time Updates**: Subscribes to Supabase Realtime for instant diya lighting updates
- **Statistics Display**: Shows lit diyas count, participants, and completion percentage
- **Progress Bar**: Visual representation of celebration completion
- **User Name Input**: Modal for anonymous users to enter their name
- **Share Functionality**: Modal with shareable link and copy-to-clipboard
- **Error Handling**: Graceful error messages and loading states
- **Authentication Integration**: Works with both authenticated and anonymous users

## Usage

### Creating a Celebration
```typescript
import { createCelebration } from '@/lib/diya-lighting';

const { data, error } = await createCelebration(
  'Diwali 2024',
  userId,
  108 // number of diyas
);
```

### Displaying a Celebration
```tsx
import { CelebrationView } from '@/components/CelebrationView';

<CelebrationView celebrationId={celebrationId} />
```

## Pages

### /diya
Creation page where authenticated users can:
- Create new celebrations with custom names
- Choose number of diyas (9, 21, 51, or 108)
- Get shareable links
- View instructions on how it works

### /celebrations/[celebrationId]
Celebration page where anyone can:
- View celebration name and statistics
- Light available diyas in real-time
- See other participants' lit diyas
- Share the celebration link
- Participate anonymously or as authenticated user

## Real-time Features

The diya lighting interface uses Supabase Realtime to provide:
- **Instant Updates**: All participants see diyas light up immediately
- **Conflict Prevention**: Database constraints prevent multiple users from lighting the same diya
- **Live Statistics**: Participant count and completion percentage update in real-time
- **Connection Management**: Automatic reconnection and cleanup

## Styling

Components use the spiritual design system:
- **Colors**: Warm amber/orange gradients for lit diyas, spiritual blues for UI
- **Animations**: Gentle glowing effects, smooth transitions
- **Typography**: Supports both Hindi and English text
- **Responsive**: Mobile-first design with touch-friendly interactions

## Accessibility

- Semantic HTML with proper ARIA labels
- Keyboard navigation support
- Screen reader compatible
- High contrast ratios for text
- Focus indicators for interactive elements
