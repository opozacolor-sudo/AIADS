"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Eye, DollarSign, BarChart3, Menu, Settings, User } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Campaign {
  id: string;
  platform: string;
  objective: string;
  status: string;
  budget_total: number;
  spent: number;
}

const platformColors: Record<string, string> = {
  tiktok: "#000000",
  meta: "#1877F2",
  google: "#4285F4",
  linkedin: "#0A66C2",
};

const statusLabels: Record<string, string> = {
  active: "Activ",
  paused: "Pauza",
  draft: "Ciorna",
  completed: "Finalizata",
  pending_review: "In verificare",
  failed: "Esuata",
  rejected: "Respinsa",
};

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoading(false);
        return;
      }

      const { data: campaignsData } = await supabase
        .from("campaigns")
        .select("id, platform, objective, status, budget_total")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      const { data: spendData } = await supabase
        .from("transactions")
        .select("campaign_id, amount_net")
        .eq("user_id", userData.user.id)
        .eq("type", "campaign_spend");

      const spentByCampaign: Record<string, number> = {};
      (spendData ?? []).forEach((t) => {
        if (t.campaign_id) {
          spentByCampaign[t.campaign_id] = Math.abs(t.amount_net);
        }
      });

      const merged: Campaign[] = (campaignsData ?? []).map((c) => ({
        ...c,
        spent: spentByCampaign[c.id] ?? 0,
      }));

      setCampaigns(merged);
      setLoading(false);
    };

    loadData();
  }, []);

  const activeCount = campaigns.filter((c) => c.status === "active").length;
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget_total, 0);

  const stats = [
    { label: "Campanii active", value: String(activeCount), icon: BarChart3, color: "#FD1843" },
    { label: "Campanii totale", value: String(campaigns.length), icon: Eye, color: "#1877F2" },
    { label: "Buget cheltuit", value: `${totalSpent.toFixed(0)} Lei`, icon: DollarSign, color: "#25D366" },
    { label: "Buget total", value: `${totalBudget.toFixed(0)} Lei`, icon: TrendingUp, color: "#E4405F" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF9FA" }}>
      <div className="flex items-center gap-4 p-4" style={{ backgroundColor: "#ffffff" }}>
        <Link href="/chat" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Menu className="h-6 w-6 text-gray-600" />
        </Link>
        <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/settings" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <Settings className="h-5 w-5 text-gray-600" />
          </Link>
          <Link href="/settings" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <User className="h-5 w-5 text-gray-600" />
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-2xl shadow-sm"
              style={{ backgroundColor: "#ffffff" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                <span className="text-sm text-gray-500">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Campanii</h2>

          {loading && <p className="text-gray-400 text-sm">Se încarcă...</p>}

          {!loading && campaigns.length === 0 && (
            <p className="text-gray-400 text-sm">Nu ai nicio campanie încă. Creează una din Chat AI.</p>
          )}

          <div className="space-y-3">
            {campaigns.map((campaign, i) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-2xl"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: platformColors[campaign.platform] ?? "#999" }}
                    />
                    <span className="font-medium text-gray-800 capitalize">
                      {campaign.platform} - {campaign.objective}
                    </span>
                  </div>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      campaign.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {statusLabels[campaign.status] ?? campaign.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Buget: {campaign.budget_total} Lei</span>
                  <span>Cheltuit: {campaign.spent} Lei</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
