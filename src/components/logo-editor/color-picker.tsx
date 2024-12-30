"use client"
import { useState, useCallback, useRef, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { colord, extend } from "colord"
import mixPlugin from "colord/plugins/mix"
import { cn } from "@/lib/utils"

extend([mixPlugin])

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
}

interface Point {
  x: number
  y: number
}

function useColorSpectrum(initialColor: string, onChange: (color: string) => void) {
  const [hue, setHue] = useState(0)
  const [point, setPoint] = useState<Point>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const spectrumRef = useRef<HTMLDivElement>(null)

  const updateColorFromPoint = useCallback((h: number, p: Point): string => {
    const saturation = (p.x / 100) * 100
    const brightness = 100 - (p.y / 100) * 100
    return colord({ h, s: saturation, v: brightness }).toHex()
  }, [])

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging || !spectrumRef.current) return

    const rect = spectrumRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    
    setPoint({ x, y })
    const newColor = updateColorFromPoint(hue, { x, y })
    onChange(newColor)
  }, [isDragging, hue, onChange, updateColorFromPoint])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
      
      return () => {
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerup', handlePointerUp)
      }
    }
  }, [isDragging, handlePointerMove, handlePointerUp])

  const handleSpectrumPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    const rect = spectrumRef.current?.getBoundingClientRect()
    if (!rect) return

    setIsDragging(true)
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    
    setPoint({ x, y })
    const newColor = updateColorFromPoint(hue, { x, y })
    onChange(newColor)
  }, [hue, onChange, updateColorFromPoint])

  const handleHueChange = useCallback((newHue: number) => {
    setHue(newHue)
    const newColor = updateColorFromPoint(newHue, point)
    onChange(newColor)
  }, [point, onChange, updateColorFromPoint])

  // Initialize from prop
  useEffect(() => {
    const color = colord(initialColor)
    const hsv = color.toHsv()
    setHue(hsv.h)
    setPoint({ x: hsv.s, y: 100 - hsv.v })
  }, [initialColor])

  return {
    hue,
    point,
    spectrumRef,
    handleSpectrumPointerDown,
    handleHueChange,
  }
}

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  showOpacity?: boolean
  opacity?: number
  onOpacityChange?: (value: number) => void
}

export function ColorPicker({ 
  value, 
  onChange, 
  showOpacity = false,
  opacity = 1, 
  onOpacityChange 
}: ColorPickerProps) {
  const [colorMode, setColorMode] = useState<"hex" | "rgb">("hex")
  const {
    hue,
    point,
    spectrumRef,
    handleSpectrumPointerDown,
    handleHueChange,
  } = useColorSpectrum(value, onChange)

  const rgb = colord(value).toRgb()

  const handleRgbChange = useCallback((component: "r" | "g" | "b", newValue: string) => {
    const num = parseInt(newValue)
    if (isNaN(num) || num < 0 || num > 255) return
    const newColor = { ...colord(value).toRgb(), [component]: num }
    onChange(colord(newColor).toHex())
  }, [value, onChange])

  return (
    <div className="space-y-4">
      <div 
        className="relative h-40 rounded-lg overflow-hidden select-none touch-none"
        ref={spectrumRef}
        onPointerDown={handleSpectrumPointerDown}
        style={{
          backgroundColor: `hsl(${hue}, 100%, 50%)`,
          backgroundImage: `
            linear-gradient(to right, #fff 0%, transparent 100%),
            linear-gradient(to bottom, transparent 0%, #000 100%)
          `
        }}
      >
        <div
          className="absolute w-4 h-4 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-md pointer-events-none"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
          }}
        />
      </div>

      <div className="h-5 relative rounded-lg overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)`
          }}
        />
        <input
          type="range"
          min="0"
          max="360"
          value={hue}
          onChange={(e) => handleHueChange(Number(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>

      <Tabs value={colorMode} onValueChange={(v) => setColorMode(v as "hex" | "rgb")}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="hex">HEX</TabsTrigger>
          <TabsTrigger value="rgb">RGB</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {colorMode === "hex" ? (
          <Input 
            type="text" 
            value={value.toUpperCase()}
            onChange={(e) => onChange(e.target.value)}
            className="font-mono uppercase"
            placeholder="#000000"
          />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <Label className="text-xs">R</Label>
              <Input 
                type="number"
                min={0}
                max={255}
                value={rgb.r}
                onChange={(e) => handleRgbChange("r", e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">G</Label>
              <Input 
                type="number"
                min={0}
                max={255}
                value={rgb.g}
                onChange={(e) => handleRgbChange("g", e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">B</Label>
              <Input 
                type="number"
                min={0}
                max={255}
                value={rgb.b}
                onChange={(e) => handleRgbChange("b", e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
        )}

        {showOpacity && onOpacityChange && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Opacity</Label>
              <span className="text-xs text-muted-foreground font-mono">
                {Math.round(opacity * 100)}%
              </span>
            </div>
            <Slider
              value={[opacity]}
              onValueChange={([value]) => onOpacityChange(value)}
              min={0}
              max={1}
              step={0.01}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            />
          </div>
        )}
      </div>
    </div>
  )
}
