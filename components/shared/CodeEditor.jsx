"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

const highlightSyntax = (code, language) => {
  if (language === "json") {
    return code
      .replace(/"([^"]+)":/g, '<span class="text-blue-400">"$1"</span>:') // Keys in blue
      .replace(/:\s*"([^"]+)"/g, ': <span class="text-green-400">"$1"</span>') // String values in green
      .replace(/:\s*(true|false|null)/g, ': <span class="text-purple-400">$1</span>') // Booleans/null in purple
      .replace(/([{}[\],])/g, '<span class="text-gray-400">$1</span>') // Brackets and commas in gray
  }

  if (language === "javascript" || language === "js") {
    return code
      .replace(
        /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default)\b/g,
        '<span class="text-purple-400">$1</span>',
      ) // Keywords
      .replace(/"([^"]+)"/g, '<span class="text-green-400">"$1"</span>') // Strings
      .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>') // Numbers
      .replace(/\/\/.*$/gm, '<span class="text-gray-500">$&</span>') // Comments
      .replace(/([{}[\]();,.])/g, '<span class="text-gray-400">$1</span>') // Punctuation
  }

  if (language === "http" || language === "headers") {
    return code
      .replace(/^([A-Za-z-]+):\s*(.+)$/gm, '<span class="text-blue-400">$1</span>: <span class="text-green-400">$2</span>') // Headers and values
  }

  if (language === "bash" || language === "shell") {
    return code
      .replace(/^(\$|#)\s*/gm, '<span class="text-gray-500">$1</span> ') // Prompt
      .replace(/\b(curl|wget|npm|yarn|git|docker)\b/g, '<span class="text-blue-400">$1</span>') // Commands
      .replace(/(--\w+)/g, '<span class="text-purple-400">$1</span>') // Long flags only
      .replace(/(?<!-)(-[a-zA-Z])\b/g, '<span class="text-purple-400">$1</span>') // Short flags only
      .replace(/"([^"]+)"/g, '<span class="text-green-400">"$1"</span>') // Strings
  }

  return code
}

export function CodeBlock({ code, language = "javascript", title, className }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const highlightedCode = highlightSyntax(code, language)

  return (
    <div className={cn("relative rounded-lg border bg-background", className)}>
      {title && (
        <div className="flex items-center justify-between border-b px-4 py-2">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <span className="text-xs text-muted-foreground uppercase">{language}</span>
        </div>
      )}

      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-muted"
          onClick={copyToClipboard}
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>

        <pre className="overflow-x-auto p-4 pr-12 text-sm">
          <code className="font-mono text-foreground" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
      </div>
    </div>
  )
}
