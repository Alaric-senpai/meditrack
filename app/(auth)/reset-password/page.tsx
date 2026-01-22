"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { motion } from "motion/react";
import { Lock, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Password } from "@/components/ui/password";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import Link from "next/link";
import { resetPassword } from "@/actions/password-reset.actions";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [invalidLink, setInvalidLink] = useState(false);

  useEffect(() => {
    // Check if we have the required parameters
    if (!userId || !secret) {
      setInvalidLink(true);
    }
  }, [userId, secret]);

  const resetAction = useAction(resetPassword, {
    onSuccess: () => {
      setError("");
    },
    onError: (error) => {
      setError(error.error.serverError || "Failed to reset password");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!userId || !secret) {
      setError("Invalid reset link");
      return;
    }

    resetAction.execute({ userId, secret, password });
  };

  const { isExecuting, hasSucceeded } = resetAction;

  // Invalid link state
  if (invalidLink) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 w-full max-w-md border bg-card/50 dark:bg-card/30 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-primary/10 mx-auto"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="font-bold text-2xl mb-2">Invalid Reset Link</h1>
          <p className="text-muted-foreground text-sm mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <div className="space-y-3">
            <Link href="/forgot-password">
              <Button className="w-full">Request New Link</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Success state
  if (hasSucceeded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 w-full max-w-md border bg-card/50 dark:bg-card/30 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-primary/10 mx-auto"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
          >
            <Check className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="font-bold text-2xl mb-2">Password Reset!</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Your password has been successfully reset. You can now login with your new password.
          </p>
          <Button onClick={() => router.push("/login")} className="w-full">
            Continue to Login
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 sm:p-8 w-full max-w-md border bg-card/50 dark:bg-card/30 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-primary/10 mx-auto"
    >
      <Link href="/login" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </Link>

      <div className="text-center mb-6">
        <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <h1 className="font-bold text-2xl mb-2">Reset Password</h1>
        <p className="text-muted-foreground text-sm">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup className="space-y-4 mb-6">
          <Field data-invalid={!!error} className="gap-2">
            <FieldLabel htmlFor="password" className="text-sm font-medium">
              New Password
            </FieldLabel>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="h-11"
              disabled={isExecuting}
            />
          </Field>

          <Field data-invalid={!!error} className="gap-2">
            <FieldLabel htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </FieldLabel>
            <Password
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="h-11"
              disabled={isExecuting}
            />
            {error && <FieldError errors={[{ message: error }]} />}
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          className="w-full h-11"
          disabled={isExecuting}
        >
          {isExecuting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="p-6 sm:p-8 w-full max-w-md border bg-card/50 rounded-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-12 bg-muted rounded-full mx-auto" />
          <div className="h-6 bg-muted rounded w-1/2 mx-auto" />
          <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
