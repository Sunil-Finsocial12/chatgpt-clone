export interface MessagePart {
    type: "text" | "code"
    content: string
    language?: string
    isHtml?: boolean // Indicate if content contains HTML
}

export const parseMessageContent = (content: string): MessagePart[] => {
    // Apply formatting to the entire content before parsing
    const formattedContent = applyStarFormatting(content);

    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: MessagePart[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(formattedContent)) !== null) {
        if (match.index > lastIndex) {
            const textContent = formattedContent.slice(lastIndex, match.index);
            parts.push({
                type: "text",
                content: textContent,
                isHtml: true, // ✅ Mark as HTML content
            });
        }

        parts.push({
            type: "code",
            language: match[1] || "plaintext",
            content: match[2].trim(),
        });

        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < formattedContent.length) {
        const remainingText = formattedContent.slice(lastIndex);
        parts.push({
            type: "text",
            content: remainingText,
            isHtml: true, // ✅ Mark as HTML content
        });
    }

    return parts.length > 0 ? parts : [{ type: "text", content: formattedContent }];
}

// ✅ Fixed applyStarFormatting function
const applyStarFormatting = (text: string): string => {
    let formattedText = text

    // Convert ***bold text*** to large bold text
    formattedText = formattedText.replace(/\*\*\*(.*?)\*\*\*/g, `<span class="text-xl font-bold">$1</span>`)

    // Convert **semibold text** to medium semibold text
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, `<span class="text-lg font-semibold">$1</span>`)

    // Convert ###text### to bold text
    formattedText = formattedText.replace(/###(.*?)###/g, `<span class="font-bold">$1</span>`)

    // Convert *italic text* to italicized text
    formattedText = formattedText.replace(/\*(.*?)\*/g, `<span class="italic">$1</span>`)

    // Convert __underline text__ to underlined text
    formattedText = formattedText.replace(/__(.*?)__/g, `<span class="underline">$1</span>`)

    return formattedText
}