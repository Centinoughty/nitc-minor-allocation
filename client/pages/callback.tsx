// pages/auth/callback.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Callback: React.FC = () => {
  const router = useRouter();

  useEffect(() => {

    const isFailed = router.query.failed as string;
    if (isFailed) {
      console.error('Login failed');
      router.push('/?failed=true');
      return;
    }

    // Capture the JWT token from the URL query params
    const token = router.query.token as string;
    const userId = router.query.studentId as string;

    if (token) {
      // Store JWT token in localStorage (or cookie)
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userId', userId);

      // Redirect to the protected page (e.g., dashboard)
      router.push('/courses');
    } else {
      // Handle error
      console.error('JWT token is missing');
    }
  }, [router]);

  return <div>Logging you in...</div>;
};

export default Callback;
