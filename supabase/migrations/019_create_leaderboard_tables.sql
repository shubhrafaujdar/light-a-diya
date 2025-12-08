-- Migration: Create Quiz Attempts Table for Leaderboard
-- Description: Tracks user quiz attempts including score and time taken.
-- Date: 2025-12-07

-- ============================================
-- Create quiz_attempts table
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for anonymous users
  user_name TEXT NOT NULL, -- "A Devotee" or custom name for anon, or profile name for logged-in
  category_id UUID REFERENCES quiz_categories(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_taken_seconds INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon or logged in) to insert their own attempt
-- Note: We trust the server/client to send correct data, validation should happen on server action or via constraints if possible.
-- For simplicity, we allow public insert but we might want to restrict this in production.
CREATE POLICY "Enable insert for all users"
ON quiz_attempts FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to read attempts (for leaderboard)
CREATE POLICY "Enable select for all users"
ON quiz_attempts FOR SELECT
TO public
USING (true);

-- ============================================
-- Indexes for Leaderboard Performance
-- ============================================
-- We query by category_id and order by score DESC, time_taken_seconds ASC
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_leaderboard 
ON quiz_attempts(category_id, score DESC, time_taken_seconds ASC);

-- Index for finding user's past attempts if needed
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id 
ON quiz_attempts(user_id);
