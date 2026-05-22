"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { scaleIn } from "@/lib/motion";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Tab = "login" | "register";
type View = "form" | "forgot" | "otp";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  otp: "",
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [view, setView] = useState<View>("form");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (otpTimer <= 0) return;
    const id = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [otpTimer]);

  const resetModal = () => {
    setTab("login");
    setView("form");
    setForm(initialForm);
    setError("");
    setOtpTimer(0);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const sendOtp = () => {
    if (!form.phone || form.phone.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setOtpTimer(30);
    setView("otp");
    setError("");
  };

  const validateRegister = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.email.trim() || !form.email.includes("@"))
      return "Valid email is required.";
    if (!form.phone.trim() || form.phone.length < 10)
      return "Valid phone number is required.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (view === "otp") {
      if (form.otp.length !== 6) {
        setError("Enter the 6-digit OTP sent to your phone.");
        return;
      }
      if (tab === "register") {
        login({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone,
        });
      }
      handleClose();
      return;
    }

    if (view === "forgot") {
      if (!form.email && !form.phone) {
        setError("Enter email or phone to reset password.");
        return;
      }
      sendOtp();
      return;
    }

    if (tab === "register") {
      const err = validateRegister();
      if (err) {
        setError(err);
        return;
      }
      sendOtp();
      return;
    }

    if (!form.email && !form.phone) {
      setError("Enter email or phone to login.");
      return;
    }
    if (!form.password) {
      setError("Password is required.");
      return;
    }
    login({
      name:
        form.name.trim() ||
        form.email.split("@")[0] ||
        `User ${form.phone.slice(-4)}`,
      email: form.email.trim(),
      phone: form.phone,
    });
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <motion.button
            type="button"
            aria-label="Close overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
              <h2 id="auth-modal-title" className="section-title">
                {view === "forgot"
                  ? "Forgot Password"
                  : view === "otp"
                    ? "Verify OTP"
                    : tab === "login"
                      ? "Login"
                      : "Create Account"}
              </h2>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                ✕
              </motion.button>
            </div>

            {view === "form" && (
              <div className="flex border-b border-gray-100">
                {(["login", "register"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTab(t);
                      setError("");
                    }}
                    className={`flex-1 py-3 text-sm font-semibold capitalize transition ${
                      tab === t
                        ? "border-b-2 border-[#f75d34] text-[#f75d34]"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {view === "otp" && (
                <div className="space-y-4">
                  <p className="text-body-muted">
                    We sent a 6-digit OTP to{" "}
                    <span className="font-semibold text-gray-900">
                      +91 {form.phone || "your number"}
                    </span>
                  </p>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-600">
                      One Time Verify Number (OTP)
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={form.otp}
                      onChange={(e) =>
                        updateField("otp", e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Enter 6-digit OTP"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-center text-lg tracking-[0.5em] outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
                    />
                  </label>
                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      disabled={otpTimer > 0}
                      onClick={sendOtp}
                      className="font-medium text-[#f75d34] disabled:text-gray-400"
                    >
                      {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend OTP"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setView("form");
                        setForm((f) => ({ ...f, otp: "" }));
                      }}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      ← Back
                    </button>
                  </div>
                </div>
              )}

              {view === "forgot" && (
                <div className="space-y-4">
                  <p className="text-body-muted">
                    Enter your registered email or phone. We will send an OTP to
                    reset your password.
                  </p>
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => updateField("email", v)}
                    placeholder="you@email.com"
                  />
                  <Field
                    label="Phone"
                    type="tel"
                    value={form.phone}
                    onChange={(v) =>
                      updateField("phone", v.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="10-digit mobile number"
                  />
                  <button
                    type="button"
                    onClick={() => setView("form")}
                    className="text-caption sm:text-sm hover:text-[#f75d34]"
                  >
                    ← Back to Login
                  </button>
                </div>
              )}

              {view === "form" && (
                <>
                  {tab === "register" && (
                    <Field
                      label="Full Name"
                      value={form.name}
                      onChange={(v) => updateField("name", v)}
                      placeholder="Enter your name"
                      required
                    />
                  )}

                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => updateField("email", v)}
                    placeholder="you@email.com"
                    required
                  />

                  <Field
                    label="Phone Number"
                    type="tel"
                    value={form.phone}
                    onChange={(v) =>
                      updateField("phone", v.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="10-digit mobile number"
                    required
                  />

                  {tab === "register" && view === "form" && (
                    <>
                      <Field
                        label="Create Password"
                        type="password"
                        value={form.password}
                        onChange={(v) => updateField("password", v)}
                        placeholder="Min. 6 characters"
                        required
                      />
                      <Field
                        label="Confirm Password"
                        type="password"
                        value={form.confirmPassword}
                        onChange={(v) => updateField("confirmPassword", v)}
                        placeholder="Re-enter password"
                        required
                      />
                    </>
                  )}

                  {tab === "login" && (
                    <>
                      <Field
                        label="Password"
                        type="password"
                        value={form.password}
                        onChange={(v) => updateField("password", v)}
                        placeholder="Enter your password"
                        required
                      />
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setView("forgot");
                            setError("");
                          }}
                          className="text-sm font-medium text-[#f75d34] hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, backgroundColor: "#e54d24" }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-lg bg-[#f75d34] py-3 text-sm font-semibold text-white"
              >
                {view === "otp"
                  ? "Verify & Continue"
                  : view === "forgot"
                    ? "Send OTP"
                    : tab === "register"
                      ? "Register & Verify OTP"
                      : "Login"}
              </motion.button>

              {view === "form" && tab === "register" && (
                <p className="text-center text-caption">
                  After register, OTP will be sent to your phone for one-time
                  verification.
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-600">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
      />
    </label>
  );
}
