"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const supabase = createClient();

  const handleSignup = async () => {
    setError(null);
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError("Nu am putut crea contul. Verifică datele introduse.");
      return;
    }

    setConfirmationSent(true);
  };

  if (confirmationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FFF9FA" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md p-8 rounded-3xl shadow-2xl text-center"
          style={{ backgroundColor: "#ffffff" }}
        >
          <CheckCircle2 className="h-14 w-14 mx-auto mb-4" style={{ color: "#FD1843" }} />
          <h2 className="text-xl font-bold mb-2">Verifică-ți emailul</h2>
          <p className="text-gray-500 mb-6">
            Ți-am trimis un link de confirmare pe <strong>{email}</strong>. Mergi pe mail și apasă pe link pentru a-ți activa contul.
          </p>
          <Link
            href="/login"
            className="font-semibold hover:underline"
            style={{ color: "#FD1843" }}
          >
            Înapoi la conectare
          </Link>
        </motion.div>
      </div>
    );
  }

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

        <p className="text-center mb-8 text-gray-500">Creează cont nou</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
          className="space-y-4"
        >
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nume complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-400 transition-colors"
              style={{ backgroundColor: "#FFF9FA" }}
            />
          </div>

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
              minLength={6}
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
            {loading ? "Se creează contul..." : "Creează cont"}
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Ai deja cont?{" "}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: "#FD1843" }}>
            Intră
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
