"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaGoogle,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

const platforms = [
  { name: "Facebook", icon: FaFacebookF, color: "#1877F2" },
  { name: "Instagram", icon: FaInstagram, color: "#E4405F" },
  { name: "TikTok", icon: FaTiktok, color: "#000000" },
  { name: "YouTube", icon: FaYoutube, color: "#FF0000" },
  { name: "Google", icon: FaGoogle, color: "#4285F4" },
  { name: "LinkedIn", icon: FaLinkedinIn, color: "#0A66C2" },
  { name: "WhatsApp", icon: FaWhatsapp, color: "#25D366" },
];

export default function SplashPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => router.push("/login"), 600);
    }, 4200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white overflow-hidden"
        >
          <div
            className="relative"
            style={{
              width: "220px",
              height: "420px",
              perspective: "1200px",
            }}
          >
            {platforms.map((platform, i) => {
              const Icon = platform.icon;
              const offsetY = i * 46;
              const offsetX = Math.sin(i * 0.9) * 26;
              const tiltZ = Math.sin(i * 1.3) * 10;

              return (
                <motion.div
                  key={platform.name}
                  className="absolute left-1/2"
                  style={{
                    top: offsetY,
                    width: "120px",
                    height: "120px",
                    marginLeft: "-60px",
                    transformStyle: "preserve-3d",
                  }}
                  initial={{
                    opacity: 0,
                    x: offsetX,
                    rotateZ: tiltZ,
                    rotateY: 0,
                  }}
                  animate={{
                    opacity: 1,
                    x: offsetX,
                    rotateZ: tiltZ,
                    rotateY: 360,
                  }}
                  transition={{
                    opacity: { duration: 0.5, delay: i * 0.12 },
                    rotateY: {
                      duration: 2.6,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.12 + 0.4,
                    },
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full flex items-center justify-center shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${platform.color} 0%, #FD8A6B 100%)`,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <Icon className="text-white" style={{ fontSize: "42px" }} />
                  </div>
                  <div
                    className="absolute inset-0 rounded-full flex items-center justify-center shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, #FD8A6B 0%, ${platform.color} 100%)`,
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <Icon className="text-white" style={{ fontSize: "42px" }} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
            className="text-3xl font-bold tracking-tight mt-10"
            style={{ color: "#FD1843" }}
          >
            AIADS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            className="text-gray-500 mt-2"
          >
            Reclame într-o secundă
          </motion.p>

          <motion.div
            className="mt-8 h-1 rounded-full overflow-hidden w-48 bg-gray-100"
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #FD1843, #FD8A6B)",
              }}
              animate={{ width: ["0%", "100%"] }}
              transition={{ duration: 3.8, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
