import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthButton from '../AuthButton';
import { useAuth } from '@/components/AuthProvider';
import { authService } from '@/lib/auth';

// Mock the AuthProvider hook
jest.mock('@/components/AuthProvider');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock lib/auth
jest.mock('@/lib/auth', () => ({
  authService: {
    signInWithGoogle: jest.fn(),
    signOut: jest.fn(),
  },
}));

describe('AuthButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state when loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      error: null,
      updatePreferences: jest.fn(),
    });

    render(<AuthButton />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows login button when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      updatePreferences: jest.fn(),
    });

    render(<AuthButton />);
    expect(screen.getByText('Login with Google')).toBeInTheDocument();
  });

  it('shows user info and logout button when user is authenticated', () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      preferredLanguage: 'english' as const,
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: null,
      updatePreferences: jest.fn(),
    });

    render(<AuthButton />);
    expect(screen.getByText('Hey, Test User!')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls signIn when login button is clicked', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      updatePreferences: jest.fn(),
    });

    render(<AuthButton />);
    fireEvent.click(screen.getByText('Login with Google'));

    await waitFor(() => {
      expect(authService.signInWithGoogle).toHaveBeenCalledTimes(1);
    });
  });

  it('calls signOut when logout button is clicked', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      preferredLanguage: 'english' as const,
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      error: null,
      updatePreferences: jest.fn(),
    });

    render(<AuthButton />);
    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(authService.signOut).toHaveBeenCalledTimes(1);
    });
  });
});