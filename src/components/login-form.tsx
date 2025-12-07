'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { VerifyEmailMessage } from "@/components/verify-email-message"
import Image from "next/image"
import Link from "next/link"
import loginImage from "@/assets/welcome-back.jpg"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter()
  const { user, signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showVerifyEmail, setShowVerifyEmail] = useState(false)

  // Get redirect URL from query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const redirectUrl = params.get('redirect')
    if (user && redirectUrl) {
      router.push(redirectUrl)
    } else if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    try {
      const result = await signIn(email, password)
      if (!result.isSignedIn && result.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        setShowVerifyEmail(true)
        return
      }
      const params = new URLSearchParams(window.location.search)
      const redirectUrl = params.get('redirect')
      if (redirectUrl) {
        router.push(redirectUrl)
      } else {
        router.push("/")
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to sign in')
    }
  }

  const handleBackToLogin = () => {
    setShowVerifyEmail(false)
    setEmail("")
    setPassword("")
    setError("")
  }

  // Don't render the form if user is logged in
  if (user) {
    return null
  }

  if (showVerifyEmail) {
    return <VerifyEmailMessage 
      email={email} 
      className={className} 
      onLoginClick={handleBackToLogin}
    />
  }

  return (
    <div className={cn("flex flex-col gap-6 animate-fade-in", className)} {...props}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-500">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8 animate-fade-up" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold gradient-text-animated">Welcome back</h1>
                <p className="text-balance text-muted-foreground mt-2">
                  Login to your Impact Board account
                </p>
              </div>
              <div className="grid gap-2 animate-scale-in" style={{ animationDelay: '100ms' }}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-all duration-200 focus:scale-105"
                />
              </div>
              <div className="grid gap-2 animate-scale-in" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline transition-all duration-200 hover:text-primary"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <PasswordInput 
                  id="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-all duration-200 focus:scale-105"
                />
              </div>
              {error && (
                <div className="text-sm text-red-500 text-center animate-scale-in">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full hover-lift hover:shadow-lg animate-scale-in" style={{ animationDelay: '300ms' }}>
                Login
              </Button>
              <div className="text-center text-sm animate-fade-in" style={{ animationDelay: '400ms' }}>
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4 hover:text-primary transition-colors duration-200">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block overflow-hidden">
            <Image
              src={loginImage}
              width={500}
              height={500}
              alt="Sustainability platform community"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
