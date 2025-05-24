import { useState } from 'react';

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let botMessage = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data:')) {
            const data = line.replace(/^data:\s*/, '');
            if (data === '[DONE]') break;

            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) {
                botMessage += delta;
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (last?.role === 'assistant') {
                    return [...prev.slice(0, -1), { role: 'assistant', content: botMessage }];
                  } else {
                    return [...prev, { role: 'assistant', content: botMessage }];
                  }
                });
              }
            } catch (e) {
              console.error('Failed：', data);
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed：', err);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="bg-white rounded shadow p-4 h-[400px] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <p><strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isStreaming}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSend}
          disabled={isStreaming}
        >
          Send
        </button>
      </div>
    </div>
  );
}
