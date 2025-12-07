'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface VerifyEmailMessageProps {
  email: string;
  className?: string;
  onLoginClick?: () => void;
}

export function VerifyEmailMessage({ 
  email, 
  className,
  onLoginClick
}: VerifyEmailMessageProps) {
  const router = useRouter()

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick()
    } else {
      router.push("/login")
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl">Check Your Email</CardTitle>
        <CardDescription>
          We&apos;ve sent a verification link to {email}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Please check your email and click the verification link to activate your account. 
          If you don&apos;t see the email, please check your spam folder.
        </p>
        <div className="flex flex-col space-y-2">
          <Button onClick={handleLoginClick}>
            Go to Login
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 