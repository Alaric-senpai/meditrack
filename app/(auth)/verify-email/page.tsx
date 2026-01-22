"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { motion } from "motion/react";
import { Mail, ArrowLeft, Check, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { verifyEmail, resendVerificationEmail } from "@/actions/email-verification.actions";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  
  const [verificationState, setVerificationState] = useState<"verifying" | "success" | "error" | "pending">("pending");
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);

  const verifyAction = useAction(verifyEmail, {
    onSuccess: (data) => {
      if (data.data?.success) {
        setVerificationState("success");
      } else {
        setVerificationState("error");
        setError(data.data?.message || "Verification failed");
      }
    },
    onError: (error) => {
      setVerificationState("error");
      setError(error.error.serverError || "Verification failed");
    },
  });

  useEffect(() => {
    // If we have userId and secret, attempt verification
    if (userId && secret) {
      setVerificationState("verifying");
      verifyAction.execute({ userId, secret });
    }
  }, [userId, secret]);

  const handleResend = async () => {
    setResending(true);
    try {
      const result = await resendVerificationEmail();
      if (result.success) {
        setError("");
        setVerificationState("pending");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to resend verification email");
    }
    setResending(false);
  };

  // Verifying state
  if (verificationState === "verifying") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 w-full max-w-md border bg-card/50 dark:bg-card/30 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-primary/10 mx-auto"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-bold text-2xl mb-2">Verifying Email...</h1>
          <p className="text-muted-foreground text-sm">
            Please wait while we verify your email address.
          </p>
        </div>
      </motion.div>
    );
  }

  // Success state
  if (verificationState === "success") {
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
          <h1 className="font-bold text-2xl mb-2">Email Verified!</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Your email has been successfully verified. You can now access all features.
          </p>
          <Button onClick={() => router.push("/login")} className="w-full">
            Continue to Login
          </Button>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (verificationState === "error") {
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
          <h1 className="font-bold text-2xl mb-2">Verification Failed</h1>
          <p className="text-muted-foreground text-sm mb-6">
            {error || "The verification link is invalid or has expired."}
          </p>
          <div className="space-y-3">
            <Button
              onClick={handleResend}
              disabled={resending}
              className="w-full"
            >
              {resending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend Verification Email"
              )}
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

  // Pending state (no token in URL - show instructions)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 sm:p-8 w-full max-w-md border bg-card/50 dark:bg-card/30 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-primary/10 mx-auto"
    >
      <div className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-bold text-2xl mb-2">Verify Your Email</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Please check your email inbox and click the verification link we sent you.
        </p>
        <div className="space-y-3">
          <Button
            onClick={handleResend}
            disabled={resending}
            variant="outline"
            className="w-full"
          >
            {resending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend Verification Email"
            )}
          </Button>
          <Link href="/login">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Button>
          </Link>
        </div>
        {error && (
          <p className="text-destructive text-sm mt-4">{error}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="p-6 sm:p-8 w-full max-w-md border bg-card/50 rounded-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-16 w-16 bg-muted rounded-full mx-auto" />
          <div className="h-6 bg-muted rounded w-1/2 mx-auto" />
          <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
