'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { CalendarDays, Menu, Search, User } from 'lucide-react'
import { useAuth } from "@/hooks/useAuth"
import { useUserRole } from "@/hooks/useUserRole"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserDetails } from "@/hooks/useUserDetails"

export function Header() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { isCoach, loading: roleLoading } = useUserRole()
  const { userDetails } = useUserDetails()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getUserInitial = () => {
    if (!userDetails?.name) return 'U'
    return userDetails.name.charAt(0).toUpperCase()
  }

  const navItems = ['Home', 'Search Events', 'Organizers']
  const navLinks = ['/', '/events', '/coaches']

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <div className="container flex h-16 items-center max-w-screen-2xl mx-auto px-4 md:px-8">
        <motion.div 
          className="mr-4 hidden md:flex"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link href="/" className="mr-6 flex items-center space-x-2 group transition-all duration-300">
            <CalendarDays className="h-6 w-6 text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            <span className="hidden font-bold text-lg sm:inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:from-primary/90 group-hover:to-primary transition-all duration-300">
              Impactboard
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                >
              <NavigationMenuItem>
                    <Link href={navLinks[index]} legacyBehavior passHref>
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} transition-all duration-200 hover:scale-105 relative group`}>
                        {item}
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-3/4" />
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
              <NavigationMenuItem>
                  <a href="https://teamsboard.lovable.app/" target="_blank" rel="noopener noreferrer">
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} transition-all duration-200 hover:scale-105 relative bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/30 font-bold text-primary`}>
                      Teams Board
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                  </NavigationMenuLink>
                  </a>
              </NavigationMenuItem>
              </motion.div>
            </NavigationMenuList>
          </NavigationMenu>
        </motion.div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            {authLoading || roleLoading ? (
              <Button variant="ghost" size="icon" disabled>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </Button>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9 transition-transform duration-200 hover:scale-110">
                    <Avatar className="h-9 w-9 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200">
                      <AvatarImage src={userDetails?.profileImage} alt={userDetails?.name || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">{getUserInitial()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 animate-scale-in">
                  {!authLoading && !roleLoading && isCoach() && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/create">Create Event</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/my-events">My Events</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/my-bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/login">
                  <User className="h-4 w-4" />
                  <span className="sr-only">Login</span>
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </nav>
        </div>
      </div>
    </motion.header>
  )
}

