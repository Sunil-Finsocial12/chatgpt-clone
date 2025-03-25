import { parseMessageContent } from './MessageFormatter';

const YourComponent = ({ backendResponse }: { backendResponse: string }) => {
    const formattedMessageParts = parseMessageContent(backendResponse);

    return (
        <div>
            {formattedMessageParts.map((part, index) => {
                if (part.type === 'text' && part.isHtml) {
                    return (
                        <span
                            key={index}
                            dangerouslySetInnerHTML={{ __html: part.content }}
                        />
                    );
                } else if (part.type === 'code') {
                    return (
                        <pre key={index}>
                            <code className={`language-${part.language}`}>
                                {part.content}
                            </code>
                        </pre>
                    );
                }
                return null;
            })}
        </div>
    );
};

export default YourComponent;
