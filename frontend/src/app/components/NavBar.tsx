"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/components/ProductedRoute"

const NavBar = () => {
  const {authUser, isLoading} = useAuth();
    const pathName = usePathname();
    const linkStyle = (path: string) => `px-3 py-2 rounded ${pathName === path ? 'bg-blue-300 text-white' : 'text-gray-700 hover:bg-gray-100'}`
  return (
    <nav className="flex gap-2 bg-white p-3 shadow mb-6">
      
      {authUser && <Link href="/notes" className={linkStyle("/notes")}>Notes</Link>}
      {authUser && <Link href="/notes/add" className={linkStyle("/notes/add")}>Add</Link>}
      {authUser && <Link href={`/profile`} className={linkStyle("/profile/")}>Profile</Link>}
      <div className="ml-auto flex gap-2">
        {authUser && <Link href="/auth/login" className={linkStyle("/auth/login")}>Login</Link>}
        {authUser && <Link href="/auth/signup" className={linkStyle("/auth/signup")}>Signup</Link>}
      </div>
    </nav>
  )
}

export default NavBar