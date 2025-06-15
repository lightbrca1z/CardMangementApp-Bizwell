import Link from 'next/link';
import Image from 'next/image';
import { useLogout } from '@/components/components/logout';

export default function Header() {
  const { logout } = useLogout();

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-4">
          <div className="mb-4 sm:mb-0">
            <Image 
              src="/images/logo.png" 
              alt="ビズウェルロゴ" 
              width={200} 
              height={80}
              className="object-contain"
            />
          </div>
          <nav className="w-full sm:w-auto">
            <ul className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4 text-sm sm:text-base">
              <li>
                <Link 
                  href="/" 
                  className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  TOP
                </Link>
              </li>
              <li>
                <Link 
                  href="/routing/tanto" 
                  className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  担当者一覧
                </Link>
              </li>
              <li>
                <Link 
                  href="/routing/kankei" 
                  className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  関係機関一覧
                </Link>
              </li>
              <li>
                <Link 
                  href="/routing/kubun" 
                  className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  区分一覧
                </Link>
              </li>
              <li>
                <Link 
                  href="/routing/area" 
                  className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  エリア一覧
                </Link>
              </li>
              <li>
                <button
                  onClick={(e) => { e.preventDefault(); logout() }}
                  className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  ログアウト
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
} 