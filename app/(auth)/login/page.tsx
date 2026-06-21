"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setLoading(false);
      if (loginError.message.includes("Email not confirmed")) {
        setError("Te rugăm să confirmi emailul înainte de a te conecta.");
      } else {
        setError("Email sau parolă greșite.");
      }
      return;
    }

    if (data.user) {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (!existingProfile) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: data.user.user_metadata?.full_name ?? null,
        });
      }
    }

    setLoading(false);
    router.push("/chat");
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FFF9FA" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 rounded-3xl shadow-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="h-8 w-8" style={{ color: "#FD1843" }} />
          <h1 className="text-3xl font-bold" style={{ color: "#FD1843" }}>AIADS</h1>
        </div>

        <p className="text-center mb-8 text-gray-500">Reclame într-o secundă</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-400 transition-colors"
              style={{ backgroundColor: "#FFF9FA" }}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              placeholder="Parolă"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-400 transition-colors"
              style={{ backgroundColor: "#FFF9FA" }}
            />
          </div>

          {error && (
            <p className="text-sm text-center" style={{ color: "#FD1843" }}>
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ backgroundColor: "#FD1843" }}
          >
            {loading ? "Se conectează..." : "Intră în cont"}
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Nu ai cont?{" "}
          <Link href="/signup" className="font-semibold hover:underline" style={{ color: "#FD1843" }}>
            Creează unul
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
