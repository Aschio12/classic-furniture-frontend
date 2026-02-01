"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import api from "@/lib/axios";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  onSuccess: () => void;
}

export default function VerificationModal({
  isOpen,
  onClose,
  orderId,
  onSuccess,
}: VerificationModalProps) {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleVerification = useCallback(async (code?: string) => {
    setStatus("processing");
    try {
      await api.patch(`/orders/hub/complete`, { 
        orderId, 
        verificationCode: code || otp 
      });

      setStatus("success");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000); 

    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Verification failed. Invalid code.");
      setOtp(""); // Clear to try again
    }
  }, [otp, orderId, onSuccess, onClose]);

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (value.length === 4) {
      handleVerification(value);
    }
  };

  const handleClose = () => {
     setOtp("");
     setStatus("idle");
     setErrorMessage("");
     onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl border-0 bg-white/80 p-0 shadow-2xl backdrop-blur-xl sm:rounded-3xl">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30"
              >
                <Check className="h-12 w-12 text-white" strokeWidth={3} />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-2 text-2xl font-light text-primary"
              >
                Success!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-primary/60"
              >
                Payout Released to Seller & Order Completed.
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center p-10"
            >
              <div className="mb-8 text-center">
                <h2 className="text-xl font-light tracking-wide text-primary">
                  Hub Verification
                </h2>
                <p className="mt-2 text-sm text-primary/50">
                  Enter the 4-digit code to release this order.
                </p>
              </div>

              <div className="relative mb-8">
                <InputOTP
                  maxLength={4}
                  value={otp}
                  onChange={handleOtpChange}
                  disabled={status === "processing"}
                >
                  <InputOTPGroup className="gap-3">
                    <InputOTPSlot index={0} className="h-14 w-12 rounded-xl border border-primary/10 bg-white shadow-sm ring-primary transition-all focus:border-primary focus:ring-1" />
                    <InputOTPSlot index={1} className="h-14 w-12 rounded-xl border border-primary/10 bg-white shadow-sm ring-primary transition-all focus:border-primary focus:ring-1" />
                    <InputOTPSlot index={2} className="h-14 w-12 rounded-xl border border-primary/10 bg-white shadow-sm ring-primary transition-all focus:border-primary focus:ring-1" />
                    <InputOTPSlot index={3} className="h-14 w-12 rounded-xl border border-primary/10 bg-white shadow-sm ring-primary transition-all focus:border-primary focus:ring-1" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {status === "processing" ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative h-12 w-12">
                    <div className="absolute h-full w-full animate-spin rounded-full border-2 border-primary/10 border-t-primary" />
                    <div className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm font-medium tracking-wide text-primary/70">Processing Payout...</span>
                </div>
              ) : status === "error" ? (
                <p className="text-sm font-medium text-red-500">{errorMessage}</p>
              ) : (
                <p className="invisible text-sm">Placeholder</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
