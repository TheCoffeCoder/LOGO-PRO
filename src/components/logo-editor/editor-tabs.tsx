"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useIcon } from "./icon-context"
import { useBackground } from "./background-context"
import { SHADOW_PRESETS } from "./background-context"
import { ColorPicker } from "./color-picker"
import { 
  ArrowLeftRight, 
  Paintbrush, 
  Ruler, 
  Sliders,
  Layers,
  Square,
  Box,
  Droplet,
  Palette,
  Circle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

// Border radius presets in pixels
const BORDER_RADIUS_PRESETS = {
  "Square": 0,
  "Small": 8,
  "Medium": 16,
  "Large": 32,
  "XLarge": 64,
  "Circle": 300
} as const

function ControlGroup({ 
  label, 
  icon: Icon, 
  children,
  className 
}: { 
  label: string
  icon: React.ElementType
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={cn("p-4 space-y-3", className)}>
      <div className="flex items-center gap-2 text-sm font-medium">
        <Icon size={16} className="text-muted-foreground" />
        <span>{label}</span>
      </div>
      {children}
    </Card>
  )
}

function SliderControl({ 
  value, 
  onChange, 
  min, 
  max, 
  step,
  formatValue
}: { 
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  formatValue?: (value: number) => string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <Slider 
        value={[value]} 
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
      />
    </div>
  )
}

export function EditorTabs() {
  const { properties: iconProps, setProperties: setIconProps, selectedIcon } = useIcon()
  const { properties: bgProps, setProperties: setBgProps } = useBackground()

  return (
    <Tabs defaultValue="icon" className="w-full">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="icon" className="flex items-center gap-2">
          <Layers size={16} />
          <span>Icon</span>
        </TabsTrigger>
        <TabsTrigger value="background" className="flex items-center gap-2">
          <Square size={16} />
          <span>Background</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="icon" className="space-y-4 py-4">
        <ControlGroup label="Dimensions" icon={Ruler}>
          <SliderControl
            value={iconProps.size}
            onChange={(size) => setIconProps({ size })}
            min={32}
            max={256}
            step={8}
            formatValue={(v) => `${v}px`}
          />
        </ControlGroup>

        <ControlGroup label="Rotation" icon={ArrowLeftRight}>
          <SliderControl
            value={iconProps.rotation}
            onChange={(rotation) => setIconProps({ rotation })}
            min={0}
            max={360}
            step={15}
            formatValue={(v) => `${v}°`}
          />
        </ControlGroup>

        <ControlGroup label="Stroke" icon={Sliders}>
          <SliderControl
            value={iconProps.strokeWidth}
            onChange={(strokeWidth) => setIconProps({ strokeWidth })}
            min={0.5}
            max={4}
            step={0.5}
            formatValue={(v) => `${v}px`}
          />
        </ControlGroup>

        <ControlGroup label="Color" icon={Paintbrush}>
          <ColorPicker 
            value={iconProps.fillColor}
            onChange={(fillColor) => setIconProps({ fillColor })}
            showOpacity={true}
            opacity={iconProps.opacity}
            onOpacityChange={(opacity) => setIconProps({ opacity })}
          />
        </ControlGroup>
      </TabsContent>

      <TabsContent value="background" className="space-y-4 py-4">
        <ControlGroup label="Shape Rounding" icon={Square}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(BORDER_RADIUS_PRESETS)).map(([name, value]) => (
                <Button
                  key={name}
                  variant={bgProps.borderRadius === value ? "default" : "outline"}
                  className="h-8"
                  onClick={() => setBgProps({ borderRadius: value })}
                >
                  {name}
                </Button>
              ))}
            </div>
            <SliderControl
              value={bgProps.borderRadius}
              onChange={(borderRadius) => setBgProps({ borderRadius })}
              min={0}
              max={300}
              step={4}
              formatValue={(v) => `${v}px`}
            />
          </div>
        </ControlGroup>

        <ControlGroup label="Shadow" icon={Droplet}>
          <div className="grid grid-cols-3 gap-2">
            {(["none", "sm", "md", "lg", "xl", "2xl"] as const).map((size) => (
              <Button
                key={size}
                variant={bgProps.shadowSize === size ? "default" : "outline"}
                className="h-8"
                onClick={() => setBgProps({ shadowSize: size })}
              >
                {size.toUpperCase()}
              </Button>
            ))}
          </div>
        </ControlGroup>

        <ControlGroup label="Gradient" icon={Palette}>
          <div className="space-y-4">
            <Select 
              value={bgProps.gradientType}
              onValueChange={(gradientType) => setBgProps({ gradientType: gradientType as "none" | "linear" | "radial" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gradient type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
              </SelectContent>
            </Select>

            {bgProps.gradientType !== "none" && (
              <>
                {bgProps.gradientType === "linear" && (
                  <SliderControl
                    value={bgProps.gradientAngle}
                    onChange={(gradientAngle) => setBgProps({ gradientAngle })}
                    min={0}
                    max={360}
                    step={15}
                    formatValue={(v) => `${v}°`}
                  />
                )}
                <div className="space-y-2">
                  <Label className="text-xs">Start Color</Label>
                  <ColorPicker 
                    value={bgProps.gradientStartColor}
                    onChange={(gradientStartColor) => setBgProps({ gradientStartColor })}
                    showOpacity={false}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">End Color</Label>
                  <ColorPicker 
                    value={bgProps.gradientEndColor}
                    onChange={(gradientEndColor) => setBgProps({ gradientEndColor })}
                    showOpacity={false}
                  />
                </div>
              </>
            )}
          </div>
        </ControlGroup>

        <ControlGroup label="Background Color" icon={Paintbrush}>
          <ColorPicker 
            value={bgProps.backgroundColor}
            onChange={(backgroundColor) => setBgProps({ backgroundColor })}
            showOpacity={false}
          />
        </ControlGroup>
      </TabsContent>
    </Tabs>
  )
}
