import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">System Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure global system parameters and preferences.
        </p>
      </div>
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage system access and restrictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="public-reg">Allow Public Registration</Label>
                    <Switch id="public-reg" />
                </div>
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="mfa">Enforce MFA for Staff</Label>
                    <Switch id="mfa" defaultChecked />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Environment configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid w-full items-center gap-1.5">
                    <Label>Organization Name</Label>
                    <Input disabled defaultValue="MediTrack Healthcare" />
                 </div>
                 <div className="grid w-full items-center gap-1.5">
                    <Label>System Version</Label>
                    <Input disabled defaultValue="v1.0.0 (Beta)" />
                 </div>
            </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
         <Button>Save Changes</Button>
      </div>
    </div>
  )
}
