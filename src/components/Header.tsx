import Link from 'next/link';
import { useLogout } from '@/components/components/logout';

export default function Header() {
  const { logout } = useLogout();

  return (
    <header className="w-full flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto mb-8">
      <div className="text-3xl font-bold text-purple-600">IT就労 ビズウェル</div>
      <nav className="flex space-x-4 text-pink-700 text-sm sm:text-base">
        <Link href="/">TOP</Link>
        <Link href="/routing/tanto">担当者一覧</Link>
        <Link href="/routing/kankei">関係機関一覧</Link>
        <Link href="/routing/kubun">区分一覧</Link>
        <Link href="/routing/area">エリア一覧</Link>
        <Link href="#" onClick={(e) => { e.preventDefault(); logout() }}>ログアウト</Link>
      </nav>
    </header>
  );
} 