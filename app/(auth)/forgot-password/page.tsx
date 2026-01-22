"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { motion } from "motion/react";
import { Mail, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import Link from "next/link";
import { requestPasswordReset } from "@/actions/password-reset.actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const resetAction = useAction(requestPasswordReset, {
    onSuccess: () => {
      setError("");
    },
    onError: (error) => {
      setError(error.error.serverError || "Failed to send reset email");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    resetAction.execute({ email });
  };

  const { isExecuting, hasSucceeded } = resetAction;

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
          <h1 className="font-bold text-2xl mb-2">Check Your Email</h1>
          <p className="text-muted-foreground text-sm mb-6">
            We've sent a password reset link to <strong>{email}</strong>. 
            Please check your inbox and follow the instructions.
          </p>
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => resetAction.reset()}
              className="w-full"
            >
              Try a different email
            </Button>
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
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <h1 className="font-bold text-2xl mb-2">Forgot Password?</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup className="space-y-4 mb-6">
          <Field data-invalid={!!error} className="gap-2">
            <FieldLabel htmlFor="email" className="text-sm font-medium">
              Email Address
            </FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
          {isExecuting ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Remember your password?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
