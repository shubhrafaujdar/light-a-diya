import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthButton from '../AuthButton';
import { useAuth } from '@/hooks/useAuth';

// Mock the useAuth hook
jest.mock('@/hooks/useAuth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('AuthButton', () => {
  const mockSignIn = jest.fn();
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state when loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      error: null,
      signIn: mockSignIn,
      signOut: mockSignOut,
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
      signIn: mockSignIn,
      signOut: mockSignOut,
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
      signIn: mockSignIn,
      signOut: mockSignOut,
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
      signIn: mockSignIn,
      signOut: mockSignOut,
      updatePreferences: jest.fn(),
    });

    render(<AuthButton />);
    fireEvent.click(screen.getByText('Login with Google'));
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledTimes(1);
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
      signIn: mockSignIn,
      signOut: mockSignOut,
      updatePreferences: jest.fn(),
    });

    render(<AuthButton />);
    fireEvent.click(screen.getByText('Logout'));
    
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });
});