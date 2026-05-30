'use client';
import LoginModal from './(website)/components/LoginModal';

export default function HomePage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginModal showCloseButton={false} />
    </div>
  );
}
