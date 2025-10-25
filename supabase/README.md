# Dharma Platform Database Schema

This directory contains the database schema and migration files for the Dharma spiritual platform.

## Database Structure

### Tables

#### 1. `deities`
Stores information about Hindu deities.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name_hindi | TEXT | Deity name in Hindi |
| name_english | TEXT | Deity name in English |
| image_url | TEXT | URL to deity image |
| description_hindi | TEXT | Description in Hindi (optional) |
| description_english | TEXT | Description in English (optional) |
| category | TEXT | Deity category (default: 'general') |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### 2. `aartis`
Stores devotional songs and prayers for deities.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| deity_id | UUID | Foreign key to deities table |
| title_hindi | TEXT | Aarti title in Hindi |
| title_english | TEXT | Aarti title in English |
| content_sanskrit | TEXT | Original Sanskrit content |
| content_hindi | TEXT | Hindi translation |
| content_english | TEXT | English translation |
| transliteration | TEXT | Roman transliteration |
| audio_url | TEXT | URL to audio file (optional) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### 3. `users`
Stores user profiles and preferences.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (references auth.users) |
| email | TEXT | User email (optional) |
| google_id | TEXT | Google OAuth ID |
| display_name | TEXT | User display name |
| preferred_language | TEXT | Language preference ('hindi' or 'english') |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### 4. `celebrations`
Stores diya lighting celebration sessions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Celebration name |
| created_by | UUID | Foreign key to users table |
| created_at | TIMESTAMP | Creation timestamp |
| share_link | TEXT | Unique shareable link |
| diya_count | INTEGER | Total number of diyas (default: 108) |
| is_active | BOOLEAN | Whether celebration is active |

#### 5. `diya_lights`
Tracks individual lit diyas in celebrations.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| celebration_id | UUID | Foreign key to celebrations table |
| position | INTEGER | Diya position in grid |
| lit_by | UUID | Foreign key to users table (optional) |
| lit_at | TIMESTAMP | When diya was lit |
| user_name | TEXT | Display name of person who lit diya |

## Relationships

- `aartis.deity_id` → `deities.id` (Many-to-One)
- `users.id` → `auth.users.id` (One-to-One)
- `celebrations.created_by` → `users.id` (Many-to-One)
- `diya_lights.celebration_id` → `celebrations.id` (Many-to-One)
- `diya_lights.lit_by` → `users.id` (Many-to-One, optional)

## Security (Row Level Security)

All tables have Row Level Security (RLS) enabled with appropriate policies:

- **Public read access**: `deities`, `aartis`, `celebrations`, `diya_lights`
- **Authenticated write access**: `deities`, `aartis` (admin functions)
- **User-specific access**: `users` (users can only access their own data)
- **Creator access**: `celebrations` (creators can update their celebrations)
- **Open participation**: `diya_lights` (anyone can light diyas, including anonymous users)

## Setup Instructions

### Option 1: Run Complete Setup
Execute the main setup script to create all tables and seed data:

```sql
-- Run this in your Supabase SQL editor
\i supabase/setup.sql
```

### Option 2: Run Individual Migrations
Execute migration files in order:

```sql
\i supabase/migrations/001_create_deities_table.sql
\i supabase/migrations/002_create_aartis_table.sql
\i supabase/migrations/003_create_users_table.sql
\i supabase/migrations/004_create_celebrations_table.sql
\i supabase/migrations/005_create_diya_lights_table.sql
\i supabase/migrations/006_seed_initial_data.sql
```

## Seed Data

The setup includes initial data for:

- **3 Major Deities**: Hanuman, Ganesha, Saraswati
- **3 Sample Aartis**: One for each deity with Sanskrit, Hindi, and English content
- **Helper Functions**: For generating unique celebration share links

## Indexes

Optimized indexes are created for:
- Deity searches by name and category
- Aarti searches by deity and title
- User lookups by email and Google ID
- Celebration lookups by share link
- Diya light queries by celebration and position

## Functions and Triggers

- `update_updated_at_column()`: Automatically updates `updated_at` timestamps
- `generate_share_link()`: Creates unique share links for celebrations
- `set_celebration_share_link()`: Auto-generates share links if not provided

## Usage Examples

### Query all deities with their aartis:
```sql
SELECT 
  d.name_english,
  d.name_hindi,
  a.title_english,
  a.title_hindi
FROM deities d
LEFT JOIN aartis a ON d.id = a.deity_id
ORDER BY d.name_english;
```

### Get celebration with lit diyas:
```sql
SELECT 
  c.name,
  c.diya_count,
  COUNT(dl.id) as lit_count
FROM celebrations c
LEFT JOIN diya_lights dl ON c.id = dl.celebration_id
WHERE c.share_link = 'celebration-abc123'
GROUP BY c.id, c.name, c.diya_count;
```