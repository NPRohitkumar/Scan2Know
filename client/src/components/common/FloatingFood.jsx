import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

const FloatingFood = () => {
  const foodEmojis = ['🍎', '🥕', '🥦', '🍊', '🥛', '🧀', '🥖', '🍇', '🥑', '🍓',,'🥚','🥩','🍒','🫐','🫛','🥝','🍱']
  
  const floatingItems = useMemo(() => {
    return foodEmojis.map((emoji, index) => ({
      emoji,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 8 + Math.random() * 4,
      delay: Math.random() * 2,
      size: 30 + Math.random() * 30
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {floatingItems.map((item, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: item.left, top: item.top, fontSize: `${item.size}px` }}
          animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: item.duration, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  )
}

export default FloatingFood