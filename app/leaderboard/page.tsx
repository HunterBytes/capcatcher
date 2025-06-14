"use client"

import { useState, useEffect } from "react"
import { Trophy, Medal, Award, Crown, Home, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface Player {
  id: number
  name: string
  score: number
  level: number
  avatar: string
  country: string
  gamesPlayed: number
  winRate: number
  lastPlayed: string
  rank: number
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [timeFilter, setTimeFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockPlayers: Player[] = [
      {
        id: 1,
        name: "CapMaster",
        score: 15420,
        level: 42,
        avatar: "/placeholder.svg?height=40&width=40",
        country: "🇺🇸",
        gamesPlayed: 234,
        winRate: 87,
        lastPlayed: "2 hours ago",
        rank: 1,
      },
      {
        id: 2,
        name: "QuickCatch",
        score: 14890,
        level: 38,
        avatar: "/placeholder.svg?height=40&width=40",
        country: "🇯🇵",
        gamesPlayed: 189,
        winRate: 82,
        lastPlayed: "1 hour ago",
        rank: 2,
      },
      {
        id: 3,
        name: "SpeedDemon",
        score: 13750,
        level: 35,
        avatar: "/placeholder.svg?height=40&width=40",
        country: "🇬🇧",
        gamesPlayed: 156,
        winRate: 79,
        lastPlayed: "30 minutes ago",
        rank: 3,
      },
      {
        id: 4,
        name: "CapHunter",
        score: 12980,
        level: 33,
        avatar: "/placeholder.svg?height=40&width=40",
        country: "🇩🇪",
        gamesPlayed: 201,
        winRate: 75,
        lastPlayed: "4 hours ago",
        rank: 4,
      },
      {
        id: 5,
        name: "Lightning",
        score: 11560,
        level: 29,
        avatar: "/placeholder.svg?height=40&width=40",
        country: "🇫🇷",
        gamesPlayed: 143,
        winRate: 73,
        lastPlayed: "1 day ago",
        rank: 5,
      },
      {
        id: 6,
        name: "NinjaCatcher",
        score: 10890,
        level: 27,
        avatar: "/placeholder.svg?height=40&width=40",
        country: "🇰🇷",
        gamesPlayed: 167,
        winRate: 71,
        lastPlayed: "3 hours ago",
        rank: 6,
      },
      {
        id: 7,
        name: "CapWizard",
        score: 10234,
        level: 25,
        avatar: "/placeholder.svg?height=40&width=40",
        country: "🇨🇦",
        gamesPlayed: 134,
        winRate: 68,
        lastPlayed: "5 hours ago",
        rank: 7,
      },
      {
        id: 8,
        name: "FlashHands",
        score: 9876,
        level: 24,
        avatar: "/placeholder.svg?height=40&width=40",
        country: "🇦🇺",
        gamesPlayed: 178,
        winRate: 66,
        lastPlayed: "2 days ago",
        rank: 8,
      },
      {
        id: 9,
        name: "CapLegend",
        score: 9543,
        level: 23,
        avatar: "/placeholder.svg?height=40&width=40",
        country: "🇧🇷",
        gamesPlayed: 145,
        winRate: 64,
        lastPlayed: "6 hours ago",
        rank: 9,
      },
      {
        id: 10,
        name: "SwiftCatch",
        score: 9210,
        level: 22,
        avatar: "/placeholder.svg?height=40&width=40",
        country: "🇮🇳",
        gamesPlayed: 156,
        winRate: 62,
        lastPlayed: "1 day ago",
        rank: 10,
      },
      {
        id: 11,
        name: "CapChampion",
        score: 8987,
        level: 21,
        avatar: "/placeholder.svg?height=40&width=40",
        country: "🇲🇽",
        gamesPlayed: 123,
        winRate: 60,
        lastPlayed: "8 hours ago",
        rank: 11,
      },
      {
        id: 12,
        name: "RapidFire",
        score: 8654,
        level: 20,
        avatar: "/placeholder.svg?height=40&width=40",
        country: "🇮🇹",
        gamesPlayed: 167,
        winRate: 58,
        lastPlayed: "12 hours ago",
        rank: 12,
      },
      {
        id: 13,
        name: "CapExpert",
        score: 8321,
        level: 19,
        avatar: "/placeholder.svg?height=40&width=40",
        country: "🇪🇸",
        gamesPlayed: 134,
        winRate: 56,
        lastPlayed: "1 day ago",
        rank: 13,
      },
      {
        id: 14,
        name: "QuickDraw",
        score: 7998,
        level: 18,
        avatar: "/placeholder.svg?height=40&width=40",
        country: "🇳🇱",
        gamesPlayed: 145,
        winRate: 54,
        lastPlayed: "2 days ago",
        rank: 14,
      },
      {
        id: 15,
        name: "CapPro",
        score: 7665,
        level: 17,
        avatar: "/placeholder.svg?height=40&width=40",
        country: "🇸🇪",
        gamesPlayed: 112,
        winRate: 52,
        lastPlayed: "3 days ago",
        rank: 15,
      },
    ]

    setTimeout(() => {
      setPlayers(mockPlayers)
      setFilteredPlayers(mockPlayers)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    const filtered = players.filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()))

    setFilteredPlayers(filtered)
  }, [searchTerm, players, timeFilter])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-white font-bold">#{rank}</div>
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank <= 3) return "bg-gradient-to-r from-yellow-400 to-orange-500"
    if (rank <= 10) return "bg-gradient-to-r from-purple-500 to-pink-500"
    return "bg-gradient-to-r from-blue-500 to-cyan-500"
  }

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
            <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
            Global Leaderboard
          </h1>
          <Link href="/game">
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-600">Play Now</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <Input
                      placeholder="Search players..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                </div>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {filteredPlayers.slice(0, 3).map((player, index) => (
              <Card
                key={player.id}
                className={`bg-white/10 border-white/20 backdrop-blur-sm ${index === 0 ? "md:order-2 transform md:scale-110" : index === 1 ? "md:order-1" : "md:order-3"}`}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4">{getRankIcon(player.rank)}</div>
                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    <AvatarImage src={player.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{player.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-white font-bold text-lg mb-2">{player.name}</h3>
                  <div className="text-2xl font-bold text-yellow-400 mb-2">{player.score.toLocaleString()}</div>
                  <Badge className={`${getRankBadge(player.rank)} text-white`}>Level {player.level}</Badge>
                  <div className="mt-2 text-white/60 text-sm">
                    {player.country} • {player.winRate}% win rate
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Full Leaderboard */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Complete Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4 p-4">
                      <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                      <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-white/20 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-white/20 rounded w-1/6"></div>
                      </div>
                      <div className="h-4 bg-white/20 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8">
                        {player.rank <= 3 ? (
                          getRankIcon(player.rank)
                        ) : (
                          <span className="text-white font-bold">#{player.rank}</span>
                        )}
                      </div>
                      <Avatar>
                        <AvatarImage src={player.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{player.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-semibold">{player.name}</span>
                          <span className="text-lg">{player.country}</span>
                        </div>
                        <div className="text-white/60 text-sm">
                          Level {player.level} • {player.gamesPlayed} games • {player.winRate}% win rate
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-lg">{player.score.toLocaleString()}</div>
                      <div className="text-white/60 text-sm">{player.lastPlayed}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">{filteredPlayers.length}</div>
              <div className="text-white/60">Total Players</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {filteredPlayers.length > 0 ? Math.max(...filteredPlayers.map((p) => p.score)).toLocaleString() : 0}
              </div>
              <div className="text-white/60">Highest Score</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {filteredPlayers.length > 0
                  ? Math.round(filteredPlayers.reduce((acc, p) => acc + p.level, 0) / filteredPlayers.length)
                  : 0}
              </div>
              <div className="text-white/60">Average Level</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
