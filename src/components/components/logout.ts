// components/logout.ts

import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export const useLogout = () => {
  "use client"; 
  const router = useRouter()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return { logout }
} 