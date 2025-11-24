import React from 'react'

/**
 * Parses text with markdown-style bold syntax (**text**) and converts it to JSX
 * with <strong> tags for bold text.
 * 
 * @param text - The text string that may contain **bold** markers
 * @returns A React fragment containing the text with bold parts wrapped in <strong> tags
 * 
 * @example
 * formatTextWithBold("This is **bold text** and normal text")
 * // Returns: This is <strong>bold text</strong> and normal text
 */
export function formatTextWithBold(text: string): React.ReactNode {
  // Split by ** markers
  const parts = text.split(/\*\*(.+?)\*\*/g)
  
  // If no bold markers found, return text as-is
  if (parts.length === 1) {
    return text
  }
  
  // Map parts: even indices are normal text, odd indices are bold text
  return parts.map((part, index) => {
    // Odd indices are the text inside ** markers (bold)
    if (index % 2 === 1) {
      return <strong key={index}>{part}</strong>
    }
    // Even indices are normal text
    return part
  })
}




