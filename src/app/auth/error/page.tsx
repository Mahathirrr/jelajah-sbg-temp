"use client"
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthErrorPage() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    let errorMessage = 'An error occurred during authentication.'
    if (error === 'Email already registered with password') {
        errorMessage = 'This email is already registered with a password. Please sign in using your password or reset it if forgotten.'
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-red-600">Authentication Error</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="mb-6">
                        <p className="text-gray-700">{errorMessage}</p>
                    </div>
                    <div className="space-y-4">
                        <Button asChild className="w-full">
                            <Link href="/auth/signin">Return to Sign In</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/">Go to Homepage</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}