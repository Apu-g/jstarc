"use client"

import { motion } from "framer-motion"
import { useProfileStore } from "@/lib/useProfileStore"

export function OverlayLayer() {
  const { setActive } = useProfileStore()

  return (
    <motion.button
      aria-label="Close expanded profile"
      onClick={() => setActive(null)}
      className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    />
  )
}

export default OverlayLayer