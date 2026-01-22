"use client"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CheckCircle, Stethoscope, Heart, Beaker, Pill, Users } from "lucide-react"

type StaffRole = "doctor" | "nurse" | "lab-tech" | "pharmacist" | "admin";

const staffRoles: Array<{
  value: StaffRole;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: "doctor",
    label: "Doctor",
    description: "Manage patient care and prescriptions",
    icon: <Stethoscope className="w-5 h-5" />,
  },
  {
    value: "nurse",
    label: "Nurse",
    description: "Monitor patient vitals and care",
    icon: <Heart className="w-5 h-5" />,
  },
  {
    value: "lab-tech",
    label: "Lab Technician",
    description: "Process lab tests and results",
    icon: <Beaker className="w-5 h-5" />,
  },
  {
    value: "pharmacist",
    label: "Pharmacist",
    description: "Manage prescriptions and medications",
    icon: <Pill className="w-5 h-5" />,
  },
  {
    value: "admin",
    label: "Administrator",
    description: "Manage system and users",
    icon: <Users className="w-5 h-5" />,
  },
];

interface RoleSelectFormProps {
  onRoleSelect: (role: StaffRole) => void;
  selectedRole?: StaffRole;
  disabled?: boolean;
}

/**
 * Role selection form for admin use when creating staff accounts
 * Only staff roles are shown (not patient - patients self-register)
 */
export function RoleSelectForm({ onRoleSelect, selectedRole, disabled }: RoleSelectFormProps) {
  const [selected, setSelected] = useState<StaffRole | null>(selectedRole || null);

  const handleSelect = (role: StaffRole) => {
    if (disabled) return;
    setSelected(role);
    onRoleSelect(role);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Select Staff Role</label>
      <div className="grid grid-cols-1 gap-2">
        {staffRoles.map((role) => (
          <motion.button
            key={role.value}
            type="button"
            whileHover={disabled ? {} : { scale: 1.01 }}
            whileTap={disabled ? {} : { scale: 0.99 }}
            onClick={() => handleSelect(role.value)}
            disabled={disabled}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              selected === role.value
                ? "border-primary bg-primary/10 dark:bg-primary/5"
                : "border-border bg-card/50 hover:border-primary/50 hover:bg-card/70"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className="text-primary">{role.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{role.label}</h3>
                <p className="text-xs text-muted-foreground">{role.description}</p>
              </div>
              {selected === role.value && (
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export type { StaffRole };
