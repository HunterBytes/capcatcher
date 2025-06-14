import { type NextRequest, NextResponse } from "next/server"

interface LeaderboardEntry {
  name: string
  score: number
  duration: number
  timestamp: number
}

// Clean seed data with no problematic usernames
let scores: LeaderboardEntry[] = [
  { name: "Hunter", score: 25, duration: 180, timestamp: Date.now() - 86400000 },
  { name: "GeoMaster", score: 22, duration: 180, timestamp: Date.now() - 172800000 },
  { name: "CapitalKing", score: 20, duration: 180, timestamp: Date.now() - 259200000 },
  { name: "QuickThink", score: 15, duration: 60, timestamp: Date.now() - 86400000 },
  { name: "SpeedyGeo", score: 12, duration: 60, timestamp: Date.now() - 172800000 },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const duration = searchParams.get("duration")

    if (duration) {
      const durationNum = Number.parseInt(duration)
      const filteredScores = scores
        .filter((score) => score.duration === durationNum)
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score
          return b.timestamp - a.timestamp
        })
        .slice(0, 10)

      return NextResponse.json(filteredScores)
    }

    const allScores = scores
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return b.timestamp - a.timestamp
      })
      .slice(0, 20)

    return NextResponse.json(allScores)
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ message: "Failed to fetch leaderboard" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let { name, score, duration } = body

    // Validation
    if (!name || typeof score !== "number" || typeof duration !== "number") {
      return NextResponse.json({ message: "Invalid request data" }, { status: 400 })
    }

    if (score < 0 || score > 1000) {
      return NextResponse.json({ message: "Invalid score range" }, { status: 400 })
    }

    if (![60, 180].includes(duration)) {
      return NextResponse.json({ message: "Invalid duration" }, { status: 400 })
    }

    // Clean the name - remove any unwanted characters/patterns
    name = name
      .trim()
      .replace(/samtrump\d*-?\d*/gi, "Hunter") // Replace any samtrump variations with Hunter
      .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
      .substring(0, 15) // Limit length

    // If name becomes empty after cleaning, use default
    if (!name) {
      name = "Anonymous"
    }

    const newEntry: LeaderboardEntry = {
      name,
      score,
      duration,
      timestamp: Date.now(),
    }

    scores.push(newEntry)

    // Keep only top 200 scores
    scores = scores
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return b.timestamp - a.timestamp
      })
      .slice(0, 200)

    console.log(`New score saved: ${newEntry.name} - ${newEntry.score} points (${newEntry.duration}s)`)

    return NextResponse.json(
      {
        message: "Score saved successfully",
        entry: newEntry,
        rank: scores.filter((s) => s.duration === duration).findIndex((s) => s.timestamp === newEntry.timestamp) + 1,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error saving score:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
