import axios from "axios"

const API_BASE_URL = "http://saveai.tech"

// Initiate a new chat
export const initiateChat = async (
  username: string,
  message: string,
  languageCode = "eng_Latn",
  languageName = "English",
  enableSearch = false,
): Promise<{ responseId: string }> => {
  try {
    console.log("Initiating chat with:", { username, message, enableSearch })

    const requestBody = {
      username,
      language_code: languageCode,
      language_name: languageName,
      enable_search: enableSearch,
      message,
    }

    console.log("Initiate Request Body:", requestBody)

    const response = await fetch(`${API_BASE_URL}/chat/initiate`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error("API Error Response:", errorData)
      throw new Error(errorData?.error || `Server error (${response.status}): ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Initiate API Response:", data)

    if (!data || !data.response_id) {
      throw new Error("Invalid response format from server: missing response_id")
    }

    return { responseId: data.response_id }
  } catch (error) {
    console.error("Initiate API Error:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to initiate chat: ${error.message}`)
    }
    throw new Error("Failed to initiate chat: Unknown error")
  }
}

// Replace the getResponseStatus function with this polling version
export const getResponseStatus = async (
  responseId: string,
  onReasoning?: (reasoning: string) => void,  // Callback to update reasoning
): Promise<any> => {
  try {
    console.log("Checking response status for:", responseId)

    const pollingInterval = 3000 // Poll every 3 seconds for a smoother experience

    while (true) {
      const requestBody = { response_id: responseId }

      const response = await fetch(`${API_BASE_URL}/chat/response-status`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error("Response Status API Error:", errorData)
        throw new Error(errorData?.error || `Server error (${response.status}): ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Response Status API Response:", data)

      // **Immediately update reasoning as soon as we get it**
      if (data.status === "thinking" || data.status === "reasoning") {
        if (onReasoning && data.reasoning) {
          onReasoning(data.reasoning) // Show reasoning immediately
        }
      }

      // **Once response is ready, return it**
      if (data.status === "completed" || data.response || data.answer) {
        return data
      }

      // **Wait for next poll**
      await new Promise((resolve) => setTimeout(resolve, pollingInterval))
    }
  } catch (error) {
    console.error("Response Status API Error:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to get response status: ${error.message}`)
    }
    throw new Error("Failed to get response status: Unknown error")
  }
}


// Update the generateResponse function to support reasoning callbacks
export const generateResponse = async (
  message: string,
  username: string,
  chatId?: string,
  languageCode = "eng_Latn",
  languageName = "English",
  enableSearch = false,
  onReasoning?: (reasoning: string) => void,
): Promise<any> => {
  try {
    // If chatId is provided, continue existing chat
    if (chatId) {
      return await continueChat(username, chatId, message, languageCode, languageName, enableSearch)
    }

    // Otherwise, start a new chat
    // 1. Initiate the chat
    const { responseId } = await initiateChat(username, message, languageCode, languageName, enableSearch)

    // 2. Poll for the response, passing the onReasoning callback
    return await getResponseStatus(responseId, onReasoning)
  } catch (error) {
    console.error("Generate Response Error:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to generate response: ${error.message}`)
    }
    throw new Error("Failed to generate response: Unknown error")
  }
}

// Keep these utility functions from the original code
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  return text // Placeholder implementation
}

export const getChatHistory = async (email: string, chatId?: string): Promise<any> => {
  try {
    const baseUrl = `${API_BASE_URL}/chat/${encodeURIComponent(email)}/history`
    const url = chatId ? `${baseUrl}?chat_id=${chatId}` : baseUrl

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error || `Failed to fetch chat history (${response.status}): ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching chat history:", error)
    // Return empty array instead of throwing error when server is offline
    return { messages: [] }
  }
}

export const fetchUserChats = async (email: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/chat/initiate`,
      {
        username: email,
        language_code: "eng_Latn",
        language_name: "English",
        enable_search: false,
        message: "", // Send an empty message if required
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Failed to fetch chats:", error)
    return []
  }
}


const continueChat = async (
  username: string,
  chatId: string,
  message: string,
  languageCode: string,
  languageName: string,
  enableSearch: boolean,
): Promise<any> => {
  try {
    const requestBody = {
      username,
      chat_id: chatId,
      message,
      language_code: languageCode,
      language_name: languageName,
      enable_search: enableSearch,
    }

    const response = await fetch(`${API_BASE_URL}/chat/continue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error("Continue Chat API Error:", errorData)
      throw new Error(errorData?.error || `Server error (${response.status}): ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Continue Chat API Response:", data)
    return data
  } catch (error) {
    console.error("Continue Chat API Error:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to continue chat: ${error.message}`)
    }
    throw new Error("Failed to continue chat: Unknown error")
  }
}

