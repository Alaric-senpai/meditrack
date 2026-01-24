"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserPlus, Loader2 } from "lucide-react"
import { inviteUser } from "@/actions/admin-user.actions"
import { toast } from "sonner"
import { UserRole } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

const inviteAdminSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
})

type InviteAdminFormValues = z.infer<typeof inviteAdminSchema>

export function InviteUserModal() {
  const [open, setOpen] = useState(false)
  
  const form = useForm<InviteAdminFormValues>({
    resolver: zodResolver(inviteAdminSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  })

  const isLoading = form.formState.isSubmitting

  async function onSubmit(data: InviteAdminFormValues) {
    try {
      const result = await inviteUser({
        ...data,
        role: 'admin' as UserRole
      })

      if (result.success) {
        toast.success(`Administrator ${data.email} invited successfully.`)
        setOpen(false)
        form.reset()
      } else {
        toast.error(result.message || "Failed to invite administrator")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Administrator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-0 border-none bg-transparent shadow-none overflow-hidden h-auto max-h-[95vh]">
        <div className="bg-background rounded-lg border shadow-2xl flex flex-col max-h-[90vh] w-full overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b shrink-0 bg-background z-20">
            <DialogHeader>
              <DialogTitle>Add New Administrator</DialogTitle>
              <DialogDescription>
                Invite a new system administrator. They will receive an email to set their password.
              </DialogDescription>
            </DialogHeader>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {/* Scrollable content */}
              <ScrollArea className="flex-1 min-h-0 px-6">
                <div className="py-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Email</FormLabel>
                        <FormControl>
                          <Input placeholder="admin@meditrack.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 234 567 890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/20">
                    <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
                      <strong>Note:</strong> Administrators have full access to manage clinical staff, patients, and system settings. Ensure the email address is correct.
                    </p>
                  </div>
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="p-6 border-t bg-muted/5 shrink-0 z-20">
                <DialogFooter className="sm:justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setOpen(false)}
                    className="px-8"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="px-8 bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Invite Admin
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
