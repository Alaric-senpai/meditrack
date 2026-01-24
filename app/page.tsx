"use client";

import { LandingNavbar } from "@/components/layout/landing-navbar";
import { LandingFooter } from "@/components/layout/landing-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpecialtyTabs } from "@/components/landing/specialty-tabs";
import { 
  Phone, 
  Heart, 
  Smile, 
  Eye, 
  ArrowRight,
  PlayCircle,
  Clock,
  Calendar,
  ShieldCheck,
  Star,
  Quote
} from "lucide-react";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight-new";


export default function Home() {
  const features = [
    {
      icon: Phone,
      title: "Emergency Care",
      description: "24/7 dedicated emergency line with rapid response teams ready for any critical situation.",
      color: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
    },
    {
      icon: Heart,
      title: "Heart Disease",
      description: "Advanced cardiology center with state-of-the-art diagnostic and treatment facilities.",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
    },
    {
      icon: Smile,
      title: "Dental Care",
      description: "Comprehensive dental services from routine checkups to complex oral surgeries.",
      color: "bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400"
    },
    {
      icon: Eye,
      title: "Eye Care",
      description: "Specialized ophthalmology department treating vision issues and eye diseases.",
      color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
    }
  ];

  const experts = [
    {
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80",
    },
    {
      name: "Dr. Michael Chen",
      role: "Pediatrician",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80",
    },
    {
      name: "Dr. Emily Williams",
      role: "Neurologist",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80",
    },
    {
      name: "Dr. James Wilson",
      role: "Oncologist",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80",
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20" />
        
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            
            {/* Hero Text */}
            <div className="flex-1 text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold dark:bg-blue-900/30 dark:text-blue-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                #1 Hospital Management System
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Exceptional doctors <br />
                dedicated to <span className="text-blue-600">your care</span>
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Experience world-class healthcare with MediTrack Pro. 
                We combine compassionate care with cutting-edge technology 
                to prioritize your health and well-being.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" className="rounded-full h-14 px-8 text-base bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200/50 dark:shadow-none">
                  Book Appointment
                </Button>
                <Button variant="outline" size="lg" className="rounded-full h-14 px-8 text-base border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 gap-2">
                  <PlayCircle className="size-5" />
                  Watch Video
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="flex-1 w-full relative">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80" 
                  alt="Doctor caring for child patient" 
                  className="object-cover w-full h-full aspect-[4/3]"
                />
                
                {/* Floating Overlay Card */}
                <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl max-w-xs animate-in slide-in-from-bottom-8 duration-700 delay-500 dark:bg-slate-900/90">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-blue-100 p-2.5 rounded-full text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                      <ShieldCheck className="size-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-lg">15+ Years</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Experience</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Trusted by thousands of families for our dedication to excellence.
                  </p>
                </div>
              </div>

              {/* Decorative shapes */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-20" />
              <div className="absolute -bottom-12 -right-4 w-48 h-48 bg-blue-600 rounded-full blur-3xl opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 lg:py-28 bg-white dark:bg-slate-950/50">
        <div className="container px-4 mx-auto">
          <div className="mb-16">
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">Services</h2>
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white">What we do</h3>
            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl text-lg">
              We offer comprehensive medical services tailored to your specific needs, using the latest technology and treatments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-2xl border border-slate-100 bg-white hover:bg-blue-600 hover:shadow-xl hover:scale-105 transition-all duration-300 dark:bg-slate-900 dark:border-slate-800">
                <div className={`${feature.color} size-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors`}>
                  <feature.icon className="size-7" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-white dark:text-white transition-colors">
                  {feature.title}
                </h4>
                <p className="text-slate-500 leading-relaxed group-hover:text-blue-100 dark:text-slate-400 transition-colors">
                  {feature.description}
                </p>
                <div className="mt-6">
                  <span className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-white transition-colors cursor-pointer">
                    Learn More <ArrowRight className="ml-2 size-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialty Tabs Section */}
      <section className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-900">
        <div className="container px-4 mx-auto">
          <div className="mb-16">
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">Departments</h2>
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white">Expert care across every specialty</h3>
          </div>
          
          <SpecialtyTabs />
        </div>
      </section>

      {/* Experts Section */}
      <section className="py-20 lg:py-28 bg-white dark:bg-background">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">Our Team</h2>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white">Meet the experts who care for you</h3>
            </div>
            <Button variant="outline" className="hidden md:flex rounded-full">View All Doctors</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {experts.map((expert, idx) => (
              <div key={idx} className="group relative">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={expert.image} 
                    alt={expert.name}
                    className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-blue-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                      <Button size="icon" variant="secondary" className="rounded-full size-10 bg-white text-blue-900 hover:bg-blue-50">
                        <Phone className="size-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="rounded-full size-10 bg-white text-blue-900 hover:bg-blue-50">
                        <Calendar className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">{expert.name}</h4>
                <p className="text-blue-600 font-medium">{expert.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blue Stats Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Committed to excellence, <br /> driven by compassion
              </h2>
              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-6 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
                MediTrack Pro was founded with a single, unwavering mission: to provide exceptional healthcare that puts the patient at the heart of everything we do.
              </p>
              
              <div className="flex gap-8 pt-4">
                <Button className="rounded-full bg-white text-slate-900 hover:bg-slate-100 h-12 px-8 font-bold">
                  View Our Story
                </Button>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                  <p className="text-5xl font-bold mb-2">250</p>
                  <p className="text-slate-300 text-sm uppercase tracking-wider font-semibold">Hospital Beds</p>
                </div>
                <div className="bg-blue-600 p-8 rounded-2xl border border-blue-500 shadow-xl transform translate-y-8">
                  <p className="text-5xl font-bold mb-2">250</p>
                  <p className="text-blue-100 text-sm uppercase tracking-wider font-semibold">Expert Doctors</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 col-span-2 mt-4">
                  <div className="flex gap-4 items-start">
                    <Quote className="size-10 text-blue-400 shrink-0" />
                    <div>
                      <p className="text-lg italic text-slate-200 mb-4">
                        "The level of care I received was unmatched. The doctors truly listened to my concerns."
                      </p>
                      <p className="font-bold">Jennifer Robinson</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section className="py-20 bg-white dark:bg-background border-t border-slate-100 dark:border-slate-800">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">Blog</h2>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Insights from MediTrack</h3>
            </div>
            <Button variant="link" className="text-blue-600">View All News</Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-slate-100">
                  <img 
                    src={`https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=${500+i}`} 
                    alt="News thumbnail"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-sm text-blue-600 font-semibold mb-2">Health Tips</p>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  10 Ways to maintain a healthy heart lifestyle this winter
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
