"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Stethoscope, FileText, Activity } from "lucide-react";

export default function ClinicianDashboard() {
  const { user, role } = useAuth();
  const roleLabel = role === "doctor" ? "Doctor" : role === "nurse" ? "Nurse" : "Clinician";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {roleLabel} {user?.name || ""}</h1>
        <p className="text-muted-foreground">
          Clinical dashboard - manage patients, visits, and medical records
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Active patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Labs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Awaiting results</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Visits</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Patients you've seen recently</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common clinical tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">• Start new visit</p>
            <p className="text-sm text-muted-foreground">• Search patients</p>
            <p className="text-sm text-muted-foreground">• Order lab tests</p>
            <p className="text-sm text-muted-foreground">• Write prescription</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
