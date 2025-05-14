"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className={`text-2xl font-bold ${isScrolled ? 'text-blue-600' : 'text-white'}`}>
                JelajahSabang
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['Beranda', 'Destinasi', 'Akomodasi', 'Kuliner', 'Kontak'].map((item, index) => (
              <Link
                key={index}
                href={item === 'Beranda' ? '/' : `/${item.toLowerCase()}`}
                className={`${isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white/90 hover:text-white'
                  } transition-colors font-medium`}
              >
                {item}
              </Link>
            ))}

            {/* Auth Section */}
            {session ? (
              <div className="flex items-center space-x-4">
                <span className={isScrolled ? 'text-gray-600' : 'text-white/90'}>
                  Hi, {session.user?.name}
                </span>
                <Link
                  href="/dashboard"
                  className={`${isScrolled ? 'text-blue-600 hover:text-blue-700' : 'text-white/90 hover:text-white'
                    } transition-colors`}
                >
                  Dashboard
                </Link>
                {(session.user as any)?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className={`${isScrolled ? 'text-blue-600 hover:text-blue-700' : 'text-white/90 hover:text-white'
                      } transition-colors`}
                  >
                    Admin
                  </Link>
                )}
                <Button
                  onClick={() => signOut()}
                  variant={isScrolled ? "outline" : "secondary"}
                  size="sm"
                  className={isScrolled ? 'border-blue-600 text-blue-600 hover:bg-blue-50' : 'text-blue-600'}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  asChild
                  variant={isScrolled ? "outline" : "secondary"}
                  size="sm"
                  className={isScrolled ? 'border-blue-600 text-blue-600 hover:bg-blue-50' : 'text-blue-600'}
                >
                  <Link href="/auth/signin">Login</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className={isScrolled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white text-blue-600 hover:bg-gray-100'}
                >
                  <Link href="/auth/signup">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${isScrolled ? 'text-gray-600' : 'text-white'} hover:opacity-75`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white rounded-lg shadow-lg mt-2 overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {['Beranda', 'Destinasi', 'Akomodasi', 'Kuliner', 'Kontak'].map((item, index) => (
                  <Link
                    key={index}
                    href={item === 'Beranda' ? '/' : `/${item.toLowerCase()}`}
                    className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    {item}
                  </Link>
                ))}
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-1 p-3">
                    <Button asChild variant="outline" className="w-full mb-2">
                      <Link href="/auth/signin">Login</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/auth/signup">Register</Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}