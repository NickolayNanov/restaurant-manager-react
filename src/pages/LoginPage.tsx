import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import FormErrorSummary from "../components/shared/FormErrorSummary";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = (location.state as { message?: string } | null)?.message;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    setBusy(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch {
      setErrors(["Invalid email or password."]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto flex min-h-full max-w-md items-center px-4 py-10">
        <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Sign in</h1>
          <p className="mt-1 text-sm text-slate-600">
            Welcome back to your restaurant workspace.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-xs font-medium text-slate-700">Email</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                type="email"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700">Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {successMessage && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}

            <FormErrorSummary messages={errors} />

            <button
              disabled={busy}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link className="font-semibold text-slate-900 hover:text-slate-700" to="/register">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
