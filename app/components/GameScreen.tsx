"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Home, Lightbulb, X, RotateCcw, Zap } from "lucide-react"
import confetti from "canvas-confetti"

interface Country {
  name: { common: string }
  capital: string[]
  flags: { png: string }
  region: string
  independent: boolean
}

interface GameSettings {
  playerName: string
  duration: number
  hardMode: boolean
  region: string
}

interface GameScreenProps {
  settings: GameSettings
  onGameEnd: () => void
  musicEnabled: boolean
  onLeaderboardUpdate: () => void
}

export default function GameScreen({ settings, onGameEnd, musicEnabled, onLeaderboardUpdate }: GameScreenProps) {
  const [countries, setCountries] = useState<Country[]>([])
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null)
  const [usedCountries, setUsedCountries] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(settings.duration)
  const [userInput, setUserInput] = useState("")
  const [gameState, setGameState] = useState<"playing" | "ended">("playing")
  const [hintUsed, setHintUsed] = useState(false)
  const [resultMessage, setResultMessage] = useState("")
  const [showResult, setShowResult] = useState(false)

  const gameMusicRef = useRef<HTMLAudioElement | null>(null)
  const gameOverMusicRef = useRef<HTMLAudioElement | null>(null)
  const correctSoundRef = useRef<HTMLAudioElement | null>(null)
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null)

  // Simplified audio initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Game music
      const gameMusic = new Audio("/music/best-game-console-301284.mp3")
      gameMusic.loop = true
      gameMusic.volume = 0.3
      gameMusicRef.current = gameMusic

      // Game over music
      const gameOverMusic = new Audio("/music/game-over-252897.mp3")
      gameOverMusic.volume = 0.4
      gameOverMusicRef.current = gameOverMusic

      // Correct sound
      const correctSound = new Audio(
        "/music/zapsplat_multimedia_game_sound_coin_collect_arcade_retro_simple_bright_001_114144.mp3",
      )
      correctSound.volume = 0.5
      correctSoundRef.current = correctSound

      // Wrong sound
      const wrongSound = new Audio("/music/zapsplat_multimedia_game_sound_negative_buzz_incorrect_wrong_113066.mp3")
      wrongSound.volume = 0.5
      wrongSoundRef.current = wrongSound

      // Start game music
      if (musicEnabled) {
        gameMusic.play().catch(() => {
          // Ignore autoplay errors
        })
      }
    }

    return () => {
      gameMusicRef.current?.pause()
      gameOverMusicRef.current?.pause()
    }
  }, [musicEnabled])

  // Load countries
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,capital,flags,independent,region")
      .then((res) => res.json())
      .then((data: Country[]) => {
        const filteredCountries = data.filter(
          (c) =>
            c.capital &&
            c.capital.length > 0 &&
            c.flags &&
            c.flags.png &&
            c.independent === true &&
            c.region &&
            (settings.region === "all" || c.region.toLowerCase() === settings.region.toLowerCase()),
        )

        // Shuffle countries
        for (let i = filteredCountries.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[filteredCountries[i], filteredCountries[j]] = [filteredCountries[j], filteredCountries[i]]
        }

        setCountries(filteredCountries)
        if (filteredCountries.length > 0) {
          setCurrentCountry(filteredCountries[0])
          setUsedCountries([filteredCountries[0].name.common])
        }
      })
      .catch(console.error)
  }, [settings.region])

  // Game timer
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft <= 0 && gameState === "playing") {
      endGame()
    }
  }, [timeLeft, gameState])

  const removeAccents = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[\u0300-\u036f]/g, "")
  }

  const playSound = (audioRef: React.RefObject<HTMLAudioElement>) => {
    if (musicEnabled && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {
        // Ignore play errors
      })
    }
  }

  const checkAnswer = useCallback(() => {
    if (!currentCountry || gameState !== "playing") return

    const userAnswer = removeAccents(userInput.trim().toLowerCase())
    const correctAnswers = currentCountry.capital.map((c) => removeAccents(c.toLowerCase()))

    if (correctAnswers.includes(userAnswer)) {
      setStreak((prev) => prev + 1)
      setScore((prev) => {
        const newScore = prev + 1 + (streak > 0 && (streak + 1) % 5 === 0 ? 2 : 0)
        return newScore
      })
      setResultMessage("🎉 Correct! Amazing!")
      playSound(correctSoundRef)
    } else {
      setStreak(0)
      setResultMessage(`❌ Oops! The answer is ${currentCountry.capital[0]}`)
      playSound(wrongSoundRef)
    }

    setShowResult(true)
    setTimeout(() => {
      setShowResult(false)
      newRound()
    }, 2000)
  }, [currentCountry, userInput, streak, musicEnabled, gameState])

  const newRound = useCallback(() => {
    if (usedCountries.length >= countries.length) {
      endGame()
      return
    }

    const remaining = countries.filter((c) => !usedCountries.includes(c.name.common))
    if (remaining.length === 0) {
      endGame()
      return
    }

    const nextCountry = remaining[Math.floor(Math.random() * remaining.length)]
    setCurrentCountry(nextCountry)
    setUsedCountries((prev) => [...prev, nextCountry.name.common])
    setUserInput("")
    setHintUsed(false)
    setResultMessage("")
  }, [countries, usedCountries])

  const useHint = () => {
    if (hintUsed || !currentCountry) return
    setHintUsed(true)
    const firstLetter = currentCountry.capital[0][0].toUpperCase()
    setResultMessage(`💡 Hint: Capital starts with "${firstLetter}"`)
    setShowResult(true)
    setTimeout(() => setShowResult(false), 3000)
  }

  const endGame = async () => {
    setGameState("ended")
    gameMusicRef.current?.pause()

    if (musicEnabled && gameOverMusicRef.current) {
      gameOverMusicRef.current.play().catch(() => {
        // Ignore play errors
      })
    }

    // Enhanced confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"],
    })

    // Save score
    if (score > 0) {
      try {
        await fetch("/api/leaderboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: settings.playerName,
            score,
            duration: settings.duration,
          }),
        })
        onLeaderboardUpdate()
      } catch (error) {
        console.error("Failed to save score:", error)
      }
    }
  }

  const quitGame = () => {
    gameMusicRef.current?.pause()
    onGameEnd()
  }

  const playAgain = () => {
    window.location.reload()
  }

  if (gameState === "ended") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Adventure Complete!
            </h2>
            <div className="space-y-3 mb-6">
              <p className="text-2xl">
                Final Score: <span className="font-bold text-blue-600 dark:text-blue-400">{score}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Explorer: <span className="font-semibold">{settings.playerName}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Duration: <span className="font-semibold">{settings.duration}s</span>
              </p>
              {streak > 0 && (
                <p className="text-orange-600 dark:text-orange-400">
                  Best Streak: <span className="font-semibold">{streak} 🔥</span>
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={playAgain}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Play Again
              </Button>
              <Button
                onClick={quitGame}
                variant="outline"
                className="flex-1 py-3 rounded-xl hover:scale-105 transition-all duration-200"
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4 transition-all duration-500">
      <div className="container mx-auto max-w-4xl">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={quitGame}
            variant="outline"
            size="lg"
            className="hover:scale-105 transition-transform duration-200"
          >
            <X className="w-5 h-5 mr-2" />
            Quit
          </Button>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-xl px-4 py-2 animate-pulse">
              ⏱ {timeLeft}s
            </Badge>
            <Badge variant="secondary" className="text-xl px-4 py-2">
              🏆 {score}
            </Badge>
            {streak > 0 && (
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse text-lg px-4 py-2">
                🔥 {streak} streak
              </Badge>
            )}
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-6">
          <Progress value={(timeLeft / settings.duration) * 100} className="h-3 rounded-full" />
        </div>

        {/* Enhanced Game Content */}
        <div className="text-center">
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl mb-6 hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-8">
              {!settings.hardMode && currentCountry && (
                <h2 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white animate-fade-in">
                  {currentCountry.name.common}
                </h2>
              )}

              {currentCountry && (
                <div className="mb-6">
                  <img
                    src={currentCountry.flags.png || "/placeholder.svg"}
                    alt={`${currentCountry.name.common} flag`}
                    className="w-96 h-auto mx-auto rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="space-y-6">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                  placeholder="Type the capital city and press Enter..."
                  className="text-xl text-center p-4 rounded-xl border-2 focus:border-blue-500 transition-colors"
                  disabled={showResult}
                />

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={checkAnswer}
                    disabled={showResult || !userInput.trim()}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Submit Answer
                  </Button>
                  <Button
                    onClick={useHint}
                    variant="outline"
                    disabled={hintUsed || showResult}
                    size="lg"
                    className="px-8 py-3 rounded-xl hover:scale-105 transition-all duration-200"
                  >
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Hint
                  </Button>
                </div>
              </div>

              {showResult && (
                <div className="mt-6 animate-fade-in">
                  <div
                    className={`text-xl font-semibold p-4 rounded-xl shadow-lg ${
                      resultMessage.includes("🎉")
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : resultMessage.includes("❌")
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }`}
                  >
                    {resultMessage}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Game Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 hover:scale-105 transition-all duration-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{score}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 hover:scale-105 transition-all duration-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{streak}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Streak</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 hover:scale-105 transition-all duration-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{usedCountries.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 hover:scale-105 transition-all duration-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round((score / Math.max(usedCountries.length, 1)) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
