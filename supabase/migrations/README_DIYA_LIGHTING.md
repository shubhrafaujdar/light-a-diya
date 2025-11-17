# Diya Lighting Database Schema Documentation

## Overview

The diya lighting feature enables collaborative virtual diya lighting ceremonies where multiple users can participate in real-time. This document describes the database schema, real-time subscriptions, and helper functions.

## Database Tables

### celebrations

Stores information about diya lighting celebrations/ceremonies.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, auto-generated |
| name | TEXT | Name of the celebration |
| created_by | UUID | Foreign key to users table (nullable) |
| created_at | TIMESTAMP | Creation timestamp |
| share_link | TEXT | Unique shareable link for the celebration |
| diya_count | INTEGER | Total number of diyas available (default: 108) |
| is_active | BOOLEAN | Whether the celebration is active |

**Indexes:**
- `idx_celebrations_share_link` on `share_link`
- `idx_celebrations_created_by` on `created_by`
- `idx_celebrations_is_active` on `is_active`

**Row Level Security Policies:**
- Read access: All users (public celebrations)
- Insert: Authenticated users only
- Update: Only the creator can update their celebrations

### diya_lights

Tracks individual lit diyas within celebrations.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, auto-generated |
| celebration_id | UUID | Foreign key to celebrations table |
| position | INTEGER | Position of the diya (1 to diya_count) |
| lit_by | UUID | Foreign key to users table (nullable for anonymous) |
| lit_at | TIMESTAMP | When the diya was lit |
| user_name | TEXT | Display name of the person who lit the diya |

**Constraints:**
- UNIQUE constraint on `(celebration_id, position)` - each position can only be lit once

**Indexes:**
- `idx_diya_lights_celebration_id` on `celebration_id`
- `idx_diya_lights_lit_by` on `lit_by`
- `idx_diya_lights_position` on `(celebration_id, position)`

**Row Level Security Policies:**
- Read access: All users
- Insert: Anyone (including anonymous users)
- Update: Prevented (diyas cannot be changed once lit)

## Real-time Subscriptions

Both tables have real-time replication enabled with `REPLICA IDENTITY FULL`, allowing clients to subscribe to changes.

### Subscribing to Celebrations

```typescript
import { subscribeToCelebration } from '@/lib/diya-lighting';

const channel = subscribeToCelebration(celebrationId, (payload) => {
  console.log('Celebration updated:', payload.new);
});

// Cleanup
await unsubscribeChannel(channel);
```

### Subscribing to Diya Lights

```typescript
import { subscribeToDiyaLights } from '@/lib/diya-lighting';

const channel = subscribeToDiyaLights(celebrationId, (payload) => {
  console.log('New diya lit:', payload.new);
});

// Cleanup
await unsubscribeChannel(channel);
```

### Combined Subscription

```typescript
import { subscribeToFullCelebration } from '@/lib/diya-lighting';

const channel = subscribeToFullCelebration(celebrationId, {
  onCelebrationUpdate: (payload) => {
    console.log('Celebration updated:', payload.new);
  },
  onDiyaLit: (payload) => {
    console.log('New diya lit:', payload.new);
  },
});

// Cleanup
await unsubscribeChannel(channel);
```

## Database Functions

### get_celebration_stats(celebration_uuid UUID)

Returns statistics for a celebration.

**Returns:**
```typescript
{
  total_diyas: number;
  lit_diyas: number;
  unique_participants: number;
  completion_percentage: number;
}
```

**Usage:**
```typescript
import { getCelebrationStats } from '@/lib/diya-lighting';

const { data, error } = await getCelebrationStats(celebrationId);
```

### is_diya_position_available(celebration_uuid UUID, diya_position INTEGER)

Checks if a specific diya position is available to be lit.

**Returns:** `BOOLEAN`

**Usage:**
```typescript
import { isDiyaPositionAvailable } from '@/lib/diya-lighting';

const { data, error } = await isDiyaPositionAvailable(celebrationId, 42);
```

### get_next_available_position(celebration_uuid UUID)

Returns the next available diya position, or NULL if all are lit.

**Returns:** `INTEGER` or `NULL`

**Usage:**
```typescript
import { getNextAvailablePosition } from '@/lib/diya-lighting';

const { data, error } = await getNextAvailablePosition(celebrationId);
```

### get_user_participation(celebration_uuid UUID, participant_name TEXT)

Returns all diyas lit by a specific user in a celebration.

**Returns:**
```typescript
Array<{
  diya_position: number;
  lit_at: string;
}>
```

**Usage:**
```typescript
import { getUserParticipation } from '@/lib/diya-lighting';

const { data, error } = await getUserParticipation(celebrationId, 'John Doe');
```

## Triggers

### trigger_update_celebration_lit_count

Automatically updates the `diya_count` field in the celebrations table when a new diya is lit.

**Trigger Event:** AFTER INSERT on `diya_lights`

**Function:** `update_celebration_lit_count()`

This ensures the celebration statistics are always up-to-date without requiring manual updates.

## Usage Examples

### Creating a Celebration

```typescript
import { createCelebration } from '@/lib/diya-lighting';

const { data, error } = await createCelebration(
  'Diwali 2024',
  userId,
  108 // number of diyas
);
```

### Lighting a Diya

```typescript
import { lightDiya } from '@/lib/diya-lighting';

const { data, error } = await lightDiya(
  celebrationId,
  42, // position
  'John Doe', // display name
  userId // optional, for authenticated users
);
```

### Getting All Lit Diyas

```typescript
import { getLitDiyas } from '@/lib/diya-lighting';

const { data, error } = await getLitDiyas(celebrationId);
```

## Migration Files

- `004_create_celebrations_table.sql` - Creates celebrations table with RLS policies
- `005_create_diya_lights_table.sql` - Creates diya_lights table with RLS policies
- `008_enable_realtime_for_diya_lighting.sql` - Enables real-time replication and adds trigger
- `009_add_participation_tracking.sql` - Adds helper functions for statistics and participation tracking

## Security Considerations

1. **Anonymous Participation**: The schema allows anonymous users to light diyas by not requiring authentication for INSERT operations on `diya_lights`.

2. **Immutable Diyas**: Once a diya is lit, it cannot be updated or deleted (enforced by RLS policy).

3. **Public Celebrations**: All celebrations are readable by anyone with the link, supporting the collaborative nature of the feature.

4. **Creator Control**: Only the creator of a celebration can update its properties (name, active status, etc.).

## Performance Considerations

1. **Indexes**: All foreign keys and frequently queried columns have indexes for optimal performance.

2. **Unique Constraint**: The unique constraint on `(celebration_id, position)` prevents race conditions when multiple users try to light the same diya.

3. **Real-time Efficiency**: Using `REPLICA IDENTITY FULL` ensures all column values are available in real-time payloads without additional queries.

4. **Automatic Statistics**: The trigger automatically maintains celebration statistics, eliminating the need for expensive COUNT queries.
