"use client"
import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        const session = await getSession()

        if ((session?.user as any)?.role === 'ADMIN') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{
          backgroundImage: "url('https://www.safariwisata.co.id/wp-content/uploads/2020/02/Sunset-Sabang-Pulau-Weh-3-KM-0-Indonesia.jpg')",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col pt-20">
        {/* Login Card */}
        <div className="container mx-auto flex items-center justify-center px-4 py-8">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl">

            <CardHeader className="relative z-10 space-y-2 pb-6 pt-8">
              <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Selamat Datang Kembali
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Masuk ke akun Anda untuk menjelajahi Keajaiban Sabang
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10">
              <Button
                onClick={handleGoogleSignIn}
                className="w-full mb-6 bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <svg className="w-5 h-5 transition-transform group-hover:scale-110 duration-300" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">Masuk dengan Google</span>
              </Button>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="text-sm text-gray-500 whitespace-nowrap">Atau masuk dengan</span>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200 animate-pulse">
                    {error}
                  </div>
                )}

                <div className="group">
                  <Label htmlFor="email" className="text-gray-700 font-medium block mb-1 group-focus-within:text-blue-600 transition-colors">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-300"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="group">
                  <Label htmlFor="password" className="text-gray-700 font-medium block mb-1 group-focus-within:text-blue-600 transition-colors">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium py-2.5 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </div>
                  ) : 'Masuk'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Belum memiliki akun?{' '}
                  <Link href="/auth/signup" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300">
                    Daftar sekarang
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}