"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UtensilsCrossed, Plane, FileText, Globe, Mail, Plus, ChevronUp, Mic, Paperclip, SmilePlus } from "lucide-react"
import { cn } from "@/lib/utils"
import ParticleBackground from "./ParticleBackground"

// ── Chat message type ──

interface ChatMessage {
  from: "user" | "bubbles"
  text: string
  time: string
}

// ── Menu items for accordion + iPhone mockup ──

interface MenuItem {
  id: string
  label: string
  title: string
  description: string
  messages: ChatMessage[]
}

const menuItems: MenuItem[] = [
  {
    id: "hungry",
    label: "Hungry?",
    title: "Order food, effortlessly",
    description:
      "Tell Bubbles what you're craving. It'll find the best spots, compare prices, and place your order — no app-hopping needed.",
    messages: [
      { from: "user", text: "bro im starving", time: "8:42 PM" },
      { from: "bubbles", text: "🫧 again?? you literally ate 2 hours ago. anyway, what do you want", time: "8:42 PM" },
      { from: "user", text: "biryani. the good kind.", time: "8:43 PM" },
      { from: "bubbles", text: "🫧 Meghana's has 4.6 stars nearby, ₹320 a plate. Swiggy's got ₹75 off rn. you're welcome in advance", time: "8:43 PM" },
      { from: "user", text: "DO IT", time: "8:43 PM" },
      { from: "bubbles", text: "🫧 done. 28 mins. try not to pass out before it arrives", time: "8:44 PM" },
    ],
  },
  {
    id: "trip",
    label: "Planning a trip?",
    title: "Travel, sorted",
    description:
      "Flights, hotels, itineraries — Bubbles handles the boring stuff so you can focus on the adventure.",
    messages: [
      { from: "user", text: "i wanna go to goa next weekend", time: "3:15 PM" },
      { from: "bubbles", text: "🫧 oh we're being spontaneous now? love that for you. IndiGo BLR→GOI, Friday 6 AM, ₹2,400. return Sunday ₹2,100", time: "3:15 PM" },
      { from: "user", text: "thats cheap. book it", time: "3:16 PM" },
      { from: "bubbles", text: "🫧 booked. want me to find a stay near Baga or are you sleeping on the beach", time: "3:16 PM" },
      { from: "user", text: "yeah under 3k a night", time: "3:16 PM" },
      { from: "bubbles", text: "🫧 found one. 4.4 stars, pool, 2 min from beach, ₹2,800/night. honestly jealous. locked in.", time: "3:17 PM" },
    ],
  },
  {
    id: "emails",
    label: "Unread emails??",
    title: "Inbox zero, finally",
    description:
      "Bubbles reads, summarizes, and drafts replies. You just approve and send.",
    messages: [
      { from: "user", text: "i have 47 unread emails i cant", time: "10:02 AM" },
      { from: "bubbles", text: "🫧 47?? bestie that's not an inbox that's a crime scene. scanning...", time: "10:02 AM" },
      { from: "bubbles", text: "🫧 ok breakdown:\n• 3 actually matter\n• 8 need replies\n• 36 are pure garbage", time: "10:03 AM" },
      { from: "user", text: "nuke the spam", time: "10:03 AM" },
      { from: "bubbles", text: "🫧 obliterated. drafted replies for the 8 too. i'm too good to you", time: "10:03 AM" },
      { from: "user", text: "send em. i trust you", time: "10:04 AM" },
      { from: "bubbles", text: "🫧 sent. inbox down to 3. you owe me", time: "10:04 AM" },
    ],
  },
  {
    id: "hotel",
    label: "Last min hotel?",
    title: "Booked in seconds",
    description:
      "Need a room tonight? Bubbles scans deals across platforms and books the best one instantly.",
    messages: [
      { from: "user", text: "bro i missed my train. stuck in pune. need a hotel NOW", time: "11:30 PM" },
      { from: "bubbles", text: "🫧 how do you keep doing this to yourself. checking MakeMyTrip, Booking, OYO...", time: "11:30 PM" },
      { from: "bubbles", text: "🫧 Lemon Tree, 12 min away, ₹1,900. clean, 4.2 stars. unless you want to sleep at the station?", time: "11:31 PM" },
      { from: "user", text: "BOOK IT", time: "11:31 PM" },
      { from: "bubbles", text: "🫧 done. confirmation in your email. maybe set an alarm this time?", time: "11:31 PM" },
    ],
  },
  {
    id: "reminders",
    label: "Reminders",
    title: "Never forget anything",
    description:
      "Smart reminders that adapt to your schedule. Bubbles nudges you at the right time, not just the set time.",
    messages: [
      { from: "user", text: "remind me to call mom tomorrow", time: "9:10 PM" },
      { from: "bubbles", text: "🫧 when? you've got classes till 4 and gym at 6. i know your schedule better than you do", time: "9:10 PM" },
      { from: "user", text: "idk whenever im free", time: "9:11 PM" },
      { from: "bubbles", text: "🫧 4:30 it is. right after class, before gym. see, this is why you need me", time: "9:11 PM" },
      { from: "user", text: "also remind me to renew spotify", time: "9:12 PM" },
      { from: "bubbles", text: "🫧 billing's on the 15th. i'll bug you on the 14th. can't have you losing your playlists, that'd be tragic", time: "9:12 PM" },
    ],
  },
]

// ── Chat Bubble ──

function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.from === "user"
  return (
    <div className={cn("flex mb-1.5", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] px-3 py-1.5 text-[13px] leading-[18px] text-white relative whitespace-pre-line",
          isUser
            ? "bg-[#005c4b] rounded-lg rounded-tr-sm"
            : "bg-[#1f2c34] rounded-lg rounded-tl-sm"
        )}
      >
        <span>{msg.text}</span>
        <span className="text-[10px] text-white/40 ml-2 float-right mt-1">{msg.time}</span>
      </div>
    </div>
  )
}

// ── WhatsApp doodle background pattern ──

const WA_FONT = '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, sans-serif'

function WhatsAppDoodles() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="wa-doodles" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          {/* Clock */}
          <circle cx="15" cy="15" r="8" fill="none" stroke="white" strokeWidth="1.2" />
          <line x1="15" y1="15" x2="15" y2="10" stroke="white" strokeWidth="1.2" />
          <line x1="15" y1="15" x2="19" y2="15" stroke="white" strokeWidth="1.2" />
          {/* Phone */}
          <rect x="55" y="8" width="10" height="16" rx="2" fill="none" stroke="white" strokeWidth="1.2" />
          <circle cx="60" cy="21" r="1" fill="white" />
          {/* Chat bubble */}
          <rect x="95" y="10" width="16" height="10" rx="3" fill="none" stroke="white" strokeWidth="1.2" />
          <polygon points="98,20 95,25 101,20" fill="white" opacity="0.8" />
          {/* Star */}
          <polygon points="30,65 32,71 38,71 33,75 35,81 30,77 25,81 27,75 22,71 28,71" fill="none" stroke="white" strokeWidth="1" />
          {/* Lock */}
          <rect x="70" y="68" width="10" height="8" rx="1.5" fill="none" stroke="white" strokeWidth="1.2" />
          <path d="M72,68 v-3 a3,3 0 0,1 6,0 v3" fill="none" stroke="white" strokeWidth="1.2" />
          {/* Music note */}
          <circle cx="108" cy="72" r="3" fill="none" stroke="white" strokeWidth="1.2" />
          <line x1="111" y1="72" x2="111" y2="60" stroke="white" strokeWidth="1.2" />
          <line x1="111" y1="60" x2="116" y2="58" stroke="white" strokeWidth="1.2" />
          {/* Smiley */}
          <circle cx="20" cy="105" r="8" fill="none" stroke="white" strokeWidth="1.2" />
          <circle cx="17" cy="103" r="1" fill="white" />
          <circle cx="23" cy="103" r="1" fill="white" />
          <path d="M16,108 Q20,112 24,108" fill="none" stroke="white" strokeWidth="1" />
          {/* Camera */}
          <rect x="60" y="98" width="14" height="10" rx="2" fill="none" stroke="white" strokeWidth="1.2" />
          <circle cx="67" cy="103" r="3" fill="none" stroke="white" strokeWidth="1" />
          <rect x="63" y="96" width="6" height="3" rx="1" fill="none" stroke="white" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wa-doodles)" />
    </svg>
  )
}

// ── iPhone Mockup (WhatsApp dark mode chat) ──

function IPhoneMockup({ item }: { item: MenuItem }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* iPhone Frame */}
      <div className="relative w-[340px] h-[680px] bg-zinc-900 rounded-[60px] shadow-2xl border-[14px] border-zinc-800 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[30px] bg-black rounded-b-3xl z-20" />

        {/* Screen Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex flex-col"
            style={{ backgroundColor: "#0b141a", fontFamily: WA_FONT }}
          >
            {/* WhatsApp Header */}
            <div
              className="flex items-center gap-3 px-4 pt-10 pb-3 z-10"
              style={{ backgroundColor: "#1f2c34" }}
            >
              <div className="w-9 h-9 rounded-full bg-emerald-500/30 flex items-center justify-center text-lg">
                🫧
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-semibold leading-tight">Bubbles</p>
                <p className="text-emerald-400 text-[11px] leading-tight">online</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 relative">
              <WhatsAppDoodles />
              <div className="relative z-10">
                {item.messages.map((msg, i) => (
                  <ChatBubble key={i} msg={msg} />
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 px-2 py-2" style={{ backgroundColor: "#1f2c34" }}>
              <div className="flex-1 flex items-center gap-2 bg-[#2a3942] rounded-full px-4 py-2">
                <SmilePlus size={20} className="text-white/40 shrink-0" />
                <span className="text-white/30 text-sm flex-1">Type a message</span>
                <Paperclip size={18} className="text-white/40 shrink-0" />
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                <Mic size={20} className="text-white" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Reflection */}
      <div className="absolute bottom-0 w-[340px] h-[340px] bg-gradient-to-b from-white/5 to-transparent blur-3xl -z-10" />
    </div>
  )
}

// ── Menu Button (accordion pill) ──

function MenuButton({
  item,
  isActive,
  isExpanded,
  onClick,
}: {
  item: MenuItem
  isActive: boolean
  isExpanded: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "w-full text-left px-6 py-4 rounded-full transition-all duration-300 relative overflow-hidden group",
        "backdrop-blur-xl backdrop-saturate-150",
        isActive
          ? "bg-white/[0.12] text-white border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_20px_rgba(255,255,255,0.08)]"
          : "bg-white/[0.07] text-zinc-300 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] hover:bg-white/[0.10] hover:text-white"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Light caustic highlight */}
      <div
        className={cn(
          "absolute inset-0 rounded-full pointer-events-none",
          isActive
            ? "bg-[radial-gradient(ellipse_at_20%_20%,rgba(255,255,255,0.25)_0%,transparent_60%)]"
            : "bg-[radial-gradient(ellipse_at_20%_20%,rgba(255,255,255,0.15)_0%,transparent_60%)]"
        )}
        style={{ filter: "url(#glass-distort)" }}
      />

      {/* Iridescent chromatic edge */}
      <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-br from-cyan-400/10 via-transparent to-pink-400/10" />

      {/* Icon pinned in place — doesn't move when bubble expands */}
      <div
        className={cn(
          "absolute top-3 left-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all",
          isActive ? "bg-white/15" : "bg-white/10"
        )}
      >
        {isActive && isExpanded ? (
          <ChevronUp size={18} className="text-white" />
        ) : (
          <Plus
            size={18}
            className={isActive ? "text-white" : "text-zinc-400"}
          />
        )}
      </div>

      {/* Button content */}
      <div className="relative z-10 pl-10">
        <span className="font-medium">{item.label}</span>

        {/* Expanded Content */}
        <AnimatePresence>
          {isActive && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="pt-3 pl-1 text-sm text-zinc-200/80">
                {item.description}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  )
}

// ── Capability Pills (unchanged) ──

const capabilities = [
  { icon: UtensilsCrossed, label: "Food orders" },
  { icon: Plane, label: "Flight check-ins" },
  { icon: FileText, label: "Fill forms" },
  { icon: Globe, label: "Browser tasks" },
  { icon: Mail, label: "Email management" },
]

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
      transition={{ delay, duration: 0.3, type: "spring" }}
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

// ── Main Section ──

interface BubblesSectionProps {
  visible: boolean
}

export default function BubblesSection({ visible }: BubblesSectionProps) {
  const [activeItem, setActiveItem] = useState(menuItems[0])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item)
    if (expandedId === item.id) {
      setExpandedId(null)
    } else {
      setExpandedId(item.id)
    }
  }

  return (
    <div className="relative">
      {/* SVG distortion filter for liquid glass effect */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="glass-distort">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
          </filter>
        </defs>
      </svg>

      {/* Particle Background - always present */}
      <ParticleBackground particleCount={100} interactionRadius={150} />

      {/* Content - only reveals after bubble surge completes */}
      <motion.div
        className="relative z-10 py-32"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              An AI that actually
              <br />
              <span className="text-emerald-400">gets you</span>
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              No fake politeness. Just real help. An assistant that matches your
              energy, pushes back when you're being silly, and handles your life
              like a real friend would.
            </p>
          </motion.div>

          {/* Accordion Menu + iPhone Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              {/* Left: Menu */}
              <div className="flex-1 max-w-md w-full space-y-3">
                {menuItems.map((item) => (
                  <MenuButton
                    key={item.id}
                    item={item}
                    isActive={activeItem.id === item.id}
                    isExpanded={expandedId === item.id}
                    onClick={() => handleItemClick(item)}
                  />
                ))}
              </div>

              {/* Right: iPhone Mockup */}
              <div className="flex-1 flex items-center justify-center">
                <IPhoneMockup item={activeItem} />
              </div>
            </div>
          </motion.div>

          {/* Capabilities */}
          <div className="mt-32">
            <motion.h3
              initial={{ opacity: 0, y: 15 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: 0.3 }}
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
                  delay={visible ? 0.4 + index * 0.06 : 0}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
