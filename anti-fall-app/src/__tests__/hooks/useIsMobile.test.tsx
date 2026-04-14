import { render, screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { useIsMobile } from '../../hooks/useIsMobile';

function Probe() {
  const isMobile = useIsMobile();
  return <div>{isMobile ? 'mobile' : 'desktop'}</div>;
}

describe('useIsMobile', () => {
  it('returns desktop for wide viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    render(<Probe />);
    expect(screen.getByText('desktop')).toBeInTheDocument();
  });

  it('updates when viewport becomes mobile', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    render(<Probe />);

    act(() => {
      window.innerWidth = 480;
      window.dispatchEvent(new Event('resize'));
    });

    expect(screen.getByText('mobile')).toBeInTheDocument();
  });
});
