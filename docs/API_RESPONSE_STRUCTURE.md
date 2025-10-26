# API Response Structure

This document explains the structure of API responses in the Dharma Platform.

## Standard Response Format

All API endpoints return responses in this format:

```typescript
interface ApiResponse<T = unknown> {
  data?: T                    // The actual data (deities, aartis, etc.)
  error?: string             // Error message if request failed
  code?: string              // Error code for programmatic handling
  message?: string           // Human-readable message
  count?: number             // Number of items returned
  filters?: Record<string, unknown>  // Applied filters
  pagination?: {             // Pagination info (if applicable)
    page: number
    limit: number
    total: number
    hasNext: boolean
    hasPrev: boolean
  }
  setupRequired?: boolean    // Only present when database setup is needed
}
```

## Success Response Examples

### Normal Operation (Database Working)
```json
{
  "data": [
    {
      "id": "123",
      "name_english": "Lord Ganesha",
      "name_hindi": "श्री गणेश जी",
      // ... other deity fields
    }
  ],
  "count": 3,
  "filters": {
    "search": null,
    "category": null,
    "limit": null
  }
}
```

### Database Setup Required
```json
{
  "data": [],
  "count": 0,
  "message": "Database not set up. Please run the setup script.",
  "setupRequired": true
}
```

## Error Response Examples

### Validation Error
```json
{
  "error": "Invalid limit parameter",
  "code": "INVALID_LIMIT"
}
```

### Database Error
```json
{
  "error": "Database connection failed",
  "code": "CONNECTION_ERROR"
}
```

## Field Descriptions

### `setupRequired` Field

- **Type**: `boolean` (optional)
- **When Present**: Only when database tables don't exist or can't be accessed
- **Purpose**: Triggers the database setup instructions in the UI
- **Default**: Not included in response (treated as `false` by client)

### Usage in React Hooks

```typescript
const data: ApiResponse<Deity[]> = await response.json();

// setupRequired is optional - use nullish coalescing for safety
const needsSetup = data.setupRequired ?? false;

if (needsSetup) {
  // Show database setup instructions
} else {
  // Show normal content
}
```

## Error Handling

The client should handle responses in this order:

1. **Check for HTTP errors** (non-200 status codes)
2. **Check for API errors** (`data.error` field)
3. **Check for setup requirement** (`data.setupRequired` field)
4. **Process normal data** (`data.data` field)

```typescript
// Example error handling
if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}

const data = await response.json();

if (data.error) {
  throw new Error(data.error);
}

if (data.setupRequired) {
  setSetupRequired(true);
  return;
}

// Process normal data
setDeities(data.data || []);
```

## Database States

| Database State | `setupRequired` | `data` | Behavior |
|---------------|----------------|--------|----------|
| Working | Not included | Array of items | Show normal content |
| Missing tables | `true` | Empty array | Show setup instructions |
| Connection error | Not included | N/A | Show error message |
| Empty (no data) | Not included | Empty array | Show "no items found" |

This structure ensures graceful handling of all database states while maintaining type safety.