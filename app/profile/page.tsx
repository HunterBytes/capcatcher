"use client"

import { useState } from "react"
import { User, Trophy, Target, Zap, Calendar, Award, TrendingUp, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  unlocked: boolean
  progress?: number
  maxProgress?: number
}

interface GameHistory {
  id: number
  score: number
  level: number
  date: string
  duration: string
}

export default function ProfilePage() {
  const [userStats] = useState({
    name: "Player123",
    level: 25,
    currentXP: 1250,
    nextLevelXP: 1500,
    totalScore: 45670,
    gamesPlayed: 156,
    winRate: 68,
    bestScore: 8543,
    totalCaps: 2341,
    averageScore: 293,
    rank: 47,
    joinDate: "March 2024",
  })

  const [achievements] = useState<Achievement[]>([
    { id: 1, name: "First Catch", description: "Catch your first cap", icon: "🎯", unlocked: true },
    { id: 2, name: "Speed Demon", description: "Catch 10 caps in 5 seconds", icon: "⚡", unlocked: true },
    { id: 3, name: "Combo Master", description: "Achieve a 20x combo", icon: "🔥", unlocked: true },
    { id: 4, name: "Century Club", description: "Score 100+ points in a game", icon: "💯", unlocked: true },
    {
      id: 5,
      name: "Perfectionist",
      description: "Complete a level without missing",
      icon: "✨",
      unlocked: false,
      progress: 3,
      maxProgress: 5,
    },
    {
      id: 6,
      name: "Marathon Runner",
      description: "Play for 30 minutes straight",
      icon: "🏃",
      unlocked: false,
      progress: 18,
      maxProgress: 30,
    },
    {
      id: 7,
      name: "Cap Collector",
      description: "Catch 1000 caps total",
      icon: "🎪",
      unlocked: false,
      progress: 756,
      maxProgress: 1000,
    },
    { id: 8, name: "Leaderboard Legend", description: "Reach top 10 global ranking", icon: "👑", unlocked: false },
  ])

  const [gameHistory] = useState<GameHistory[]>([
    { id: 1, score: 1250, level: 8, date: "2 hours ago", duration: "3:45" },
    { id: 2, score: 980, level: 6, date: "5 hours ago", duration: "2:30" },
    { id: 3, score: 1560, level: 10, date: "1 day ago", duration: "4:20" },
    { id: 4, score: 750, level: 5, date: "1 day ago", duration: "2:15" },
    { id: 5, score: 2100, level: 12, date: "2 days ago", duration: "5:10" },
    { id: 6, score: 890, level: 6, date: "3 days ago", duration: "2:45" },
    { id: 7, score: 1340, level: 9, date: "3 days ago", duration: "3:30" },
    { id: 8, score: 670, level: 4, date: "4 days ago", duration: "1:50" },
  ])

  const levelProgress = (userStats.currentXP / userStats.nextLevelXP) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-white">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <User className="w-6 h-6 mr-2" />
            Player Profile
          </h1>
          <Link href="/game">
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-600">Play Game</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback className="text-2xl">{userStats.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">{userStats.name}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    Level {userStats.level}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Rank #{userStats.rank}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    {userStats.winRate}% Win Rate
                  </Badge>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-white text-sm mb-1">
                    <span>Level Progress</span>
                    <span>
                      {userStats.currentXP} / {userStats.nextLevelXP} XP
                    </span>
                  </div>
                  <Progress value={levelProgress} className="h-2" />
                </div>
                <p className="text-white/60">Member since {userStats.joinDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userStats.totalScore.toLocaleString()}</div>
              <div className="text-white/60 text-sm">Total Score</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userStats.bestScore.toLocaleString()}</div>
              <div className="text-white/60 text-sm">Best Score</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userStats.gamesPlayed}</div>
              <div className="text-white/60 text-sm">Games Played</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userStats.totalCaps.toLocaleString()}</div>
              <div className="text-white/60 text-sm">Caps Caught</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
            <TabsTrigger value="achievements" className="data-[state=active]:bg-white/20 text-white">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white/20 text-white">
              Game History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-400" />
                  Achievements ({achievements.filter((a) => a.unlocked).length}/{achievements.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border ${
                        achievement.unlocked ? "bg-green-500/20 border-green-500/30" : "bg-white/5 border-white/10"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${achievement.unlocked ? "text-green-300" : "text-white/60"}`}>
                            {achievement.name}
                          </h4>
                          <p className={`text-sm ${achievement.unlocked ? "text-green-200" : "text-white/40"}`}>
                            {achievement.description}
                          </p>
                          {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-white/60 mb-1">
                                <span>Progress</span>
                                <span>
                                  {achievement.progress}/{achievement.maxProgress}
                                </span>
                              </div>
                              <Progress
                                value={(achievement.progress / achievement.maxProgress) * 100}
                                className="h-1"
                              />
                            </div>
                          )}
                        </div>
                        {achievement.unlocked && (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Unlocked</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Recent Games
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gameHistory.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-white font-bold">{game.score.toLocaleString()}</div>
                          <div className="text-white/60 text-xs">Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-bold">{game.level}</div>
                          <div className="text-white/60 text-xs">Level</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-bold">{game.duration}</div>
                          <div className="text-white/60 text-xs">Duration</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/60 text-sm">{game.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
