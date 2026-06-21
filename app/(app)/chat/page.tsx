"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Menu, User, BarChart3, Settings, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

interface CampaignSummary {
  platform: "tiktok" | "meta" | "google" | "linkedin";
  objective: string;
  budget_total: number;
  duration_days: number;
  target_location: string;
  creative_source?: "uploaded" | "existing_post";
  creative_url?: string;
}

const platformLabels: Record<string, string> = {
  tiktok: "TikTok",
  meta: "Meta",
  google: "Google",
  linkedin: "LinkedIn",
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Salut! Sunt AIADS, asistentul tau pentru reclame. Spune-mi ce campanie vrei sa faci.", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingCampaign, setPendingCampaign] = useState<CampaignSummary | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingCampaign]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const newMsg: Message = { id: Date.now(), text: input, isUser: true };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setPendingCampaign(null);
    setConfirmError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      const reply: Message = {
        id: Date.now() + 1,
        text: data.reply || "A apărut o eroare. Încearcă din nou.",
        isUser: false,
      };
      setMessages((prev) => [...prev, reply]);

      if (data.campaignSummary) {
        setPendingCampaign(data.campaignSummary as CampaignSummary);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "Nu am putut conecta la server. Încearcă din nou.", isUser: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const confirmCampaign = async () => {
    if (!pendingCampaign) return;
    setConfirming(true);
    setConfirmError(null);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setConfirmError("Sesiune expirată. Te rugăm să te reconectezi.");
      setConfirming(false);
      return;
    }

    const { data: connectedAccount } = await supabase
      .from("connected_accounts")
      .select("id")
      .eq("user_id", userData.user.id)
      .eq("platform", pendingCampaign.platform)
      .eq("is_active", true)
      .single();

    if (!connectedAccount) {
      setConfirmError(
        `Nu ai niciun cont ${platformLabels[pendingCampaign.platform]} conectat. Conectează unul din Cont.`
      );
      setConfirming(false);
      return;
    }

    const { error } = await supabase.from("campaigns").insert({
      user_id: userData.user.id,
      connected_account_id: connectedAccount.id,
      platform: pendingCampaign.platform,
      objective: pendingCampaign.objective,
      status: "pending_review",
      budget_total: pendingCampaign.budget_total,
      duration_days: pendingCampaign.duration_days,
      target_location: pendingCampaign.target_location,
      creative_source: pendingCampaign.creative_source ?? "existing_post",
      creative_url: pendingCampaign.creative_url ?? null,
      ai_generated_brief: pendingCampaign,
    });

    setConfirming(false);

    if (error) {
      setConfirmError("Nu am putut salva campania. Încearcă din nou.");
      return;
    }

    setPendingCampaign(null);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "Campania a fost creată și e în verificare. O găsești în Dashboard.",
        isUser: false,
      },
    ]);

    setTimeout(() => router.push("/dashboard"), 1200);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#FFF9FA" }}>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-full w-64 z-50 shadow-2xl p-6 flex flex-col"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="h-6 w-6" style={{ color: "#FD1843" }} />
              <h2 className="text-xl font-bold" style={{ color: "#FD1843" }}>AIADS</h2>
            </div>

            <nav className="space-y-2 flex-1">
              <Link href="/chat" className="flex items-center gap-3 p-3 rounded-xl font-medium" style={{ backgroundColor: "#FD184320", color: "#FD1843" }}>
                <Sparkles className="h-5 w-5" />
                Chat AI
              </Link>
              <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                <BarChart3 className="h-5 w-5" />
                Dashboard
              </Link>
              <Link href="/settings" className="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                <Settings className="h-5 w-5" />
                Cont
              </Link>
            </nav>

            <div className="pt-4 border-t border-gray-100">
              <Link href="/settings" className="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                <User className="h-5 w-5" />
                Profil
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-4 p-4" style={{ backgroundColor: "#ffffff" }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Chat AI</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-md p-4 rounded-2xl whitespace-pre-wrap"
                style={{
                  backgroundColor: msg.isUser ? "#FD1843" : "#ffffff",
                  color: msg.isUser ? "#ffffff" : "#333333",
                }}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="max-w-md p-4 rounded-2xl text-gray-400" style={{ backgroundColor: "#ffffff" }}>
                Se gândește...
              </div>
            </motion.div>
          )}

          {pendingCampaign && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md p-5 rounded-2xl border-2"
              style={{ borderColor: "#FD1843", backgroundColor: "#ffffff" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5" style={{ color: "#FD1843" }} />
                <span className="font-semibold text-gray-800">Rezumat campanie</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li><strong>Platformă:</strong> {platformLabels[pendingCampaign.platform]}</li>
                <li><strong>Obiectiv:</strong> {pendingCampaign.objective}</li>
                <li><strong>Buget:</strong> {pendingCampaign.budget_total} RON</li>
                <li><strong>Durată:</strong> {pendingCampaign.duration_days} zile</li>
                <li><strong>Target:</strong> {pendingCampaign.target_location}</li>
                {pendingCampaign.creative_url && (
                  <li><strong>Creative:</strong> {pendingCampaign.creative_url}</li>
                )}
              </ul>

              {confirmError && (
                <p className="text-sm mb-3" style={{ color: "#FD1843" }}>{confirmError}</p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={confirmCampaign}
                disabled={confirming}
                className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: "#FD1843" }}
              >
                {confirming ? "Se confirmă..." : "Confirmă campania"}
              </motion.button>
            </motion.div>
          )}

          <div ref={scrollRef} />
        </div>

        <div className="p-4" style={{ backgroundColor: "#ffffff" }}>
          <div className="flex items-center gap-2 p-2 rounded-2xl border border-gray-200" style={{ backgroundColor: "#FFF9FA" }}>
            <input
              type="text"
              placeholder="Scrie o campanie..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-800"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={loading}
              className="p-3 rounded-xl text-white disabled:opacity-60"
              style={{ backgroundColor: "#FD1843" }}
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
