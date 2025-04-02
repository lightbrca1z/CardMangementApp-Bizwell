// lib/logout.ts

import { supabase } from './supabaseClient'
import { useRouter } from 'next/navigation'

export const useLogout = () => {
  "use client"; 
  const router = useRouter()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/routing/login')
  }

  return { logout }
}
