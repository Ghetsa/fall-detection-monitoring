import { render, screen } from '@testing-library/react';
import App from '../../pages/_app';
import AppDirPage from '../../pages/page';

jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-provider">{children}</div>
  ),
}));

jest.mock('../../hooks/useAuth', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

describe('app shell pages', () => {
  it('wraps component with session and auth providers', () => {
    render(
      <App
        Component={() => <div>Inner Component</div>}
        pageProps={{ session: null }}
        router={{} as any}
      />
    );

    expect(screen.getByTestId('session-provider')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByText('Inner Component')).toBeInTheDocument();
  });

  it('renders the app router starter page', () => {
    render(<AppDirPage />);

    expect(screen.getByText(/To get started, edit the page.tsx file/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Documentation/i })).toHaveAttribute(
      'href',
      expect.stringContaining('nextjs.org/docs')
    );
  });
});
