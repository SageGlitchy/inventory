import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import styles from "@/styles/login.module.scss";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
        setError(error.message);
    } else {
      router.push("/");
    }
};

return (
    <div className={styles.loginContainer}>
      <form className={styles.loginCard} onSubmit={handleLogin}>
        <h2>Login to Inventory</h2>
            <input
            type="email"
            placeholder="Email"
            value={email}
          onChange={e => setEmail(e.target.value)}
            required
        />
            <input
            type="password"
            placeholder="Password"
            value={password}
          onChange={e => setPassword(e.target.value)}
            required
        />
        {error && <div className={styles.error}>{error}</div>}
            <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
            </button>
        <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "#2256c5", textDecoration: "underline" }}>
            Sign up
          </Link>
        </div>
        </form>
    </div>
  );
}