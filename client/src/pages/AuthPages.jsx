import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../api/client.js";

export function LoginPage() { return <AuthForm mode="login" />; }
export function RegisterPage() { return <AuthForm mode="register" />; }

function AuthForm({ mode }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      if (isRegister) await register(form);
      else await login({ email: form.email, password: form.password });
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setBusy(false); }
  }

  return (
    <main className="auth-layout">
      <div className="auth-aside"><span className="eyebrow">ISTOMIN / JOURNAL</span><h1>Your ideas<br /><em>belong here.</em></h1><p>Join a community of curious people sharing what they learn and build.</p><div className="auth-aside-mark">I.</div></div>
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-icon"><LockKeyhole size={19} /></div>
        <span className="eyebrow">{isRegister ? "CREATE AN ACCOUNT" : "WELCOME BACK"}</span>
        <h2>{isRegister ? "Join the journal" : "Sign in"}</h2>
        <p className="muted">{isRegister ? "Start publishing your ideas today." : "Pick up where you left off."}</p>
        {isRegister && <label>Username<input required minLength="3" maxLength="24" autoComplete="username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="your_name" /></label>}
        <label>Email address<input required type="email" autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
        <label>Password<input required type="password" minLength={isRegister ? 8 : 1} autoComplete={isRegister ? "new-password" : "current-password"} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={isRegister ? "At least 8 characters" : "Your password"} /></label>
        {error && <div className="notice notice-error">{error}</div>}
        <button className="button button-full" disabled={busy}>{busy ? "Please wait…" : isRegister ? "Create account" : "Sign in"} <ArrowRight size={16} /></button>
        <p className="auth-switch">{isRegister ? "Already have an account?" : "New to the journal?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Log in" : "Create an account"}</Link></p>
      </form>
    </main>
  );
}
