"use client";

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Language } from '@/types';

interface UserProfileProps {
  onClose?: () => void;
}

export default function UserProfile({ onClose }: UserProfileProps) {
  const { user, updatePreferences, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(user?.preferredLanguage || 'english');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      await updatePreferences({
        displayName: displayName.trim() || user.displayName,
        preferredLanguage,
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user.displayName);
    setPreferredLanguage(user.preferredLanguage);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-spiritual-primary">Profile Settings</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close profile"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600">
            {user.email || 'Not provided'}
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spiritual-primary focus:border-transparent"
              placeholder="Enter your display name"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
              {user.displayName}
            </div>
          )}
        </div>

        {/* Preferred Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Language
          </label>
          {isEditing ? (
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value as Language)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spiritual-primary focus:border-transparent"
            >
              <option value="english">English</option>
              <option value="hindi">हिंदी (Hindi)</option>
            </select>
          ) : (
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
              {user.preferredLanguage === 'hindi' ? 'हिंदी (Hindi)' : 'English'}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        {isEditing ? (
          <>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-spiritual-primary border border-transparent rounded-md hover:bg-spiritual-primary-light focus:outline-none focus:ring-2 focus:ring-spiritual-primary disabled:opacity-50 transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-spiritual-primary bg-spiritual-primary/10 border border-spiritual-primary/20 rounded-md hover:bg-spiritual-primary/20 focus:outline-none focus:ring-2 focus:ring-spiritual-primary disabled:opacity-50 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}