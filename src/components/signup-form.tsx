'use client'

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { VerifyEmailMessage } from "./verify-email-message"
import { Check, X } from "lucide-react"

interface PasswordRequirements {
  hasUpperCase: boolean
  hasLowerCase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
}

const validatePassword = (password: string): PasswordRequirements => {
  return {
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  }
}

const isPasswordValid = (requirements: PasswordRequirements): boolean => {
  return (
    requirements.hasUpperCase &&
    requirements.hasLowerCase &&
    requirements.hasNumber &&
    requirements.hasSpecialChar
  )
}

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user"
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSignupComplete, setIsSignupComplete] = useState(false)

  const passwordRequirements = useMemo(
    () => validatePassword(formData.password),
    [formData.password]
  )

  const isPasswordRequirementsMet = useMemo(
    () => isPasswordValid(passwordRequirements),
    [passwordRequirements]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!isPasswordRequirementsMet) {
      setError("Password does not meet all requirements")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    
    try {
      const { confirmPassword, ...signupData } = formData
      await signUp(signupData)
      setIsSignupComplete(true)
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  if (isSignupComplete) {
    return (
      <div className={cn("flex flex-col", className)} {...props}>
        <VerifyEmailMessage email={formData.email} />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Create your account to get started
          </CardDescription>
          <div className="mt-4">
            <div className="inline-flex items-center rounded-lg border p-1 bg-muted">
              <Button
                variant="ghost"
                className={cn(
                  "flex-1 px-6",
                  formData.role === "user" && "bg-background shadow-sm"
                )}
                onClick={() => setFormData(prev => ({ ...prev, role: "user" }))}
              >
                User
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "flex-1 px-6",
                  formData.role === "coach" && "bg-background shadow-sm"
                )}
                onClick={() => setFormData(prev => ({ ...prev, role: "coach" }))}
              >
                Coach
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              {formData.role === "coach" 
                ? "Sign up as a coach to create and manage events"
                : "Sign up as a user to discover and join events"
              }
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-4 grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  minLength={8}
                />
                {formData.password && (
                  <div className="mt-2 space-y-1.5 text-sm">
                    <p className="text-muted-foreground mb-2">Password must include:</p>
                    <div className="flex items-center gap-2">
                      {passwordRequirements.hasUpperCase ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={cn(
                        passwordRequirements.hasUpperCase ? "text-green-600" : "text-muted-foreground"
                      )}>
                        At least one uppercase letter (A–Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordRequirements.hasLowerCase ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={cn(
                        passwordRequirements.hasLowerCase ? "text-green-600" : "text-muted-foreground"
                      )}>
                        At least one lowercase letter (a–z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordRequirements.hasNumber ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={cn(
                        passwordRequirements.hasNumber ? "text-green-600" : "text-muted-foreground"
                      )}>
                        At least one number (0–9)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordRequirements.hasSpecialChar ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={cn(
                        passwordRequirements.hasSpecialChar ? "text-green-600" : "text-muted-foreground"
                      )}>
                        At least one special character (e.g., !@#$%)
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <PasswordInput
                  id="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  minLength={8}
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !isPasswordRequirementsMet || formData.password !== formData.confirmPassword}
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 