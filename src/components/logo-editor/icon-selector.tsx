"use client"
import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import { AiIconModal } from "./ai-icon-modal"
import { IconGridItem } from "./icon-grid-item"

import {
  Activity,
  AlertCircle,
  Archive,
  BarChart,
  Bell,
  Bookmark,
  Calendar,
  Camera,
  Check,
  ChevronRight,
  Circle,
  Clock,
  Cloud,
  Code,
  Copy,
  CreditCard,
  Download,
  Edit,
  Eye,
  File,
  FileText,
  Filter,
  Flag,
  Folder,
  FolderOpen,
  Gift,
  Globe,
  Heart,
  Home,
  Image,
  Inbox,
  Info,
  Link,
  List,
  Lock,
  Mail,
  Map,
  MessageCircle,
  Moon,
  Music,
  Package,
  Phone,
  PieChart,
  Play,
  Plus,
  Power,
  Printer,
  Radio,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  Share,
  ShoppingBag,
  ShoppingCart,
  Smile,
  Star,
  Sun,
  Tag,
  Terminal,
  ThumbsUp,
  Trash,
  Trophy,
  Upload,
  User,
  Video,
  Volume2,
  Wallet,
  Zap,
} from "lucide-react"

interface IconSelectorProps {
  onSelectIcon?: (iconName: string) => void
  selectedIcon?: string | null
}

export const ICONS = {
  Activity,
  AlertCircle,
  Archive,
  BarChart,
  Bell,
  Bookmark,
  Calendar,
  Camera,
  Check,
  ChevronRight,
  Circle,
  Clock,
  Cloud,
  Code,
  Copy,
  CreditCard,
  Download,
  Edit,
  Eye,
  File,
  FileText,
  Filter,
  Flag,
  Folder,
  FolderOpen,
  Gift,
  Globe,
  Heart,
  Home,
  Image,
  Inbox,
  Info,
  Link,
  List,
  Lock,
  Mail,
  Map,
  MessageCircle,
  Moon,
  Music,
  Package,
  Phone,
  PieChart,
  Play,
  Plus,
  Power,
  Printer,
  Radio,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  Share,
  ShoppingBag,
  ShoppingCart,
  Smile,
  Star,
  Sun,
  Tag,
  Terminal,
  ThumbsUp,
  Trash,
  Trophy,
  Upload,
  User,
  Video,
  Volume2,
  Wallet,
  Zap,
}

export function IconSelector({ onSelectIcon = () => {}, selectedIcon }: IconSelectorProps) {
  const iconEntries = Object.entries(ICONS)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Icons</h2>
        <AiIconModal onSelectIcon={onSelectIcon} />
      </div>
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-3 gap-2 p-2">
          {iconEntries.map(([name, Icon]) => (
            <IconGridItem
              key={name}
              icon={Icon}
              name={name}
              selected={selectedIcon === name}
              onClick={() => onSelectIcon(name)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
