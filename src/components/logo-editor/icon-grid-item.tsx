"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface IconGridItemProps {
  icon: LucideIcon
  name: string
  selected: boolean
  onClick: () => void
}

export function IconGridItem({ icon: Icon, name, selected, onClick }: IconGridItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "aspect-square w-full flex items-center justify-center",
        selected && "bg-primary/10 text-primary border-2 border-primary"
      )}
      onClick={onClick}
    >
      <Icon className="h-full w-full" />
    </Button>
  )
}
