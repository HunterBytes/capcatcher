"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Home, Pause, Play, RotateCcw } from "lucide-react"
import Link from "next/link"

interface Cap {
  id: number
  x: number
  y: number
  speed: number
  color: string
  points: number
}

export default function GamePage() {
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [caps, setCaps] = useState<Cap[]>([])
  const [gameState, setGameState] = useState<"menu" | "playing" | "paused" | "gameOver">("menu")
  const [timeLeft, setTimeLeft] = useState(60)
  const [combo, setCombo] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  const capColors = [
    { color: "bg-red-500", points: 10 },
    { color: "bg-blue-500", points: 15 },
    { color: "bg-green-500", points: 20 },
    { color: "bg-yellow-500", points: 25 },
    { color: "bg-purple-500", points: 30 },
  ]

  const spawnCap = useCallback(() => {
    if (gameState !== "playing") return

    const gameArea = gameAreaRef.current
    if (!gameArea) return

    const capType = capColors[Math.floor(Math.random() * capColors.length)]
    const newCap: Cap = {
      id: Date.now() + Math.random(),
      x: Math.random() * (gameArea.clientWidth - 40),
      y: -40,
      speed: 2 + level * 0.5 + Math.random() * 2,
      color: capType.color,
      points: capType.points,
    }

    setCaps((prev) => [...prev, newCap])
  }, [gameState, level])

  const updateGame = useCallback(() => {
    if (gameState !== "playing") return

    setCaps((prev) =>
      prev
        .map((cap) => ({
          ...cap,
          y: cap.y + cap.speed,
        }))
        .filter((cap) => {
          if (cap.y > window.innerHeight) {
            setLives((lives) => Math.max(0, lives - 1))
            setCombo(0)
            return false
          }
          return true
        }),
    )

    // Spawn new caps
    if (Math.random() < 0.02 + level * 0.005) {
      spawnCap()
    }

    animationRef.current = requestAnimationFrame(updateGame)
  }, [gameState, level, spawnCap])

  const catchCap = (capId: number) => {
    setCaps((prev) => {
      const cap = prev.find((c) => c.id === capId)
      if (cap) {
        const points = cap.points + combo * 5
        setScore((s) => s + points)
        setCombo((c) => c + 1)
      }
      return prev.filter((c) => c.id !== capId)
    })
  }

  const startGame = () => {
    setScore(0)
    setLevel(1)
    setLives(3)
    setCaps([])
    setTimeLeft(60)
    setCombo(0)
    setGameState("playing")
  }

  const pauseGame = () => {
    setGameState(gameState === "paused" ? "playing" : "paused")
  }

  const resetGame = () => {
    setGameState("menu")
    setCaps([])
  }

  useEffect(() => {
    if (gameState === "playing") {
      animationRef.current = requestAnimationFrame(updateGame)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState, updateGame])

  useEffect(() => {
    if (lives <= 0 || timeLeft <= 0) {
      setGameState("gameOver")
      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem("capCatcherHighScore", score.toString())
      }
    }
  }, [lives, timeLeft, score, highScore])

  useEffect(() => {
    const saved = localStorage.getItem("capCatcherHighScore")
    if (saved) {
      setHighScore(Number.parseInt(saved))
    }
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((t) => t - 1)
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [gameState, timeLeft])

  useEffect(() => {
    if (score > 0 && score % 500 === 0) {
      setLevel((l) => l + 1)
    }
  }, [score])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-white">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <div className="flex items-center space-x-6">
            <div className="text-white">
              Score: <span className="font-bold">{score.toLocaleString()}</span>
            </div>
            <div className="text-white">
              Level: <span className="font-bold">{level}</span>
            </div>
            <div className="text-white">
              Lives: <span className="font-bold">{"❤️".repeat(lives)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Game Area */}
      <div className="relative h-[calc(100vh-80px)] overflow-hidden" ref={gameAreaRef}>
        {/* Game UI */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <Badge className="bg-white/20 text-white">Time: {timeLeft}s</Badge>
              {combo > 0 && <Badge className="bg-yellow-500/20 text-yellow-300 animate-pulse">Combo x{combo}</Badge>}
            </div>
            <div className="flex space-x-2">
              {gameState === "playing" && (
                <Button onClick={pauseGame} variant="outline" size="sm" className="border-white/20 text-white">
                  <Pause className="w-4 h-4" />
                </Button>
              )}
              <Button onClick={resetGame} variant="outline" size="sm" className="border-white/20 text-white">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Progress value={(timeLeft / 60) * 100} className="mt-2" />
        </div>

        {/* Caps */}
        {caps.map((cap) => (
          <div
            key={cap.id}
            className={`absolute w-10 h-10 rounded-full cursor-pointer transform hover:scale-110 transition-transform ${cap.color} shadow-lg`}
            style={{ left: cap.x, top: cap.y }}
            onClick={() => catchCap(cap.id)}
          />
        ))}

        {/* Game States */}
        {gameState === "menu" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-white text-3xl">CapCatcher</CardTitle>
                <p className="text-white/60">Click the falling caps to catch them!</p>
                {highScore > 0 && <p className="text-yellow-400">High Score: {highScore.toLocaleString()}</p>}
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-600">
                  <Play className="w-5 h-5 mr-2" />
                  Start Game
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {gameState === "paused" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-white text-2xl">Game Paused</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={pauseGame} size="lg" className="bg-gradient-to-r from-green-500 to-blue-600">
                  <Play className="w-5 h-5 mr-2" />
                  Resume
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {gameState === "gameOver" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-white text-3xl">Game Over!</CardTitle>
                <div className="space-y-2 mt-4">
                  <p className="text-white">
                    Final Score: <span className="font-bold text-yellow-400">{score.toLocaleString()}</span>
                  </p>
                  <p className="text-white">
                    Level Reached: <span className="font-bold">{level}</span>
                  </p>
                  {score === highScore && score > 0 && (
                    <p className="text-yellow-400 font-bold">🎉 New High Score! 🎉</p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-600 w-full">
                  Play Again
                </Button>
                <Link href="/leaderboard">
                  <Button variant="outline" size="lg" className="border-white/20 text-white w-full">
                    View Leaderboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
