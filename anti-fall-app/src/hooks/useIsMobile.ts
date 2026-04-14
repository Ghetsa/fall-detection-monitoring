import { useEffect, useState } from 'react';

export function useIsMobile(breakpoint = 768) {
  const getInitialValue = () => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.innerWidth < breakpoint;
  };

  const [isMobile, setIsMobile] = useState(getInitialValue);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}
