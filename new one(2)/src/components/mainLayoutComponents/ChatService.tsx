import { fetchUserChats, translateText } from "../../services/api"
import { getAuthToken, refreshSession } from "../../services/sessionService"

interface Message {
  id: string
  content: string
  type: "user" | "assistant"
  timestamp: Date
  status: "sending" | "sent" | "error"
  file?: {
    name: string
    type: string
    url: string
  }
}

interface Chat {
  id: string
  title: string
  createdAt: Date
  messages: Message[]
  isStarred?: boolean
  isEditing?: boolean
  projectId?: string
}

export const getChatHistory = async (username: string, chatId: string) => {
  // Placeholder implementation - replace with your actual API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    messages: [
      {
        id: "1",
        content: "This is a test message from history.",
        role: "assistant",
        timestamp: new Date(),
      },
    ],
  }
}

export const loadChatHistory = async (
  username: string, 
  chatId: string,
  setIsLoadingHistory: (isLoading: boolean) => void,
  setMessages: (messages: Message[]) => void,
  setHasMessages: (hasMessages: boolean) => void
) => {
  try {
    setIsLoadingHistory(true)
    const history = await getChatHistory(username, chatId)
    console.log("Chat history fetched:", history)

    if (history && Array.isArray(history.messages)) {
      const formattedMessages: Message[] = history.messages.map((msg: any) => ({
        id: msg.id || `msg_${Date.now()}_${Math.random()}`,
        content: msg.content,
        type: msg.role === "assistant" ? "assistant" : "user", // Fixed the type here
        timestamp: new Date(msg.timestamp),
        status: "sent",
      }))

      setMessages(formattedMessages)
      setHasMessages(formattedMessages.length > 0)
    }
  } catch (error) {
    console.error("Error loading chat history:", error)
  } finally {
    setIsLoadingHistory(false)
  }
}

export const fetchFinalResponse = async (
  responseId: string,
  updateReasoning: (reasoning: string) => void,
  setFinalResponse: (response: string) => void,
) => {
  try {
    while (true) {
      console.log("📡 Fetching final response for:", responseId)

      const response = await fetch("http://saveai.tech/chat/response-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response_id: responseId }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("✅ Final response received:", data)

      // Ensure data.reasoning exists before using it
      if (data.reasoning && typeof data.reasoning === "string" && data.reasoning.trim() !== "") {
        updateReasoning(data.reasoning)
      }

      // Ensure data.response exists before using it
      if (data.status === "completed" && data.response && typeof data.response === "string") {
        console.log("💡 Setting final response:", data.response)
        setFinalResponse(data.response)
        return // Exit loop
      }

      // Wait for 10 seconds before next poll
      await new Promise((resolve) => setTimeout(resolve, 10000))
    }
  } catch (error) {
    console.error("❌ Failed to fetch AI response:", error)
    setFinalResponse("Error retrieving AI response.")
  }
}

export const handleLanguageTranslation = async (
  selectedLanguage: { code: string; name: string; nativeName: string },
  currentChat: Chat | null,
  setChats: (chats: any) => void,
  setCurrentChat: (chat: Chat | null) => void,
  setMessages: (messages: Message[]) => void,
  setIsGenerating: (isGenerating: boolean) => void
) => {
  if (!currentChat || currentChat.messages.length === 0) return
  
  try {
    setIsGenerating(true)

    const translatedMessages = await Promise.all(
      currentChat.messages.map(async (msg) => {
        try {
          const translatedContent = await translateText(msg.content, selectedLanguage.code)
          return { ...msg, content: translatedContent }
        } catch (error) {
          console.error("🚨 Error translating message:", msg.content, error)
          return msg
        }
      })
    )

    setChats((prevChats: Chat[]) =>
      prevChats.map((chat) => (chat.id === currentChat.id ? { ...chat, messages: translatedMessages } : chat))
    )

    setCurrentChat((prevChat) => (prevChat ? { ...prevChat, messages: translatedMessages } : prevChat))
    setMessages(translatedMessages)
  } catch (error) {
    console.error("🚨 Translation failed:", error)
  } finally {
    setIsGenerating(false)
  }
}

export const fetchChats = async (username: string, setChats: (chats: Chat[]) => void) => {
  if (username) {
    fetchUserChats(username)
      .then((response) => {
        if (response && response.chats && Array.isArray(response.chats)) {
          const formattedChats: Chat[] = response.chats.map((chatData) => ({
            id: chatData.chat_id,
            title: chatData.first_message || "New Chat",
            createdAt: new Date(chatData.timestamp),
            messages: [
              {
                id: `msg_${Date.now()}_${Math.random()}`,
                content: chatData.first_message,
                type: "user",
                timestamp: new Date(chatData.timestamp),
                status: "sent",
              },
            ],
            isStarred: false,
            isEditing: false,
          }))

          formattedChats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          setChats(formattedChats)
        }
      })
      .catch((error) => {
        console.error("Error fetching chats:", error)
        setChats([])
      })
  }
}

export const handleSendMessage = async (
  inputText: string, 
  activeFilePreview: any | null,
  currentChat: Chat | null,
  isGenerating: boolean,
  userProfile: { name: string } | null,
  isSearchEnabled: boolean,
  setHasMessages: (hasMessages: boolean) => void,
  setCurrentReasoning: (reasoning: string) => void,
  setShowReasoning: (showReasoning: boolean) => void,
  setIsGenerating: (isGenerating: boolean) => void,
  setShowGreeting: (showGreeting: boolean) => void,
  setIsChatActive: (isChatActive: boolean) => void,
  setMessages: (updater: (prev: Message[]) => Message[]) => void,
  setInputText: (text: string) => void,
  resetTextAreaHeight: () => void,
  isAuthenticated: boolean,
  setIsLoginModalOpen?: (isOpen: boolean) => void,
  setIsLoginAnimated?: (isAnimated: boolean) => void
) => {
  if ((!inputText.trim() && !activeFilePreview) || isGenerating) return;

  // Check if user is authenticated
  if (!isAuthenticated) {
    setIsLoginAnimated?.(true);
    setIsLoginModalOpen?.(true);
    return;
  }

  // Refresh the session timestamp
  refreshSession();

  // Construct the complete message by combining input text with file URL
  let messageContent = inputText.trim();
  if (activeFilePreview?.url) {
    messageContent = `${messageContent} ${activeFilePreview.url}`;
  }

  console.log("🚀 Sending message:", { 
    inputText: messageContent, // Use the combined message
    activeFilePreview,
    currentChat 
  });

  setHasMessages(true);
  setCurrentReasoning("");
  setShowReasoning(false);
  setIsGenerating(true);

  let chatToUse = currentChat;
  if (!chatToUse) {
    chatToUse = {
      id: "",
      title: inputText.substring(0, 30) || "New Chat",
      createdAt: new Date(),
      messages: [],
      isEditing: false,
    };
  }

  setShowGreeting(false);
  setIsChatActive(true);

  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newMessage = {
    id: messageId,
    content: messageContent, // Use the combined message content
    type: "user" as "user", // Type assertion
    timestamp: new Date(),
    status: "sending" as "sending", // Type assertion
    file: activeFilePreview // Include file info in the message
  };

  setMessages((prevMessages) => [...prevMessages, newMessage]);
  setInputText("");
  resetTextAreaHeight();

  // Create message IDs
  const reasoningMessageId = `reasoning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const finalResponseId = `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    console.log("📡 Calling API for chat...");
    const apiEndpoint = !chatToUse.id
      ? "http://saveai.tech/chat/initiate"
      : "http://saveai.tech/chat/continue";

    console.log("Search Enabled:", isSearchEnabled);

    const requestBody = !chatToUse.id
      ? { 
          username: userProfile?.name || "user", 
          message: messageContent, // Use the combined message content
          enable_search: isSearchEnabled 
        }
      : { 
          username: userProfile?.name || "user", 
          chat_id: chatToUse.id, 
          message: messageContent, // Use the combined message content
          enable_search: isSearchEnabled 
        };

    // Get auth token from session
    const authToken = getAuthToken();

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": authToken ? `Bearer ${authToken}` : "" 
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) throw new Error(`API error: ${response.status} - ${response.statusText}`);

    const apiResponse = await response.json();
    console.log("✅ API Response:", apiResponse);

    // Update user message status to "sent"
    setMessages((currentMessages) =>
      currentMessages.map((msg) => (msg.id === messageId ? { ...msg, status: "sent" } : msg))
    );

    // Ensure responseId exists
    if (!apiResponse.response_id) throw new Error("No response_id received from API!");

    const responseId = apiResponse.response_id;
    console.log("🎯 Extracted responseId:", responseId);

    // Check if initial response has reasoning
    const hasInitialReasoning = apiResponse.reasoning && apiResponse.reasoning.trim() !== "";
    
    // If there's reasoning, show it with a reasoning message
    if (hasInitialReasoning) {
      console.log("💭 Initial reasoning found, creating reasoning message");
      
      // Create a message for reasoning
      const reasoningMessage = {
        id: reasoningMessageId,
        content: "", // Empty content - we'll just use this to attach reasoning
        type: "assistant" as "assistant",
        timestamp: new Date(),
        status: "sent" as "sent",
        isReasoningMessage: true // Mark as reasoning message
      };
      
      // Add the reasoning message to the messages array
      setMessages((prevMessages) => [...prevMessages, reasoningMessage]);
      
      // Set the reasoning to display with this message
      setCurrentReasoning(apiResponse.reasoning);
      setShowReasoning(true);
      setIsGenerating(false); // Hide "Thinking..." indicator
    }

    // Poll for updates
    const pollForUpdates = async () => {
      try {
        let isCompleted = false;
        let finalResponse = null;
        let lastReasoningUpdate = Date.now();
        let lastReasoning = apiResponse.reasoning || "";
        let consecutiveStableChecks = 0;
        let previousReasoningLength = lastReasoning.length;
        let reasoningCompleted = false;
        let responseAdded = false;
        let hasAddedReasoningMessage = hasInitialReasoning;
        let hasReasoning = hasInitialReasoning;
        let reasoningStabilizedTime = null;
        
        while (!isCompleted) {
          console.log("🔄 Polling for updates...");
          
          const statusResponse = await fetch("http://saveai.tech/chat/response-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ response_id: responseId }),
          });
          
          if (!statusResponse.ok) {
            throw new Error(`HTTP error! status: ${statusResponse.status}`);
          }
          
          const data = await statusResponse.json();
          console.log("✅ Status update received:", data);
          
          // Check if this response has reasoning at all
          if (data.reasoning && typeof data.reasoning === "string" && data.reasoning.trim() !== "") {
            hasReasoning = true;
            const currentReasoningLength = data.reasoning.length;
            
            // Check if reasoning has changed
            if (data.reasoning !== lastReasoning) {
              console.log(`💭 New reasoning received (${currentReasoningLength} chars vs previous ${previousReasoningLength})`);
              
              // Reset stability counter if reasoning content has changed
              consecutiveStableChecks = 0;
              reasoningStabilizedTime = null;
              lastReasoningUpdate = Date.now();
              lastReasoning = data.reasoning;
              previousReasoningLength = currentReasoningLength;
              
              // Update reasoning state
              setCurrentReasoning(data.reasoning);
              setShowReasoning(true);
              
              // If we haven't added a reasoning message yet, add one
              if (!hasAddedReasoningMessage) {
                console.log("Adding reasoning message");
                
                const reasoningMessage = {
                  id: reasoningMessageId,
                  content: "", // Empty content - we'll just use this to attach reasoning
                  type: "assistant" as "assistant",
                  timestamp: new Date(),
                  status: "sent" as "sent",
                  isReasoningMessage: true // Mark as reasoning message
                };
                
                setMessages((prevMessages) => [...prevMessages, reasoningMessage]);
                hasAddedReasoningMessage = true;
                setIsGenerating(false); // Hide "Thinking..." indicator
              }
            } else {
              // Reasoning hasn't changed, increment stability counter
              consecutiveStableChecks++;
              console.log(`⏱️ Reasoning stable check #${consecutiveStableChecks} (${currentReasoningLength} chars)`);
              
              // If this is the first time we've reached stability, record the time
              if (consecutiveStableChecks === 5 && !reasoningStabilizedTime) {
                reasoningStabilizedTime = Date.now();
                console.log("⏱️ Reasoning has stabilized at:", new Date(reasoningStabilizedTime).toISOString());
              }
            }
          }
          
          // If status is completed and response exists, store the final response
          if (data.status === "completed" && data.response && typeof data.response === "string") {
            if (!finalResponse) {
              console.log("💡 Final response received");
              finalResponse = data.response;
              
              // If there's no reasoning, show response immediately
              if (!hasReasoning) {
                console.log("No reasoning detected, showing response immediately");
                
                const responseMessage = {
                  id: finalResponseId,
                  content: finalResponse,
                  type: "assistant" as "assistant",
                  timestamp: new Date(),
                  status: "sent" as "sent",
                };
                
                setMessages((currentMessages) => [...currentMessages, responseMessage]);
                responseAdded = true;
                isCompleted = true; // Exit the loop
                setIsGenerating(false); // Hide "Thinking..." indicator
              } else {
                console.log("Reasoning detected, waiting for reasoning to stabilize and collapse before showing response");
              }
            }
          }
          
          // For messages WITH reasoning: check if reasoning is completed
          if (hasReasoning && !reasoningCompleted) {
            const timeSinceLastReasoningUpdate = Date.now() - lastReasoningUpdate;
            if ((consecutiveStableChecks >= 5) || (timeSinceLastReasoningUpdate > 15000)) {
              console.log(`⏱️ Reasoning appears complete: ${consecutiveStableChecks} stable checks, ${timeSinceLastReasoningUpdate}ms since last update`);
              reasoningCompleted = true;
              
              // If we haven't recorded the stabilized time yet, do it now
              if (!reasoningStabilizedTime) {
                reasoningStabilizedTime = Date.now();
                console.log("⏱️ Reasoning has stabilized at:", new Date(reasoningStabilizedTime).toISOString());
              }
            }
          }
          
          // For messages WITH reasoning: add response after reasoning completes AND collapses
          if (hasReasoning && reasoningCompleted && finalResponse && !responseAdded && reasoningStabilizedTime) {
            // Calculate when the reasoning should be collapsed in the UI
            // Based on AIReasoningDisplay component:
            // - Typing speed: 14ms per character
            // - Delay before collapse: 2000ms
            const typingTime = lastReasoning.length * 2;
            const collapseDelay = 2000;
            const totalTimeBeforeCollapse = typingTime + collapseDelay;
            
            // Check if enough time has passed for the reasoning to be collapsed
            const timeSinceStabilized = Date.now() - reasoningStabilizedTime;
            
            if (timeSinceStabilized >= totalTimeBeforeCollapse) {
              console.log(`✨ Reasoning should be collapsed now (${timeSinceStabilized}ms since stabilized, needed ${totalTimeBeforeCollapse}ms), adding response`);
              
              // Add the final response as a new message
              const responseMessage = {
                id: finalResponseId,
                content: finalResponse,
                type: "assistant" as "assistant",
                timestamp: new Date(),
                status: "sent" as "sent",
              };
              
              setMessages((currentMessages) => [...currentMessages, responseMessage]);
              responseAdded = true;
              isCompleted = true; // Exit the loop
            } else {
              console.log(`⏱️ Waiting for reasoning to collapse: ${timeSinceStabilized}ms elapsed, need ${totalTimeBeforeCollapse}ms`);
            }
          }
          
          // Wait before polling again (only if not completed)
          if (!isCompleted) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      } catch (error) {
        console.error("❌ Error polling for updates:", error);
        setIsGenerating(false);
      }
    };

    // Start polling for updates
    pollForUpdates();
    
  } catch (error) {
    console.error("❌ Error sending message:", error);
    // Update message status to error
    setMessages((currentMessages) =>
      currentMessages.map((msg) => (msg.id === messageId ? { ...msg, status: "error" } : msg))
    );
    setIsGenerating(false);
  }
}

export default {
  getChatHistory,
  loadChatHistory,
  fetchFinalResponse,
  handleLanguageTranslation,
  fetchChats,
  handleSendMessage
}
