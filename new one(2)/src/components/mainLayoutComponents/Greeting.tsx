"use client"

import React, { useState, useEffect } from "react"

interface GreetingProps {
  userProfile: { name: string } | null
}

const Greeting: React.FC<GreetingProps> = React.memo(({ userProfile }) => {
  const [displayText, setDisplayText] = useState("")
  const [hasGreetingPlayed, setHasGreetingPlayed] = useState(false)

  const hour = new Date().getHours()
  const greetingText =
    hour >= 0 && hour < 12 ? "Good morning" : hour >= 12 && hour < 16 ? "Good afternoon" : "Good evening"

  useEffect(() => {
    if (!hasGreetingPlayed && userProfile?.name) {
      const fullText = `${greetingText}, ${userProfile.name}`
      let index = 0

      const interval = setInterval(() => {
        setDisplayText(fullText.slice(0, index + 1))
        index++

        if (index >= fullText.length) {
          clearInterval(interval)
          setHasGreetingPlayed(true)
        }
      }, 100)

      return () => clearInterval(interval) // Cleanup interval on unmount
    } else {
      setDisplayText(userProfile?.name ? `${greetingText}, ${userProfile.name}` : greetingText)
    }
  }, [greetingText, userProfile?.name, hasGreetingPlayed])

  return (
    <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-light text-center mb-4 mt-6 px-3">{displayText}</h1>
  )
})

export default Greeting

