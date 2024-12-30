"use server"

import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// List of available icons
const AVAILABLE_ICONS = [
  'Activity', 'AlertCircle', 'Archive', 'BarChart', 'Bell', 'Bookmark', 'Calendar',
  'Camera', 'Check', 'ChevronRight', 'Circle', 'Clock', 'Cloud', 'Code', 'Copy',
  'CreditCard', 'Download', 'Edit', 'Eye', 'File', 'FileText', 'Filter', 'Flag',
  'Folder', 'FolderOpen', 'Gift', 'Globe', 'Heart', 'Home', 'Image', 'Inbox',
  'Info', 'Link', 'List', 'Lock', 'Mail', 'Map', 'MessageCircle', 'Moon', 'Music',
  'Package', 'Phone', 'PieChart', 'Play', 'Plus', 'Power', 'Printer', 'Radio',
  'RefreshCw', 'Save', 'Search', 'Send', 'Settings', 'Share', 'ShoppingBag',
  'ShoppingCart', 'Smile', 'Star', 'Sun', 'Tag', 'Terminal', 'ThumbsUp', 'Trash',
  'Trophy', 'Upload', 'User', 'Video', 'Volume2', 'Wallet', 'Zap'
] as const

type IconName = typeof AVAILABLE_ICONS[number]

interface IconResponse {
  icons: string[]
}

interface IconRequest {
  prompt: string
}

// Function to find similar icon names
function findSimilarIcons(query: string): IconName[] {
  query = query.toLowerCase()
  
  // Direct matches
  const directMatches = AVAILABLE_ICONS.filter(icon => 
    icon.toLowerCase().includes(query) ||
    query.includes(icon.toLowerCase())
  )
  
  // Common alternatives
  const alternatives: Record<string, IconName[]> = {
    'cycle': ['RefreshCw', 'Activity', 'Clock'],
    'rotate': ['RefreshCw', 'Activity', 'Clock'],
    'spin': ['RefreshCw', 'Activity', 'Clock'],
    'refresh': ['RefreshCw', 'Activity', 'Clock'],
    'shopping': ['ShoppingCart', 'ShoppingBag', 'Package'],
    'cart': ['ShoppingCart', 'ShoppingBag', 'Package'],
    'bag': ['ShoppingBag', 'Package', 'ShoppingCart'],
    'message': ['MessageCircle', 'Mail', 'Send'],
    'chat': ['MessageCircle', 'Mail', 'Send'],
    'email': ['Mail', 'Send', 'Inbox'],
    'time': ['Clock', 'Calendar', 'Activity'],
    'schedule': ['Calendar', 'Clock', 'Activity'],
    'secure': ['Lock', 'AlertCircle', 'Bell'],
    'security': ['Lock', 'AlertCircle', 'Bell'],
    'profile': ['User', 'Star', 'Heart'],
    'person': ['User', 'Star', 'Heart'],
    'avatar': ['User', 'Star', 'Heart']
  }

  // Check for alternative matches
  for (const [key, values] of Object.entries(alternatives)) {
    if (query.includes(key)) {
      return values as IconName[]
    }
  }

  // If we have direct matches, use them
  if (directMatches.length > 0) {
    return directMatches.slice(0, 3) as IconName[]
  }

  // Default fallback icons
  return ['Search', 'Star', 'Heart'] as IconName[]
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as IconRequest
    const prompt = body.prompt || ''

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI that suggests icon names from this specific list of available icons:
          ${AVAILABLE_ICONS.join(', ')}
          
          When given a prompt, analyze it and return exactly 3 icon names that best match the request.
          Return your response in this exact format, with no additional text:
          {"icons": ["IconName1", "IconName2", "IconName3"]}
          
          Make sure to ONLY use icon names from the provided list.
          If you're not sure about the exact icon names, prefer using general-purpose icons like Search, Star, or Heart.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    })

    const response = completion.choices[0].message.content
    if (!response) {
      const fallbackIcons = findSimilarIcons(prompt)
      return NextResponse.json({ icons: fallbackIcons })
    }

    try {
      const suggestions = JSON.parse(response) as IconResponse
      if (!suggestions.icons || !Array.isArray(suggestions.icons)) {
        const fallbackIcons = findSimilarIcons(prompt)
        return NextResponse.json({ icons: fallbackIcons })
      }

      // Validate that all suggested icons exist in our list
      const validIcons = suggestions.icons.filter((icon): icon is IconName => 
        AVAILABLE_ICONS.includes(icon as IconName)
      )
      
      if (validIcons.length === 3) {
        return NextResponse.json({ icons: validIcons })
      }

      // If we don't have valid suggestions from OpenAI, use our fallback method
      const fallbackIcons = findSimilarIcons(prompt)
      return NextResponse.json({ icons: fallbackIcons })

    } catch (parseError) {
      console.error('Parse error:', parseError)
      const fallbackIcons = findSimilarIcons(prompt)
      return NextResponse.json({ icons: fallbackIcons })
    }

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      icons: ['Search', 'Star', 'Heart'] as IconName[]
    }, { 
      status: 200
    })
  }
}
