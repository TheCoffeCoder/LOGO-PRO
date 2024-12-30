"use client"
import { LucideIcon } from "lucide-react"
import { useIcon } from "@/components/logo-editor/icon-context"
import { useBackground } from "@/components/logo-editor/background-context"
import { SHADOW_PRESETS } from "@/components/logo-editor/background-context"
import { ICONS } from "@/components/logo-editor/icon-selector"

export default function LogoProPage() {
  const { selectedIcon, properties: iconProps } = useIcon()
  const { properties: bgProps } = useBackground()
  const SelectedIcon = selectedIcon ? ICONS[selectedIcon as keyof typeof ICONS] as LucideIcon : null

  // Generate gradient style if needed
  const gradientStyle = bgProps.gradientType !== "none" 
    ? bgProps.gradientType === "linear"
      ? `linear-gradient(${bgProps.gradientAngle}deg, ${bgProps.gradientStartColor}, ${bgProps.gradientEndColor})`
      : `radial-gradient(circle, ${bgProps.gradientStartColor}, ${bgProps.gradientEndColor})`
    : "none"

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-[#fafafa]">
      {/* Graph Background */}
      <div 
        className="absolute inset-0 bg-[#f5f5f5]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e5e5 1px, transparent 1px),
            linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Main Content */}
      <div className="relative flex-1 flex items-center justify-center p-8">
        <div 
          id="logo-container"
          className="w-[600px] aspect-square rounded-lg border bg-white"
          style={{
            background: gradientStyle !== "none" ? gradientStyle : bgProps.backgroundColor,
            borderRadius: bgProps.borderRadius,
            boxShadow: SHADOW_PRESETS[bgProps.shadowSize],
          }}
        >
          {/* Logo Canvas */}
          <div className="flex h-full w-full items-center justify-center">
            {SelectedIcon && (
              <div
                style={{
                  transform: `rotate(${iconProps.rotation}deg)`,
                  opacity: iconProps.opacity,
                }}
                className="transition-all duration-200"
              >
                <SelectedIcon 
                  size={iconProps.size}
                  strokeWidth={iconProps.strokeWidth}
                  color={iconProps.fillColor}
                  className="transition-all duration-200"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
