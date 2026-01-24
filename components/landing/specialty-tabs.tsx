"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Bone, 
  Baby, 
  Brain, 
  Stethoscope, 
  Activity, 
  Eye, 
  Smile,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface Specialty {
  id: string;
  label: string;
  icon: any;
  title: string;
  description: string;
  image: string;
  features: string[];
}

const specialties: Specialty[] = [
  {
    id: "heart",
    label: "The Heart",
    icon: Heart,
    title: "World-class Cardiology Care",
    description: "Our diverse team of top cardiologists and heart surgeons utilize the latest technology to diagnose and treat all types of heart conditions. From preventative care to complex surgeries, your heart is in the best hands.",
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80",
    features: ["Minimally Invasive Surgery", "Advanced Heart Failure Program", "Preventative Cardiology"]
  },
  {
    id: "orthopedics",
    label: "Orthopedics",
    icon: Bone,
    title: "Orthopedic Excellence",
    description: "Restoring mobility and quality of life through advanced orthopedic treatments. We specialize in joint replacement, sports medicine, and spine care using state-of-the-art robotic technology.",
    image: "https://images.unsplash.com/photo-1588776813186-6f4d5c6f4b57?auto=format&fit=crop&q=80",
    features: ["Joint Replacement", "Sports Medicine", "Spine Surgery"]
  },
  {
    id: "pediatrics",
    label: "Pediatrics",
    icon: Baby,
    title: "Compassionate Pediatric Care",
    description: "Comprehensive care for your little ones, from newborns to adolescents. Our child-friendly environment and specialized pediatric team ensure your child feels safe and comfortable.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80",
    features: ["Well-child Visits", "Pediatric Surgery", "Neonatal Intensive Care"]
  },
  {
    id: "neurology",
    label: "Neurology",
    icon: Brain,
    title: "Advanced Neurology & Neurosurgery",
    description: "Expert care for conditions affecting the brain, spine, and nervous system. Our multidisciplinary approach ensures precise diagnosis and personalized treatment plans.",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80",
    features: ["Stroke Center", "Epilepsy Program", "Memory Disorders"]
  },
  {
    id: "oncology",
    label: "Oncology",
    icon: Activity,
    title: "Leading-Edge Cancer Care",
    description: "Fighting cancer with the most advanced therapies and a compassionate, team-based approach. We offer comprehensive cancer services from screening to survivorship.",
    image: "https://images.unsplash.com/photo-1579684453423-f84349ca60df?auto=format&fit=crop&q=80",
    features: ["Immunotherapy", "Radiation Oncology", "Clinical Trials"]
  }
];

export function SpecialtyTabs() {
  const [activeTab, setActiveTab] = useState("heart");
  const activeSpecialty = specialties.find(s => s.id === activeTab) || specialties[0];

  return (
    <div className="bg-background w-full">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Left Sidebar - Tabs */}
        <div className="w-full lg:w-1/4 shrink-0 space-y-2">
          {specialties.map((specialty) => (
            <button
              key={specialty.id}
              onClick={() => setActiveTab(specialty.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 border border-transparent",
                activeTab === specialty.id 
                  ? "bg-white shadow-lg border-border/50 text-blue-600 font-bold dark:bg-card dark:text-blue-400" 
                  : "hover:bg-muted/50 text-muted-foreground font-medium"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                activeTab === specialty.id ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" : "bg-transparent"
              )}>
                <specialty.icon className="size-5" />
              </div>
              <span className="text-base">{specialty.label}</span>
            </button>
          ))}
          <Button variant="outline" className="w-full justify-between mt-6 group hidden lg:flex">
            <span>View all departments</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform size-4" />
          </Button>
        </div>

        {/* Right Content */}
        <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{activeSpecialty.title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {activeSpecialty.description}
              </p>
              
              <ul className="space-y-3 pt-2">
                {activeSpecialty.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <div className="size-2 rounded-full bg-blue-500" />
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="rounded-full bg-blue-600 hover:bg-blue-700 mt-4 px-8" size="lg">
                Refer a Patient
              </Button>
            </div>
            
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-border/50">
              <img 
                src={activeSpecialty.image} 
                alt={activeSpecialty.title} 
                className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
