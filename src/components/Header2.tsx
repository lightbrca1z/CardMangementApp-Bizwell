import Link from 'next/link';
import Image from 'next/image';
import { useLogout } from '@/components/components/logout';

export default function Header() {
  const { logout } = useLogout();

  return (
    <header className="w-full flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto mb-8">
      <div className="h-12">
        <Image
          src="/images/logo.png"
          alt="IT就労 ビズウェル"
          width={200}
          height={48}
          priority
        />
      </div>
    </header>
  );
} 