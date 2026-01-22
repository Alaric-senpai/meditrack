"use client";

import { LandingNavbar } from "@/components/layout/landing-navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ShieldCheck, 
  User, 
  Activity, 
  Stethoscope, 
  Microscope, 
  Pill, 
  Clock, 
  Phone,
  CheckCircle,
  Star,
  MapPin,
  Mail
} from "lucide-react";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function Home() {
  const services = [
    {
      icon: Stethoscope,
      title: "Clinical Care",
      description: "Expert medical consultations with specialized doctors for your health needs.",
      link: "/clinician/dashboard"
    },
    {
      icon: Microscope,
      title: "Diagnostic Labs",
      description: "State-of-the-art laboratory services for accurate and timely results.",
      link: "/lab/dashboard"
    },
    {
      icon: Pill,
      title: "Pharmacy",
      description: "Full-service pharmacy with prescription management and medication counseling.",
      link: "/pharmacy/dashboard"
    },
    {
      icon: Activity,
      title: "Emergency Care",
      description: "24/7 dedicated emergency response team ready for critical situations.",
      link: "#"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
        <LandingNavbar />

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-24 md:pb-32">
          <div className="absolute inset-0 -z-10 w-full h-full opacity-30 dark:opacity-20">
            <Spotlight />
          </div>
          
          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              
              {/* Text Content */}
              <div className="flex-1 text-center lg:text-left">
                <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary rounded-full">
                  <Activity className="size-3.5 mr-2 animate-pulse" />
                  Advanced Healthcare Management System
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                  Modern Healthcare <br />
                  <span className="text-primary">Reimagined for You</span>
                </h1>
                
                <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Experience the future of medical care with MediTrack Pro. 
                  Seamlessly connect with doctors, manage prescriptions, and access your 
                  medical records securely from anywhere.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Button asChild size="lg" className="rounded-full px-8 h-12 text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all w-full sm:w-auto">
                    <Link href="/login">
                      Access Patient Portal
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base hover:bg-muted/50 w-full sm:w-auto">
                    <Link href="/login">
                      <ShieldCheck className="mr-2 size-4" />
                      Staff Login
                    </Link>
                  </Button>
                </div>

                <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-1 rounded-full">
                      <CheckCircle className="size-4 text-primary" />
                    </div>
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-1 rounded-full">
                      <CheckCircle className="size-4 text-primary" />
                    </div>
                    <span>Secure Records</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-1 rounded-full">
                      <CheckCircle className="size-4 text-primary" />
                    </div>
                    <span>Expert Doctors</span>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 aspect-[4/3] group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80" 
                    alt="Modern Medical Facility" 
                    className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Floating Card 1 */}
                  <div className="absolute bottom-6 left-6 right-6 lg:right-auto z-20 bg-background/90 backdrop-blur-md p-4 rounded-xl border border-border/50 shadow-lg flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-1000 delay-300">
                    <div className="bg-green-500/10 p-2.5 rounded-full">
                      <Activity className="size-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">System Status</p>
                      <p className="font-bold text-foreground">Fully Operational</p>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border/40 bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">50+</p>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Specialists</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">10k+</p>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Patients Served</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">24/7</p>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Emergency Care</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">99%</p>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Patient Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-background relative">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-sm font-bold text-primary uppercase tracking-wide mb-2">Our Services</h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Healthcare Solutions</h3>
              <p className="text-muted-foreground text-lg">
                We provide a wide range of specialized medical services to ensure you receive the best possible care under one roof.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <div key={index} className="group p-6 rounded-2xl border border-border/50 bg-card hover:bg-card/80 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                    <service.icon className="size-6" />
                  </div>
                  <h4 className="text-xl font-bold mb-3">{service.title}</h4>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <Link href={service.link} className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                    Access Portal <ArrowRight className="ml-1 size-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust/Testimonial Section */}
        <section className="py-24 bg-secondary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')] opacity-[0.03]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Trusted by Thousands of Patients</h2>
                <div className="flex gap-1 text-yellow-500 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-6 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8 text-foreground/80 italic">
                  "MediTrack Pro has revolutionized how I manage my family's healthcare. The ease of booking appointments and accessing lab results instantly is unmatched."
                </blockquote>
                <div>
                  <p className="font-bold text-lg">Sarah Johnson</p>
                  <p className="text-muted-foreground">Patient since 2023</p>
                </div>
              </div>
              <div className="flex-1 w-full relative">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                  <img 
                    src="https://images.unsplash.com/photo-1516574187841-693083f69382?auto=format&fit=crop&q=80" 
                    alt="Happy Patient" 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-primary rounded-3xl p-12 md:p-16 text-center text-primary-foreground relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Take Control of Your Health?</h2>
                <p className="text-primary-foreground/90 text-lg mb-10 leading-relaxed">
                  Join MediTrack Pro today and experience healthcare that revolves around you. 
                  Secure, efficient, and professional.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild size="lg" variant="secondary" className="rounded-full px-8 h-12 text-base font-bold shadow-lg">
                    <Link href="/signup">
                      Register as Patient
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-12 text-base bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    <Link href="#contact">
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-muted/30 pt-20 pb-10 border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold text-xl text-primary">
                  <Activity className="size-6" />
                  <span>MediTrack Pro</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Advancing healthcare through technology. Secure, reliable, and patient-centric management system.
                </p>
                <div className="flex gap-4">
                  {/* Social icons placeholder */}
                  <div className="size-10 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary cursor-pointer transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="size-4 opacity-60" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <div className="size-10 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary cursor-pointer transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="size-4 opacity-60" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-6">Quick Links</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-primary transition-colors">Find a Doctor</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Book Appointment</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Patient Portal</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Lab Results</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6">Legal</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                  <li><Link href="/hipaa-notice" className="hover:text-primary transition-colors">HIPAA Notice</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6">Contact Us</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
                    <span>123 Medical Center Dr,<br />Health City, HC 90210</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="size-5 text-primary shrink-0" />
                    <span>+1 (555) 123-4567</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="size-5 text-primary shrink-0" />
                    <span>support@meditrack.pro</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="size-5 text-primary shrink-0" />
                    <span>24/7 Emergency Care</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} MediTrack Pro. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="#" className="hover:text-primary">Sitemap</Link>
                <Link href="#" className="hover:text-primary">Accessibility</Link>
                <Link href="#" className="hover:text-primary">Employee Login</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
