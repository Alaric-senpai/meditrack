"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, Clock, CheckCircle, RefreshCw } from "lucide-react";

export default function PharmacyDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pharmacy Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {user?.name || "Pharmacist"} - manage prescriptions and dispensing
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Prescriptions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Awaiting dispensing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready for Pickup</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Awaiting collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dispensed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Prescriptions filled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refill Requests</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Pending refills</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Prescription Queue</CardTitle>
            <CardDescription>Prescriptions waiting to be filled</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No pending prescriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common pharmacy tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">• View pending prescriptions</p>
            <p className="text-sm text-muted-foreground">• Process refill requests</p>
            <p className="text-sm text-muted-foreground">• Check inventory</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
