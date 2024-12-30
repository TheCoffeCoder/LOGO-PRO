"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wand2 } from "lucide-react"
import { IconGridItem } from "./icon-grid-item"
import { ICONS } from "./icon-selector"

interface AiIconModalProps {
  onSelectIcon?: (iconName: string) => void
}

export function AiIconModal({ onSelectIcon }: AiIconModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/icon-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) throw new Error("Failed to get suggestions")

      const data = await response.json()
      setSuggestions(data.icons)
    } catch (err) {
      setError("Failed to get icon suggestions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectIcon = (iconName: string) => {
    onSelectIcon?.(iconName)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Wand2 className="h-4 w-4" />
          Ask AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Icon Suggestions</DialogTitle>
          <DialogDescription>
            Describe the icon you're looking for and AI will suggest matching icons.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="prompt">Describe your icon</Label>
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., a shopping cart icon"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((iconName) => {
                  const Icon = ICONS[iconName as keyof typeof ICONS]
                  if (!Icon) return null
                  return (
                    <IconGridItem
                      key={iconName}
                      icon={Icon}
                      name={iconName}
                      selected={false}
                      onClick={() => handleSelectIcon(iconName)}
                    />
                  )
                })}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Thinking..." : "Get Suggestions"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
