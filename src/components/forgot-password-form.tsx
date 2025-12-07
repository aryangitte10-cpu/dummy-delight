'use client'

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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

interface ForgotPasswordFormProps {
  className?: string;
}

export function ForgotPasswordForm({
  className,
  ...props
}: ForgotPasswordFormProps) {
  const router = useRouter()
  const { forgotPassword, confirmForgotPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isResetSuccessful, setIsResetSuccessful] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)

  const passwordRequirements = useMemo(
    () => validatePassword(newPassword),
    [newPassword]
  )

  const isPasswordRequirementsMet = useMemo(
    () => isPasswordValid(passwordRequirements),
    [passwordRequirements]
  )

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [cooldownTime])

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await forgotPassword(email)
      setIsCodeSent(true)
      setCooldownTime(45) // Set initial cooldown time
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (cooldownTime > 0) return
    setError("")
    setIsLoading(true)

    try {
      await forgotPassword(email)
      setCooldownTime(45) // Reset cooldown time
    } catch (err: any) {
      setError(err.message || 'Failed to resend reset code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!isPasswordRequirementsMet) {
      setError("Password does not meet all requirements")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      await confirmForgotPassword(email, code, newPassword)
      setIsResetSuccessful(true)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  if (isResetSuccessful) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Password Reset Successful</CardTitle>
            <CardDescription>
              Your password has been successfully reset. You can now login with your new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <Button asChild className="w-full">
                <Link href="/login">Go to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            {isCodeSent
              ? "Enter the code sent to your email to reset your password"
              : "Enter your email to receive a password reset code"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isCodeSent ? (
            <form onSubmit={handleSendCode}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <div className="text-sm text-red-500 text-center">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </Button>
                <div className="text-center text-sm">
                  Remember your password?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="code">Reset Code</Label>
                  <Input
                    id="code"
                    placeholder="Enter code"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendCode}
                    disabled={cooldownTime > 0 || isLoading}
                    className="mt-2"
                  >
                    {cooldownTime > 0 ? `Resend code (${cooldownTime}s)` : 'Resend code'}
                  </Button>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <PasswordInput
                    id="newPassword"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                    minLength={8}
                  />
                  {newPassword && (
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
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <PasswordInput
                    id="confirmPassword"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    minLength={8}
                  />
                </div>
                {error && (
                  <div className="text-sm text-red-500 text-center">
                    {error}
                  </div>
                )}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !isPasswordRequirementsMet || newPassword !== confirmPassword}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setIsCodeSent(false)}
                  disabled={isLoading}
                >
                  Back to Send Code
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 