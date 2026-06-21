"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, CreditCard, Bell, Shield, Link2, ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface ConnectedAccount {
  platform: string;
  account_name: string | null;
  is_active: boolean;
}

const platformDisplay: Record<string, { label: string; color: string }> = {
  tiktok: { label: "TikTok", color: "#000000" },
  meta: { label: "Meta", color: "#1877F2" },
  google: { label: "Google", color: "#4285F4" },
  linkedin: { label: "LinkedIn", color: "#0A66C2" },
};

const ALL_PLATFORMS = ["tiktok", "meta", "google", "linkedin"];

const menuItems = [
  { label: "Profil", icon: User, href: "#" },
  { label: "Plati", icon: CreditCard, href: "#" },
  { label: "Notificari", icon: Bell, href: "#" },
  { label: "Securitate", icon: Shield, href: "#" },
  { label: "Conturi conectate", icon: Link2, href: "#" },
];

export default function SettingsPage() {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoading(false);
        return;
      }

      setEmail(userData.user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, credit_balance")
        .eq("id", userData.user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name ?? "");
        setCreditBalance(profile.credit_balance ?? 0);
      }

      const { data: accounts } = await supabase
        .from("connected_accounts")
        .select("platform, account_name, is_active")
        .eq("user_id", userData.user.id);

      setConnectedAccounts(accounts ?? []);
      setLoading(false);
    };

    loadData();
  }, []);

  const initials = fullName
    ? fullName
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const accountsByPlatform = ALL_PLATFORMS.map((platform) => {
    const found = connectedAccounts.find((a) => a.platform === platform && a.is_active);
    return {
      platform,
      ...platformDisplay[platform],
      connected: !!found,
      accountName: found?.account_name ?? null,
    };
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF9FA" }}>
      <div className="flex items-center gap-4 p-4" style={{ backgroundColor: "#ffffff" }}>
        <Link href="/chat" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Menu className="h-6 w-6 text-gray-600" />
        </Link>
        <h1 className="text-lg font-semibold text-gray-800">Cont</h1>
      </div>

      <div className="p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl text-center"
          style={{ backgroundColor: "#FD1843" }}
        >
          <div
            className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white"
            style={{ backgroundColor: "#ffffff30" }}
          >
            {loading ? "..." : initials}
          </div>
          <h2 className="text-xl font-bold text-white">{loading ? "Se încarcă..." : fullName || "Fără nume"}</h2>
          <p className="text-white/80">{email}</p>
          <p className="text-white/60 text-sm mt-1">Credit disponibil: {creditBalance} Lei</p>
        </motion.div>

        <div className="space-y-2">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors" style={{ backgroundColor: "#ffffff" }}>
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" style={{ color: "#FD1843" }} />
                  <span className="text-gray-700">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </motion.div>
          ))}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Conturi conectate</h3>
          <div className="space-y-2">
            {accountsByPlatform.map((account, i) => (
              <motion.div
                key={account.platform}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center justify-between p-4 rounded-2xl"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: account.color }} />
                  <div>
                    <span className="text-gray-700 block">{account.label}</span>
                    {account.accountName && (
                      <span className="text-gray-400 text-xs">{account.accountName}</span>
                    )}
                  </div>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    account.connected ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {account.connected ? "Conectat" : "Deconectat"}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
