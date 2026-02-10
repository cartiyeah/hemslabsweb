"use client"

import { motion } from "framer-motion"
import { UtensilsCrossed, Plane, FileText, Globe, Mail } from "lucide-react"
import ParticleBackground from "./ParticleBackground"

interface Message {
  id: number
  text: string
  sender: "user" | "bubbles"
  timestamp: string
}

const mockConversation: Message[] = [
  {
    id: 1,
    text: "Hey! Can you order me pizza?",
    sender: "user",
    timestamp: "2:34 PM",
  },
  {
    id: 2,
    text: "Sure! But honestly, pizza again? You had it twice this week. Maybe try that new Thai place?",
    sender: "bubbles",
    timestamp: "2:34 PM",
  },
  {
    id: 3,
    text: "Haha fair point. Fine, Thai it is.",
    sender: "user",
    timestamp: "2:35 PM",
  },
  {
    id: 4,
    text: "Great choice! I'll get you the Pad Thai with extra peanuts. Also, your flight check-in opens in 3 hours - want me to handle it?",
    sender: "bubbles",
    timestamp: "2:35 PM",
  },
  {
    id: 5,
    text: "Yes please! You're the best.",
    sender: "user",
    timestamp: "2:36 PM",
  },
  {
    id: 6,
    text: "I know 😎 Already done. Window seat, just how you like it.",
    sender: "bubbles",
    timestamp: "2:36 PM",
  },
]

const capabilities = [
  { icon: UtensilsCrossed, label: "Food orders" },
  { icon: Plane, label: "Flight check-ins" },
  { icon: FileText, label: "Fill forms" },
  { icon: Globe, label: "Browser tasks" },
  { icon: Mail, label: "Email management" },
]

function PhoneMockup() {
  return (
    <div className="relative w-[320px] h-[640px] mx-auto">
      {/* Glow behind phone */}
      <div className="absolute inset-0 bg-emerald-500/10 rounded-[3rem] blur-3xl" />

      {/* Phone frame */}
      <div className="relative w-full h-full bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl" />

        <div className="h-full flex flex-col pt-10 pb-6 px-4">
          {/* Chat header */}
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <span className="text-lg">🫧</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Bubbles</h3>
              <p className="text-white/50 text-xs">your sharpest friend</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 px-2">
            {mockConversation.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: message.id * 0.15, duration: 0.4 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-emerald-500 text-white"
                      : "bg-white/10 backdrop-blur-sm text-white border border-white/10"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-white/70" : "text-white/40"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input bar */}
          <div className="mt-4 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-3 border border-white/10">
            <input
              type="text"
              placeholder="Message Bubbles..."
              className="flex-1 bg-transparent text-white placeholder:text-white/40 text-sm outline-none"
              readOnly
            />
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CapabilityPill({
  icon: Icon,
  label,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={delay > 0 ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, type: "spring" }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group"
    >
      <div className="relative bg-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-sm border border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
        <div className="relative flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Icon className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-white/80 font-medium text-sm">{label}</span>
        </div>
      </div>
    </motion.div>
  )
}

interface BubblesSectionProps {
  visible: boolean
}

export default function BubblesSection({ visible }: BubblesSectionProps) {
  return (
    <div className="relative">
      {/* Particle Background - always present */}
      <ParticleBackground
        particleCount={100}
        interactionRadius={150}
      />

      {/* Content - only reveals after bubble surge completes */}
      <motion.div
        className="relative z-10 py-32"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              An AI that actually
              <br />
              <span className="text-emerald-400">gets you</span>
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              No fake politeness. Just real help. An assistant that matches your energy,
              pushes back when you're being silly, and handles your life like a real friend would.
            </p>
          </motion.div>

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <PhoneMockup />
          </motion.div>

          {/* Capabilities */}
          <div className="mt-32">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-3xl md:text-4xl font-bold text-white text-center mb-16"
            >
              Does everything you'd expect
              <br />
              <span className="text-white/50">and then some</span>
            </motion.h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {capabilities.map((capability, index) => (
                <CapabilityPill
                  key={capability.label}
                  icon={capability.icon}
                  label={capability.label}
                  delay={visible ? 1.0 + index * 0.1 : 0}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
