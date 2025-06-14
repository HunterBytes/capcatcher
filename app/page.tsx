"use client"

import { useState, useEffect } from "react"
import { Play, Trophy, Settings, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import GameScreen from "./components/GameScreen"

interface LeaderboardEntry {
  name: string
  score: number
  duration: number
  timestamp: number
}

interface GameSettings {
  playerName: string
  duration: number
  hardMode: boolean
  region: string
}

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<"about" | "welcome" | "game">("about")
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    playerName: "",
    duration: 180,
    hardMode: false,
    region: "all",
  })
  const [leaderboards, setLeaderboards] = useState<{ [key: number]: LeaderboardEntry[] }>({})
  const [introMusic, setIntroMusic] = useState<HTMLAudioElement | null>(null)
  const [audioInitialized, setAudioInitialized] = useState(false)

  const flags = [
    "https://flagcdn.com/w40/us.png",
    "https://flagcdn.com/w40/jp.png",
    "https://flagcdn.com/w40/gb.png",
    "https://flagcdn.com/w40/de.png",
    "https://flagcdn.com/w40/br.png",
    "https://flagcdn.com/w40/kr.png",
    "https://flagcdn.com/w40/in.png",
    "https://flagcdn.com/w40/fr.png",
    "https://flagcdn.com/w40/it.png",
    "https://flagcdn.com/w40/ca.png",
    "https://flagcdn.com/w40/au.png",
  ]

  useEffect(() => {
    loadLeaderboards()
  }, [])

  const initializeAudio = () => {
    if (typeof window !== "undefined" && !audioInitialized) {
      try {
        const audio = new Audio()
        audio.src = "/music/retro-game-music-245230.mp3"
        audio.loop = true
        audio.volume = 0.3
        audio.preload = "auto"

        setIntroMusic(audio)
        setAudioInitialized(true)
        return audio
      } catch (error) {
        console.warn("Audio initialization failed:", error)
        return null
      }
    }
    return introMusic
  }

  const playMusic = async () => {
    const audio = introMusic || initializeAudio()
    if (audio) {
      try {
        audio.currentTime = 0
        await audio.play()
      } catch (error) {
        console.warn("Music play failed:", error)
      }
    }
  }

  const stopMusic = () => {
    if (introMusic) {
      introMusic.pause()
      introMusic.currentTime = 0
    }
  }

  const loadLeaderboards = async () => {
    const durations = [60, 180]
    const newLeaderboards: { [key: number]: LeaderboardEntry[] } = {}

    for (const duration of durations) {
      try {
        const response = await fetch(`/api/leaderboard?duration=${duration}`)
        if (response.ok) {
          const data = await response.json()
          newLeaderboards[duration] = data.slice(0, 5)
        }
      } catch (error) {
        console.error(`Failed to load ${duration}s leaderboard:`, error)
        newLeaderboards[duration] = []
      }
    }

    setLeaderboards(newLeaderboards)
  }

  const startGame = () => {
    if (!gameSettings.playerName.trim()) {
      alert("Please enter your name!")
      return
    }
    stopMusic()
    setCurrentScreen("game")
  }

  const showWelcome = () => {
    setCurrentScreen("welcome")
    if (!audioInitialized) {
      initializeAudio()
    }
    setTimeout(playMusic, 200)
  }

  const backToWelcome = () => {
    setCurrentScreen("welcome")
    loadLeaderboards()
    setTimeout(playMusic, 200)
  }

  if (currentScreen === "game") {
    return (
      <GameScreen
        settings={gameSettings}
        onGameEnd={backToWelcome}
        musicEnabled={true}
        onLeaderboardUpdate={loadLeaderboards}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-500">
      {/* About Screen */}
      {currentScreen === "about" && (
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-0 shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse-slow">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <div className="text-7xl mb-6 animate-bounce-slow">🌍</div>
                <h1 className="text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-6 animate-glow">
                  CapCatcher
                </h1>
                <div className="space-y-4 mb-8">
                  <p className="text-2xl text-gray-700 dark:text-gray-200 font-bold flex items-center justify-center gap-3">
                    <Sparkles className="w-6 h-6 text-yellow-400 animate-spin-slow" />
                    Test your geography skills in this fast-paced capital cities game!
                    <Sparkles className="w-6 h-6 text-yellow-400 animate-spin-slow" />
                  </p>
                  <p className="text-lg text-gray-500 dark:text-gray-400 italic">
                    Created by <strong className="text-purple-600 dark:text-purple-400">Hunter J</strong>
                  </p>
                </div>
              </div>

              {/* Super Enhanced Flag Belt */}
              <div className="overflow-hidden mb-8 rounded-2xl bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 dark:from-pink-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 p-6 shadow-inner border-4 border-white/50 dark:border-gray-700/50">
                <div className="flex animate-scroll-fast space-x-8">
                  {[...flags, ...flags, ...flags].map((flag, index) => (
                    <img
                      key={index}
                      src={flag || "/placeholder.svg"}
                      alt="Flag"
                      className="w-14 h-10 rounded-lg shadow-xl flex-shrink-0 hover:scale-125 transition-transform duration-300 border-2 border-white/80 animate-float"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={showWelcome}
                size="lg"
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white px-12 py-6 text-2xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-pulse-glow"
              >
                <Play className="w-8 h-8 mr-4" />
                LET'S GO! 🚀
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Welcome Screen */}
      {currentScreen === "welcome" && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Super Enhanced Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="text-5xl mr-4 animate-spin-bounce">🎯</div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-glow">
                  CapCatcher
                </h1>
                <div className="text-5xl ml-4 animate-spin-bounce" style={{ animationDelay: "0.5s" }}>
                  🏆
                </div>
              </div>
              <p className="text-2xl text-gray-700 dark:text-gray-200 font-bold animate-bounce-text">
                Ready to dominate the world? 🌎💪
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Super Enhanced Game Settings */}
              <div className="lg:col-span-2">
                <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 animate-float">
                  <CardHeader className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 rounded-t-lg">
                    <CardTitle className="flex items-center text-2xl font-bold">
                      <Settings className="w-7 h-7 mr-3 text-purple-600 animate-spin-slow" />
                      Game Setup 🎮
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8 p-8">
                    {/* Player Name */}
                    <div className="space-y-3">
                      <Label htmlFor="player-name" className="text-xl font-bold text-purple-700 dark:text-purple-300">
                        🏃‍♂️ Your Champion Name
                      </Label>
                      <Input
                        id="player-name"
                        placeholder="Enter your legendary name..."
                        value={gameSettings.playerName}
                        onChange={(e) => setGameSettings((prev) => ({ ...prev, playerName: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && startGame()}
                        className="text-xl p-4 rounded-xl border-3 border-purple-300 focus:border-purple-500 transition-all duration-300 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600"
                      />
                    </div>

                    {/* Time Duration */}
                    <div className="space-y-4">
                      <Label className="text-xl font-bold text-purple-700 dark:text-purple-300">
                        ⚡ Challenge Mode
                      </Label>
                      <div className="flex justify-center">
                        <RadioGroup
                          value={gameSettings.duration.toString()}
                          onValueChange={(value) =>
                            setGameSettings((prev) => ({ ...prev, duration: Number.parseInt(value) }))
                          }
                          className="flex space-x-8"
                        >
                          <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 hover:scale-105 transition-transform">
                            <RadioGroupItem value="60" id="60s" className="w-6 h-6" />
                            <Label htmlFor="60s" className="cursor-pointer text-xl font-bold">
                              ⚡ 60s BLITZ!
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 hover:scale-105 transition-transform">
                            <RadioGroupItem value="180" id="180s" className="w-6 h-6" />
                            <Label htmlFor="180s" className="cursor-pointer text-xl font-bold">
                              🏃 3min MARATHON!
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {/* Region Selection */}
                    <div className="space-y-3">
                      <Label htmlFor="region" className="text-xl font-bold text-purple-700 dark:text-purple-300">
                        🗺️ Choose Your Battlefield
                      </Label>
                      <Select
                        value={gameSettings.region}
                        onValueChange={(value) => setGameSettings((prev) => ({ ...prev, region: value }))}
                      >
                        <SelectTrigger className="text-xl p-4 rounded-xl border-3 border-purple-300 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">🌐 WORLD DOMINATION</SelectItem>
                          <SelectItem value="Europe">🇪🇺 European Conquest</SelectItem>
                          <SelectItem value="Asia">🌏 Asian Adventure</SelectItem>
                          <SelectItem value="Africa">🌍 African Safari</SelectItem>
                          <SelectItem value="Americas">🌎 American Journey</SelectItem>
                          <SelectItem value="Oceania">🌊 Pacific Paradise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Hard Mode */}
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-xl border-3 border-orange-300 hover:scale-105 transition-transform">
                      <div className="space-y-2">
                        <Label
                          htmlFor="hard-mode"
                          className="text-xl font-bold text-red-700 dark:text-red-300 flex items-center gap-2"
                        >
                          🔥 BEAST MODE 🔥
                        </Label>
                        <p className="text-lg text-red-600 dark:text-red-400 font-semibold">
                          Flags only - no hints, no mercy!
                        </p>
                      </div>
                      <Switch
                        id="hard-mode"
                        checked={gameSettings.hardMode}
                        onCheckedChange={(checked) => setGameSettings((prev) => ({ ...prev, hardMode: checked }))}
                        className="scale-150"
                      />
                    </div>

                    {/* Launch Button - Centered */}
                    <div className="pt-8 border-t-4 border-purple-200 dark:border-purple-700">
                      <div className="flex justify-center">
                        <Button
                          onClick={startGame}
                          size="lg"
                          className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white px-12 py-4 text-2xl font-black rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-pulse-glow"
                        >
                          <Play className="w-8 h-8 mr-3" />
                          LAUNCH! 🚀
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Super Enhanced Leaderboards */}
              <div className="space-y-6">
                {[60, 180].map((duration) => (
                  <Card
                    key={duration}
                    className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 animate-float"
                    style={{ animationDelay: `${duration === 60 ? "0" : "0.5"}s` }}
                  >
                    <CardHeader className="bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 rounded-t-lg">
                      <CardTitle className="flex items-center text-xl font-bold">
                        <Trophy className="w-7 h-7 mr-3 text-yellow-500 animate-bounce" />🏆 {duration}s LEGENDS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {leaderboards[duration]?.length > 0 ? (
                        <div className="space-y-3">
                          {leaderboards[duration].map((entry, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:from-yellow-50 hover:to-orange-50 dark:hover:from-yellow-900/20 dark:hover:to-orange-900/20 transition-all duration-300 hover:scale-105 transform"
                            >
                              <div className="flex items-center space-x-4">
                                <Badge
                                  variant={index === 0 ? "default" : "secondary"}
                                  className={`text-lg font-black px-3 py-1 ${
                                    index === 0
                                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white animate-pulse shadow-lg"
                                      : index === 1
                                        ? "bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-md"
                                        : index === 2
                                          ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md"
                                          : "bg-gradient-to-r from-blue-400 to-purple-400 text-white"
                                  }`}
                                >
                                  {index === 0
                                    ? "👑 KING"
                                    : index === 1
                                      ? "🥈 HERO"
                                      : index === 2
                                        ? "🥉 STAR"
                                        : `#${index + 1}`}
                                </Badge>
                                <span className="font-bold truncate text-lg">{entry.name}</span>
                              </div>
                              <span className="font-black text-purple-600 dark:text-purple-400 text-2xl">
                                {entry.score}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-5xl mb-3 animate-bounce">🏆</div>
                          <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">BE THE FIRST LEGEND!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scroll-fast {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-bounce {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.1); }
          50% { transform: rotate(180deg) scale(1); }
          75% { transform: rotate(270deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px rgba(168, 85, 247, 0.5); }
          50% { text-shadow: 0 0 30px rgba(168, 85, 247, 0.8), 0 0 40px rgba(236, 72, 153, 0.5); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(236, 72, 153, 0.3); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce-text {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-scroll-fast { animation: scroll-fast 15s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-spin-bounce { animation: spin-bounce 4s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-bounce-text { animation: bounce-text 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  )
}
