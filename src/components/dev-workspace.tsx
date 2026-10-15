"use client";

import { createClient } from "@/utils/supabase/client";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function DevWorkspace() {
  const supabase = createClient();

  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_DEV_USER_EMAIL || "");
  const [password, setPassword] = useState(process.env.NEXT_PUBLIC_DEV_USER_PASSWORD || "");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [authMessage, setAuthMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Resource Form State
  const [resourceTitle, setResourceTitle] = useState("Sample Resource");
  const [resourceUrl, setResourceUrl] = useState("https://example.com");
  const [resourceDescription, setResourceDescription] = useState(
    "A test resource created from dev workspace",
  );
  const [loadingResource, setLoadingResource] = useState(false);
  const [resourceResult, setResourceResult] = useState<string | null>(null);

  // Check auth state on mount
  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    }
    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Handle Login
  async function handleLogin() {
    setLoadingAuth(true);
    setAuthMessage(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthMessage({ type: "error", text: error.message });
      } else {
        setCurrentUser(data.user);
        setAuthMessage({
          type: "success",
          text: `Logged in successfully as ${data.user.email}`,
        });
      }
    } catch (err: unknown) {
      setAuthMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Login failed",
      });
    } finally {
      setLoadingAuth(false);
    }
  }

  // Handle Sign Up (if user does not exist in Supabase auth yet)
  async function handleSignUp() {
    setLoadingAuth(true);
    setAuthMessage(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setAuthMessage({ type: "error", text: error.message });
      } else {
        setAuthMessage({
          type: "success",
          text: `User created! Check email or auto-confirmed: ${data.user?.email || email}`,
        });
        if (data.user) {
          setCurrentUser(data.user);
        }
      }
    } catch (err: unknown) {
      setAuthMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Sign up failed",
      });
    } finally {
      setLoadingAuth(false);
    }
  }

  // Handle Sign Out
  async function handleSignOut() {
    setLoadingAuth(true);
    setAuthMessage(null);
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setAuthMessage({ type: "success", text: "Signed out successfully" });
    } catch (err: unknown) {
      setAuthMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Sign out failed",
      });
    } finally {
      setLoadingAuth(false);
    }
  }

  // Handle Create Resource
  async function handleCreateResource() {
    setLoadingResource(true);
    setResourceResult(null);

    try {
      if (!currentUser) {
        setResourceResult(
          JSON.stringify(
            {
              warning: "You are not logged in!",
              details:
                "RLS policies usually require an active session where user_id = auth.uid(). Please log in using the Auth card above first.",
            },
            null,
            2,
          ),
        );
        setLoadingResource(false);
        return;
      }

      // Build resource payload
      const payload: Record<string, unknown> = {
        title: resourceTitle,
        url: resourceUrl,
        description: resourceDescription,
        user_id: currentUser.id,
      };

      const { data, error } = await supabase.from("resources").insert(payload).select();

      if (error) {
        if (error.code === "42501") {
          setResourceResult(
            JSON.stringify(
              {
                error,
                hint: "RLS policy error: ensure you ran the RLS policies in Supabase SQL editor to allow authenticated users to INSERT on public.resources.",
              },
              null,
              2,
            ),
          );
          return;
        }

        // Fallback for column naming if title is not present
        if (error.message.includes('column "title" of relation "resources" does not exist')) {
          const fallbackPayload: Record<string, unknown> = {
            name: resourceTitle,
            url: resourceUrl,
            description: resourceDescription,
            user_id: currentUser.id,
          };

          const fallbackResult = await supabase.from("resources").insert(fallbackPayload).select();

          setResourceResult(JSON.stringify(fallbackResult, null, 2));
          return;
        }

        setResourceResult(JSON.stringify({ error }, null, 2));
      } else {
        setResourceResult(JSON.stringify({ success: true, data }, null, 2));
      }
    } catch (err: unknown) {
      setResourceResult(
        JSON.stringify(
          { error: err instanceof Error ? err.message : "Failed to create resource" },
          null,
          2,
        ),
      );
    } finally {
      setLoadingResource(false);
    }
  }

  // Fetch Existing Resources
  async function handleFetchResources() {
    setLoadingResource(true);
    setResourceResult(null);
    try {
      const { data, error } = await supabase.from("resources").select("*").limit(10);
      if (error) {
        setResourceResult(JSON.stringify({ error }, null, 2));
      } else {
        setResourceResult(JSON.stringify({ count: data?.length ?? 0, data }, null, 2));
      }
    } catch (err: unknown) {
      setResourceResult(
        JSON.stringify(
          { error: err instanceof Error ? err.message : "Failed to fetch resources" },
          null,
          2,
        ),
      );
    } finally {
      setLoadingResource(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dev Workspace</h1>
        <p className="text-base-content/70 mt-1">
          Test authentication and database operations directly with Supabase.
        </p>
      </div>

      {/* Auth Section */}
      <div className="card bg-base-200 border border-base-300 shadow-sm">
        <div className="card-body space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-xl">Supabase Authentication</h2>
            {currentUser ? (
              <span className="badge badge-success gap-1">Active Session</span>
            ) : (
              <span className="badge badge-warning gap-1">Not Logged In</span>
            )}
          </div>

          {currentUser ? (
            <div className="bg-base-100 p-4 rounded-lg space-y-2 border border-base-300 text-sm">
              <p>
                <span className="font-semibold">Email:</span> {currentUser.email}
              </p>
              <p>
                <span className="font-semibold">User ID (UUID):</span>{" "}
                <code className="text-xs bg-base-300 px-1 py-0.5 rounded">{currentUser.id}</code>
              </p>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={loadingAuth}
                className="btn btn-outline btn-sm btn-error mt-2"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Dev Email</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="dev@example.com"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Dev Password</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="password"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loadingAuth}
                  className="btn btn-primary btn-sm"
                >
                  {loadingAuth ? "Logging in..." : "Log In with Dev Credentials"}
                </button>
                <button
                  type="button"
                  onClick={handleSignUp}
                  disabled={loadingAuth}
                  className="btn btn-outline btn-sm"
                >
                  Sign Up (New Dev User)
                </button>
              </div>
            </div>
          )}

          {authMessage && (
            <div
              className={`alert ${
                authMessage.type === "success" ? "alert-success" : "alert-error"
              } text-sm py-2`}
            >
              <span>{authMessage.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Resource Creation Section */}
      <div className="card bg-base-200 border border-base-300 shadow-sm">
        <div className="card-body space-y-4">
          <h2 className="card-title text-xl">Create a Resource</h2>
          <p className="text-sm text-base-content/70">
            Insert a new record into the <code>resources</code> table (with your UUID if logged in).
          </p>

          <div className="space-y-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Title / Name</span>
              </label>
              <input
                type="text"
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Resource title"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">URL</span>
              </label>
              <input
                type="text"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                className="input input-bordered w-full"
                placeholder="https://..."
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                value={resourceDescription}
                onChange={(e) => setResourceDescription(e.target.value)}
                className="textarea textarea-bordered w-full"
                rows={3}
                placeholder="Description of the resource"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={handleCreateResource}
              disabled={loadingResource}
              className="btn btn-secondary btn-sm"
            >
              {loadingResource ? "Creating..." : "Create Resource"}
            </button>
            <button
              type="button"
              onClick={handleFetchResources}
              disabled={loadingResource}
              className="btn btn-ghost btn-sm"
            >
              Fetch Resources
            </button>
          </div>

          {resourceResult && (
            <div className="mt-4 space-y-1">
              <span className="text-xs font-semibold text-base-content/70">Response / Result:</span>
              <pre className="bg-base-300 p-3 rounded-lg text-xs overflow-x-auto max-h-60">
                {resourceResult}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DevWorkspace;
