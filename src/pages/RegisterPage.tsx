import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getApiErrorMessages, isApiError } from "../api/apiFetch";
import FormErrorSummary from "../components/shared/FormErrorSummary";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);

    if (password !== confirmPassword) {
      setErrors(["Passwords do not match."]);
      return;
    }

    setBusy(true);
    try {
      await register({ username, email, password, confirmPassword });
      navigate("/login", {
        replace: true,
        state: { message: "Account created. Please sign in." },
      });
    } catch (err) {
      setErrors(
        isApiError(err) && err.isValidationError
          ? getApiErrorMessages(err, "Please review your registration details.")
          : ["Registration failed. Please review your details."]
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto flex min-h-full max-w-md items-center px-4 py-10">
        <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Create account</h1>
          <p className="mt-1 text-sm text-slate-600">
            Set up your restaurant manager account.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-xs font-medium text-slate-700">Username</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                minLength={3}
                required
              />
            </div>

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
                autoComplete="new-password"
                minLength={3}
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700">Confirm password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={3}
                required
              />
            </div>

            <FormErrorSummary messages={errors} />

            <button
              disabled={busy}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {busy ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="font-semibold text-slate-900 hover:text-slate-700" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
