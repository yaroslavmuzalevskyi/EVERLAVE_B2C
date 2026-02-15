"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/LogoDark";
import TextInput from "@/components/auth/TextInput";
import PrimaryButton from "@/components/auth/PrimaryButton";
import AuthLinkRow from "@/components/auth/AuthLinkRow";
import { useAuth } from "@/components/auth/AuthProvider";

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors: typeof errors = {};
    if (name.trim().length < 2 || name.trim().length > 100) {
      nextErrors.name = "Name must be between 2 and 100 characters";
    }
    if (!email || !email.includes("@")) {
      nextErrors.email = "Enter a valid email";
    }
    if (password.length < 8 || password.length > 128) {
      nextErrors.password = "Password must be 8-128 characters";
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
      await register(name.trim(), email.trim().toLowerCase(), password);
      const next =
        new URLSearchParams(window.location.search).get("next") || "/";
      router.push(next);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Unable to sign up",
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
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-pr_dg/70">
          Join Evervale and start exploring premium products
        </p>
      </div>

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          label="Name"
          value={name}
          onChange={setName}
          placeholder="John Doe"
          error={errors.name}
        />
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
          Create account
        </PrimaryButton>
      </form>

      <div className="mt-6">
        <AuthLinkRow
          text="Already have an account?"
          linkText="Sign in"
          href="/signin"
        />
      </div>
    </div>
  );
}
