# Celebration Management Features

## Overview

The celebration management system provides creators with tools to manage their diya lighting celebrations, including creating, editing, viewing statistics, and sharing celebrations with others.

## Features

### 1. Celebration Creation

**Location**: `/diya` page

Users can create new celebrations with:
- **Custom Name**: Give the celebration a meaningful name (e.g., "Diwali 2024", "Family Gathering")
- **Diya Count**: Choose from sacred numbers (9, 21, 51, 108 diyas)
- **Unique Share Link**: Automatically generated shareable URL
- **Authentication Required**: Only authenticated users can create celebrations

### 2. Celebration List

**Location**: `/celebrations` page

Features:
- View all celebrations created by the user
- See celebration status (Active/Inactive)
- Quick access to each celebration
- Display creation date and diya count
- Empty state with call-to-action for first celebration

### 3. Celebration Management

**Location**: Individual celebration page (`/celebrations/[id]`)

#### For Creators Only:

**Edit Name**:
- Click the edit icon next to the celebration name
- Inline editing with save/cancel buttons
- Real-time update across all participants
- Keyboard shortcuts: Enter to save, Escape to cancel

**Management Modal**:
- Access via settings icon in header
- View detailed statistics:
  - Total diyas
  - Lit diyas
  - Number of participants
  - Completion percentage
- Quick actions:
  - Share celebration
  - Edit name
- Creator-only access

**Share Functionality**:
- One-click share button
- Copy shareable link to clipboard
- Visual feedback on successful copy
- Works for both creators and participants

### 4. Real-time Statistics

All participants can view:
- **Lit Diyas Count**: Number of diyas currently lit
- **Participants Count**: Unique users who have lit diyas
- **Completion Percentage**: Progress toward lighting all diyas
- **Progress Bar**: Visual representation of completion

### 5. Connection Status

**Real-time Indicator**:
- Green "Live": Connected and receiving updates
- Yellow "Connecting...": Establishing connection
- Red "Disconnected": Connection lost

## User Flows

### Creating a Celebration

1. Navigate to `/diya`
2. Sign in with Google (if not already authenticated)
3. Enter celebration name
4. Select number of diyas
5. Click "Create Celebration"
6. Automatically redirected to celebration page
7. Share link with friends and family

### Managing a Celebration

1. Navigate to `/celebrations` to see all your celebrations
2. Click on a celebration to view it
3. As creator, you can:
   - Edit the celebration name
   - View detailed statistics
   - Share the celebration link
   - Monitor real-time participation

### Participating in a Celebration

1. Receive shareable link from creator
2. Open link in browser
3. Enter your name (if not signed in)
4. Click on unlit diyas to light them
5. See real-time updates as others light diyas
6. View progress and statistics

## API Functions

### Celebration Management Functions

```typescript
// Create a new celebration
createCelebration(name: string, userId: string, diyaCount: number)

// Get celebration by ID
getCelebration(celebrationId: string)

// Update celebration details
updateCelebration(celebrationId: string, updates: Partial<Celebration>)

// Get all celebrations for a user
getUserCelebrations(userId: string)

// Deactivate a celebration
deactivateCelebration(celebrationId: string)

// Reactivate a celebration
reactivateCelebration(celebrationId: string)
```

### Statistics Functions

```typescript
// Get celebration statistics
getCelebrationStats(celebrationId: string)

// Get user participation in a celebration
getUserParticipation(celebrationId: string, userName: string)
```

## Database Schema

### Celebrations Table

```sql
CREATE TABLE celebrations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  share_link TEXT UNIQUE NOT NULL,
  diya_count INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);
```

### Diya Lights Table

```sql
CREATE TABLE diya_lights (
  id UUID PRIMARY KEY,
  celebration_id UUID REFERENCES celebrations(id),
  position INTEGER NOT NULL,
  lit_by UUID,
  lit_at TIMESTAMP DEFAULT NOW(),
  user_name TEXT NOT NULL,
  UNIQUE(celebration_id, position)
);
```

## Security

### Access Control

- **Creation**: Only authenticated users can create celebrations
- **Participation**: Anyone with the link can participate (anonymous or authenticated)
- **Management**: Only the creator can edit celebration details
- **Viewing**: Anyone with the link can view the celebration

### Data Validation

- Celebration names are trimmed and validated
- Diya positions are checked for availability before lighting
- Concurrent lighting conflicts are handled gracefully
- User names are required for participation

## Performance Considerations

### Optimizations

- **Real-time Updates**: Only changed data is transmitted
- **Efficient Queries**: Database functions for statistics
- **Client-side Caching**: Celebration data cached locally
- **Lazy Loading**: Components loaded on demand

### Scalability

- **Database Indexes**: On celebration_id and user_id
- **Real-time Channels**: One channel per celebration
- **Connection Pooling**: Managed by Supabase
- **Rate Limiting**: Handled at database level

## Future Enhancements

Potential features for future development:
- Celebration templates with pre-set configurations
- Custom diya arrangements and patterns
- Celebration themes and color schemes
- Export celebration statistics and participant list
- Celebration archiving and history
- Notification system for celebration milestones
- Social sharing with preview cards
- Celebration analytics dashboard
