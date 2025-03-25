import type React from "react"
import { parseMessageContent } from "./MessageFormatter"

interface MessageRendererProps {
  content: string
  isDarkMode: boolean
  onCodeBlockClick: (content: string, language: string) => void
}

const MessageRenderer: React.FC<MessageRendererProps> = ({ content, isDarkMode, onCodeBlockClick }) => {
  const parts = parseMessageContent(content)

  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        // ✅ Handle text content properly
        if (part.type === "text") {
          return part.isHtml ? (
            <div
              key={index}
              className="text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: part.content }} // ✅ Ensure proper rendering
            />
          ) : (
            <p key={index} className="text-base leading-relaxed whitespace-pre-wrap">
              {part.content}
            </p>
          )
        }

        // ✅ Handle Code Blocks
        if (part.type === "code" && part.language) {
          return (
            <div
              key={index}
              onClick={() => onCodeBlockClick(part.content, part.language || "plaintext")}
              className={`cursor-pointer group rounded-lg overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}
            >
              <div
                className={`flex items-center justify-between px-4 py-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
              >
                <div className="flex items-center space-x-2">
                  <i className="fas fa-code"></i>
                  <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {part.language}
                  </span>
                </div>
              </div>
              <div className="p-4 max-h-60 overflow-hidden relative">
                <pre className="overflow-x-auto">
                  <code className={`language-${part.language} ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}>
                    {part.content}
                  </code>
                </pre>
              </div>
            </div>
          )
        }

        return null // Skip unknown types
      })}
    </div>
  )
}

export default MessageRenderer
