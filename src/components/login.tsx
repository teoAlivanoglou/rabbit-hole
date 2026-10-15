"use client";

import type { SyntheticEvent } from "react";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function Login({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  // Field validation rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors = {
    email: !email.trim()
      ? "Email is required."
      : !emailRegex.test(email.trim())
        ? "Please enter a valid email address."
        : "",
    password: !password ? "Password is required." : "",
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  async function handleLogin(e: SyntheticEvent) {
    e.preventDefault();
    setServerError(null);

    // Mark fields as touched on submit
    setTouched({
      email: true,
      password: true,
    });

    // Block submission if any client validation fails
    if (Object.values(errors).some(Boolean)) {
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setServerError(error.message);
        return;
      }

      if (rememberMe && data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      router.refresh();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/home");
      }
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <fieldset className="flex flex-col max-w-sm mx-auto">
      <legend className="text-lg font-bold mb-4">Log In</legend>

      {serverError && (
        <div className="alert alert-error text-xs py-2 mb-4">
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
            onChange={(e) => {
              setEmail(e.target.value);
              if (serverError) setServerError(null);
            }}
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
            autoComplete="current-password"
            className={`input input-bordered w-full ${
              touched.password && errors.password ? "input-error" : ""
            }`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (serverError) setServerError(null);
            }}
            onBlur={() => handleBlur("password")}
          />
          {touched.password && errors.password && (
            <span className="text-error text-xs px-1">{errors.password}</span>
          )}
        </div>

        <span className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            id="remember-me"
            className="checkbox checkbox-primary"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember-me" className="text-sm">
            Remember me
          </label>
        </span>

        <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
          {loading ? <span className="loading loading-spinner loading-xs" /> : "Submit"}
        </button>
      </form>

      <p className="text-start text-sm text-base-content/70 mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/register" replace className="link link-primary font-semibold">
          Register here
        </Link>
      </p>
    </fieldset>
  );
}

export default Login;
