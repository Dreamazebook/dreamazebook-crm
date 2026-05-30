import { Suspense } from 'react';
import LoginModal from './(website)/components/LoginModal';

export default function HomePage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <LoginModal showCloseButton={false} />
      </Suspense>
    </div>
  );
}
