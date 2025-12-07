'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarDays, Menu, X, User, ChevronDown, Sparkles, LogOut, Settings, Calendar, Bookmark, Plus } from 'lucide-react'
import { useAuth } from "@/hooks/useAuth"
import { useUserRole } from "@/hooks/useUserRole"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserDetails } from "@/hooks/useUserDetails"

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Events', href: '/events' },
  { name: 'Organizers', href: '/coaches' },
]

export function Header() {
  const pathname = usePathname()
  const { user, loading: authLoading, signOut } = useAuth()
  const { isCoach, loading: roleLoading } = useUserRole()
  const { userDetails } = useUserDetails()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'py-2 bg-background/80 backdrop-blur-xl border-b shadow-sm' 
            : 'py-4 bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                className="relative"
                whileHover={{ rotate: 12 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CalendarDays className="h-7 w-7 text-primary relative" />
              </motion.div>
              <span className="font-display font-bold text-xl gradient-text hidden sm:block">
                Impactboard
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActive 
                          ? 'text-primary' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.name}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-primary/10 rounded-xl -z-10"
                          layoutId="activeNav"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
              
              {/* Teams Board Button */}
              <a 
                href="https://teamsboard.lovable.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2"
              >
                <motion.div
                  className="relative px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20 flex items-center gap-2"
                  whileHover={{ scale: 1.02, borderColor: 'hsl(var(--primary) / 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Teams Board
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                  </span>
                </motion.div>
              </a>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {authLoading || roleLoading ? (
                <div className="w-9 h-9 rounded-xl bg-muted animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Avatar className="h-8 w-8 ring-2 ring-background">
                        <AvatarImage src={userDetails?.profileImage} alt={userDetails?.name || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-semibold">
                          {getUserInitial()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2">
                    <div className="px-2 py-1.5 mb-1">
                      <p className="text-sm font-medium">{userDetails?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate">{userDetails?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    {!authLoading && !roleLoading && isCoach() && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/create" className="flex items-center gap-2 cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Create Event
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/my-events" className="flex items-center gap-2 cursor-pointer">
                            <Calendar className="h-4 w-4" />
                            My Events
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/my-bookings" className="flex items-center gap-2 cursor-pointer">
                        <Bookmark className="h-4 w-4" />
                        My Bookings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="hidden sm:flex">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="shadow-lg shadow-primary/25">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <motion.button
                className="md:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              className="absolute top-20 left-4 right-4 bg-card border rounded-2xl shadow-xl p-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <a
                    href="https://teamsboard.lovable.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary/10 to-accent/10 text-primary"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Teams Board
                    </span>
                  </a>
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  )
}
