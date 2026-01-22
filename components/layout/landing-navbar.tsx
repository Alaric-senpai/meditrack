"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Activity, User, Users, Phone, ShieldCheck } from "lucide-react";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 font-bold tracking-tight text-primary transition-opacity hover:opacity-80"
          >
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Activity className="size-5 text-primary" />
            </div>
            <span className="text-xl text-foreground">MediTrack <span className="text-primary">Pro</span></span>
          </Link>

          {/* Center Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground/80">
            <Link href="#services" className="hover:text-primary transition-colors flex items-center gap-1.5">
              Services
            </Link>
            <Link href="#doctors" className="hover:text-primary transition-colors flex items-center gap-1.5">
              Find a Doctor
            </Link>
            <Link href="#about" className="hover:text-primary transition-colors flex items-center gap-1.5">
              About Us
            </Link>
            <Link href="#contact" className="hover:text-primary transition-colors flex items-center gap-1.5">
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <AnimatedThemeToggler />
            
            <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
            
            <div className="hidden sm:flex items-center gap-3">
              <Button asChild variant="ghost" className="font-medium text-muted-foreground hover:text-primary" size="sm">
                <Link href="/login">
                  <ShieldCheck className="mr-1.5 size-4" />
                  Staff Login
                </Link>
              </Button>
              <Button asChild className="rounded-full font-medium shadow-lg shadow-primary/20" size="sm">
                <Link href="/login">
                  <User className="mr-1.5 size-4" />
                  Patient Portal
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
