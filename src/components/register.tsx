"use client";

import type { SyntheticEvent } from "react";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function Register({ onSuccess }: { onSuccess?: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  // Field validation rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors = {
    username: !username.trim() ? "Username is required." : "",
    email: !email.trim()
      ? "Email is required."
      : !emailRegex.test(email.trim())
        ? "Please enter a valid email address."
        : "",
    password: password.length < 6 ? "Password must be at least 6 characters." : "",
    confirmPassword:
      password !== confirmPassword
        ? "Passwords do not match."
        : !confirmPassword
          ? "Please confirm your password."
          : "",
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  async function handleRegister(e: SyntheticEvent) {
    e.preventDefault();
    setServerError(null);

    // Mark all fields as touched on submit
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Block submission if any client validation fails
    if (Object.values(errors).some(Boolean)) {
      return;
    }

    setLoading(true);

    try {
      // Uses RPC to bypass Supabase email sending rate limits (429) for fake/dev data
      const { error: createError } = await supabase.rpc("create_fake_user", {
        user_email: email.trim(),
        user_password: password,
      });

      if (createError) {
        setServerError(createError.message);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setServerError(signInError.message);
        return;
      }

      router.refresh();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/home");
      }
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <fieldset className="flex flex-col max-w-sm mx-auto">
      <legend className="text-lg font-bold mb-4">Register</legend>

      {serverError && (
        <div className="alert alert-error text-xs py-2 mb-4">
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        {/* Username */}
        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Username"
            autoComplete="username"
            className={`input input-bordered w-full ${
              touched.username && errors.username ? "input-error" : ""
            }`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => handleBlur("username")}
          />
          {touched.username && errors.username && (
            <span className="text-error text-xs px-1">{errors.username}</span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            className={`input input-bordered w-full ${
              touched.email && errors.email ? "input-error" : ""
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
          />
          {touched.email && errors.email && (
            <span className="text-error text-xs px-1">{errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <input
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            className={`input input-bordered w-full ${
              touched.password && errors.password ? "input-error" : ""
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
          />
          {touched.password && errors.password && (
            <span className="text-error text-xs px-1">{errors.password}</span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <input
            type="password"
            placeholder="Confirm Password"
            autoComplete="new-password"
            className={`input input-bordered w-full ${
              touched.confirmPassword && errors.confirmPassword ? "input-error" : ""
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => handleBlur("confirmPassword")}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <span className="text-error text-xs px-1">{errors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
          {loading ? <span className="loading loading-spinner loading-xs" /> : "Submit"}
        </button>
      </form>

      <p className="text-start text-sm text-base-content/70 mt-4">
        Already have an account?{" "}
        <Link href="/login" replace className="link link-primary font-semibold">
          Log in here
        </Link>
      </p>
    </fieldset>
  );
}

export default Register;
