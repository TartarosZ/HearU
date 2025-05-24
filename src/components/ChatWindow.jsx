import React, { useState } from 'react';

export default function ChatWindow() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    const res = await fetch('/chat', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages })
    });

    if (!res.ok) return alert('Request Failed');

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let content = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      content += decoder.decode(value);
      setMessages([...newMessages, { role: 'assistant', content }]);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="h-60 overflow-y-auto border p-2 mb-2">
        {messages.map((m, i) => (
          <div key={i} className={`mb-1 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>{m.content}</div>
        ))}
      </div>
      <div className="flex">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 border p-2 rounded-l"
          placeholder="Start to talk with Meow"
        />
        <button onClick={handleSend} className="bg-green-500 text-white px-4 py-2 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
}
