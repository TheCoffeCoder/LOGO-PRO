"use client"
import Link from "next/link"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { downloadAsPng } from "@/lib/download-utils"
import { HistoryControls } from "@/components/logo-editor/history-controls"

function DownloadButton() {
  const handleDownload = async () => {
    await downloadAsPng('logo-container')
  }

  return (
    <Button variant="outline" className="gap-2" onClick={handleDownload}>
      <Download size={16} />
      Download PNG
    </Button>
  )
}

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="ml-6 flex items-center space-x-2">
            <span className="font-bold inline-block">Logo Pro</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-4">
            <HistoryControls />

            <DownloadButton />
          </nav>
        </div>
      </div>
    </nav>
  )
}
