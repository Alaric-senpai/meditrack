"use client"

import * as React from "react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Stethoscope, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  Mail, 
  Phone, 
  User as UserIcon,
  ShieldCheck,
  Activity,
  Award,
  Clock,
  Briefcase,
  ExternalLink,
  ShieldAlert,
  Beaker,
  AlertCircle,
  FileText,
  CreditCard
} from "lucide-react"
import { getDoctorClinicalProfile, getNurseClinicalProfile, getPatientProfile } from "@/actions/admin-user.actions"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface UserDetailsDrawerProps {
  userId: string | null
  role: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailsDrawer({ userId, role, open, onOpenChange }: UserDetailsDrawerProps) {
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState<any>(null)

  React.useEffect(() => {
    if (open && userId && role) {
      setLoading(true)
      
      const fetchProfile = () => {
        switch (role) {
          case 'doctor': return getDoctorClinicalProfile(userId)
          case 'nurse': return getNurseClinicalProfile(userId)
          case 'patient': return getPatientProfile(userId)
          default: return getDoctorClinicalProfile(userId) // Admin or others mostly just user record
        }
      }

      fetchProfile().then(res => {
        if (res.success) {
          setData(res)
        }
        setLoading(false)
      })
    }
  }, [open, userId, role])

  const user = data?.user
  const clinical = data?.clinical
  const name = user ? `${user.firstName} ${user.lastName}` : ""

  const renderRoleSpecificContent = () => {
    if (!clinical) return null

    switch (role) {
      case 'doctor':
      case 'nurse':
        return (
          <div className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <UserIcon className="h-3.5 w-3.5" />
                  Professional Identity
              </h3>
              <div className="grid grid-cols-1 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">License Number</span>
                      <span className="text-sm font-medium font-mono text-slate-900">{clinical?.licenseNumber || "N/A"}</span>
                  </div>
                  {role === 'doctor' && (
                    <>
                      <Separator className="bg-slate-200/50" />
                      <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">Registration ID</span>
                          <span className="text-sm font-medium font-mono text-slate-900">{clinical?.medicalRegistrationNumber || "N/A"}</span>
                      </div>
                    </>
                  )}
                  <Separator className="bg-slate-200/50" />
                  <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">{role === 'doctor' ? 'Experience' : 'Employment Status'}</span>
                      {role === 'doctor' ? (
                        <Badge variant="outline" className="font-semibold">{clinical?.yearsOfExperience || "0"} Years</Badge>
                      ) : (
                        <Badge variant={clinical?.isAvailable ? "default" : "secondary"}>
                          {clinical?.isAvailable ? "Active" : "On Leave"}
                        </Badge>
                      )}
                  </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Award className="h-3.5 w-3.5" />
                  {role === 'doctor' ? 'Clinical Background' : 'Shift Information'}
              </h3>
              <div className="space-y-4">
                  {role === 'doctor' ? (
                    <div className="flex gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg h-fit">
                            <GraduationCap className="h-4 w-4 text-amber-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Education & Credentials</p>
                            <p className="text-sm font-medium leading-tight">{clinical?.education || "Credentials not provided"}</p>
                        </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg h-fit">
                            <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Assigned Shift</p>
                            <p className="text-sm font-medium leading-tight">{clinical?.shiftType || "Not assigned"}</p>
                        </div>
                    </div>
                  )}
                  
                  {role === 'doctor' && (
                    <div className="flex gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg h-fit">
                            <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Hospital Affiliation</p>
                            <p className="text-sm font-medium leading-tight">{clinical?.hospitalAffiliation || "Private Practice"}</p>
                        </div>
                    </div>
                  )}

                  {(clinical?.bio || clinical?.specialization) && (
                    <div className="p-4 bg-white border rounded-xl shadow-sm text-sm leading-relaxed text-slate-600 italic">
                        {role === 'doctor' 
                          ? `"${clinical?.bio || "No professional biography has been provided."}"`
                          : `Specialties: ${Array.isArray(clinical?.specialization) ? clinical.specialization.join(", ") : clinical?.specialization || "General Nursing"}`
                        }
                    </div>
                  )}
              </div>
            </section>
          </div>
        )

      case 'patient':
        return (
          <div className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5" />
                  Medical Record Information
              </h3>
              <div className="grid grid-cols-1 gap-4 bg-teal-50/30 p-4 rounded-xl border border-teal-100/50">
                  <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Medical ID / Insurance</span>
                      <span className="text-sm font-medium font-mono text-teal-800">{clinical?.medicalIdNumber || "N/A"}</span>
                  </div>
                  <Separator className="bg-teal-200/30" />
                  <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Gender / Age</span>
                      <span className="text-sm font-medium capitalize">{clinical?.gender || "N/A"} • {clinical?.dateOfBirth ? `${new Date().getFullYear() - new Date(clinical.dateOfBirth).getFullYear()}Y` : "N/A"}</span>
                  </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Clinical Alerts & Conditions
              </h3>
              <div className="space-y-3">
                  <div className="p-3 bg-red-50/50 border border-red-100 rounded-lg">
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3" /> Allergies
                    </p>
                    <p className="text-sm font-semibold text-red-900">
                      {Array.isArray(clinical?.allergies) && clinical.allergies.length > 0 
                        ? clinical.allergies.join(", ") 
                        : clinical?.allergies || "No documented allergies"}
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-lg">
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Activity className="h-3 w-3" /> Chronic Conditions
                    </p>
                    <p className="text-sm font-semibold text-amber-900">
                      {Array.isArray(clinical?.chronicConditions) && clinical.chronicConditions.length > 0 
                        ? clinical.chronicConditions.join(", ") 
                        : clinical?.chronicConditions || "None reported"}
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Beaker className="h-3 w-3" /> Systemic Medications
                    </p>
                    <p className="text-sm font-semibold text-blue-900">
                      {Array.isArray(clinical?.medications) && clinical.medications.length > 0 
                        ? clinical.medications.join(", ") 
                        : clinical?.medications || "No active prescriptions"}
                    </p>
                  </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="h-3.5 w-3.5" />
                  Contact & Emergency
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Primary Residence</p>
                    <p className="font-medium leading-tight">{clinical?.address || "No address recorded"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border border-amber-100 bg-amber-50/20 rounded-lg">
                  <ShieldCheck className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-amber-600 font-medium mb-0.5">Emergency Contact</p>
                    <p className="font-semibold text-amber-900 leading-tight">{clinical?.emergencyContact || "No emergency contact listed"}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full ml-auto">
        <div className="mx-auto w-full max-w-md flex flex-col h-full bg-white dark:bg-slate-950 overflow-hidden">
          <DrawerHeader className="px-6 pt-6 shrink-0 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4 mb-4">
                 <Avatar className="h-20 w-20 border-2 border-primary/10 shadow-sm">
                    <AvatarImage src={user?.profilePhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`} alt={name} className="object-cover" />
                    <AvatarFallback className="text-xl bg-primary/5">{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                 </Avatar>
                 <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <DrawerTitle className="text-2xl font-bold truncate max-w-[200px]">{name || "User Details"}</DrawerTitle>
                        <Badge variant="secondary" className="capitalize">
                          {role?.replace("_", " ")}
                        </Badge>
                    </div>
                    {role !== 'admin' && (
                      <DrawerDescription className="text-sm flex items-center gap-1.5 capitalize">
                          {role === 'patient' ? <FileText className="h-3.5 w-3.5" /> : <Stethoscope className="h-3.5 w-3.5" />}
                          {clinical?.specilization?.join(", ") || clinical?.specialization?.join(", ") || clinical?.specialty || (role === 'patient' ? "Medical File Record" : "Healthcare Professional")}
                      </DrawerDescription>
                    )}
                 </div>
            </div>
          </DrawerHeader>

          <ScrollArea className="flex-1 min-h-0 px-6">
            <div className="py-8">
              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              ) : user ? (
                <div className="space-y-8 pb-10">
                  {/* Basic Contact Information (Common for all) */}
                  <section className="space-y-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5" />
                        Account & Connectivity
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50/30">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <span className="text-sm truncate max-w-[220px]">{user.email}</span>
                            </div>
                            <ExternalLink className="h-3 w-3 text-slate-300" />
                        </div>
                        {user.phone && (
                            <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm">{user.phone}</span>
                                </div>
                                <ShieldCheck className="h-3 w-3 text-green-500" />
                            </div>
                        )}
                        <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-lg">
                          <div className="flex items-center gap-3">
                              <Activity className="h-4 w-4 text-slate-400" />
                              <span className="text-sm font-medium capitalize">Status: {user.status || 'Active'}</span>
                          </div>
                          <Badge variant={user.status === 'inactive' ? 'destructive' : 'default'} className="h-2 w-2 p-0 rounded-full" />
                        </div>
                    </div>
                  </section>

                  {/* Role Specific Clinical/Medical Data */}
                  {renderRoleSpecificContent()}

                  {/* Account Meta (Common) */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Registered {new Date(user.$createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                        ID: {user.$id.slice(-8)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground font-medium">Account record could not be retrieved.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
