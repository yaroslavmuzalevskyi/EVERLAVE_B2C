"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/LogoDark";
import TextInput from "@/components/auth/TextInput";
import PrimaryButton from "@/components/auth/PrimaryButton";
import AuthLinkRow from "@/components/auth/AuthLinkRow";
import { useAuth } from "@/components/auth/AuthProvider";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors: typeof errors = {};
    if (!email || !email.includes("@")) {
      nextErrors.email = "Enter a valid email";
    }
    if (!password || password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await login(email.trim().toLowerCase(), password);
      const next = new URLSearchParams(window.location.search).get("next") || "/";
      router.push(next);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Unable to sign in",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center">
        <Logo />
      </div>
      <div className="mt-6 text-center">
        <h1 className="text-2xl font-semibold">Sign in to your account</h1>
        <p className="mt-2 text-sm text-pr_dg/70">
          Welcome back, please enter your details
        </p>
      </div>

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          error={errors.email}
        />
        <TextInput
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          error={errors.password}
        />
        {formError ? <p className="text-xs text-pr_dr">{formError}</p> : null}
        <PrimaryButton type="submit" loading={isSubmitting}>
          Login
        </PrimaryButton>
      </form>

      <div className="mt-6">
        <AuthLinkRow
          text="Don’t have an account?"
          linkText="Sign up"
          href="/signup"
        />
      </div>
    </div>
  );
}
