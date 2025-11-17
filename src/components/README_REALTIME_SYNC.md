# Real-time Synchronization for Diya Lighting

## Overview

The diya lighting system uses Supabase Realtime to synchronize diya lighting events across all connected participants in real-time. This ensures that when one user lights a diya, all other users viewing the same celebration see the update instantly.

## Implementation Details

### Connection Status Monitoring

The `CelebrationView` component displays a live connection status indicator in the top-right corner:

- **Green "Live"**: Successfully connected to real-time updates
- **Yellow "Connecting..."**: Attempting to establish connection
- **Red "Disconnected"**: Connection lost or failed

The status is monitored through Supabase channel system events:
- `SUBSCRIBED`: Connection established
- `CHANNEL_ERROR`: Connection error occurred
- `TIMED_OUT`: Connection attempt timed out

### Real-time Updates

When a diya is lit:

1. The `lightDiya` function inserts a new record into the `diya_lights` table
2. Supabase broadcasts this INSERT event to all subscribed clients
3. Each client's `onDiyaLit` callback receives the new diya data
4. The local state is updated to reflect the newly lit diya
5. Statistics are recalculated and updated

### Concurrent Lighting Conflict Resolution

To handle the case where multiple users try to light the same diya simultaneously:

1. Before lighting, the system checks if the position is still available using `isDiyaPositionAvailable`
2. This function queries the database to verify no other user has lit that diya
3. If the position is taken, the user receives a friendly error message
4. The user can then select a different diya

This prevents race conditions and ensures data consistency.

### Subscription Lifecycle

```typescript
// Subscribe on component mount
useEffect(() => {
  const channel = subscribeToFullCelebration(celebrationId, {
    onDiyaLit: (payload) => {
      // Handle new diya lit event
    }
  });

  // Monitor connection status
  channel.on('system', {}, (payload) => {
    // Update connection status based on payload.status
  });

  // Cleanup on unmount
  return () => {
    unsubscribeChannel(channel);
  };
}, [celebrationId]);
```

### Database Configuration

Real-time is enabled for the following tables:
- `celebrations`: For celebration metadata updates
- `diya_lights`: For diya lighting events

See `supabase/migrations/008_enable_realtime_for_diya_lighting.sql` for the database configuration.

## User Experience

### Visual Feedback

- **Connection Status**: Always visible indicator showing real-time connection state
- **Instant Updates**: Diyas light up immediately for all participants
- **Loading States**: Individual diyas show loading spinner while being lit
- **Error Messages**: Clear feedback when conflicts or errors occur

### Performance

- **Optimistic Updates**: Local state updates immediately after successful API call
- **Efficient Subscriptions**: Single channel subscription for all celebration updates
- **Automatic Reconnection**: Supabase handles reconnection automatically
- **Minimal Bandwidth**: Only changed data is transmitted

## Testing Real-time Sync

To test real-time synchronization:

1. Create a celebration and get the shareable link
2. Open the celebration in two different browser windows/tabs
3. Light a diya in one window
4. Verify it appears instantly in the other window
5. Check the connection status indicator remains green
6. Try lighting the same diya simultaneously from both windows
7. Verify conflict resolution works correctly

## Troubleshooting

### Connection Issues

If users experience disconnection:
- Check Supabase project status
- Verify real-time is enabled in Supabase dashboard
- Check browser console for WebSocket errors
- Ensure network allows WebSocket connections

### Sync Delays

If updates are delayed:
- Check network latency
- Verify Supabase region is optimal for users
- Monitor Supabase real-time metrics
- Check for rate limiting

### Conflict Resolution

If multiple users light the same diya:
- The database constraint ensures only one record per position
- The first request succeeds, subsequent requests fail gracefully
- Users receive clear feedback to choose another diya
