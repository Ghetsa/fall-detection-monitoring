import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CustomerIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/customer/dashboard');
  }, [router]);

  return null;
}