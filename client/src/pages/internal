import { useState } from 'react';

export default function AgentConsole() {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const runCommand = async () => {
    setLogs((prev) => [...prev, `> ${input}`]);

    const response = await fetch('/api/agent-console', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: input }),
    });

    const data = await response.json();
    setLogs((prev) => [...prev, data.reply]);
    setInput('');
  };

  return (
    <div className="p-6 font-mono bg-black text-white min-h-screen">
      <h1 className="text-2xl mb-4">🧠 Agent Console</h1>
      <div className="mb-4">
        {logs.map((log, i) => (
          <pre key={i} className="mb-2">{log}</pre>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && runCommand()}
        placeholder="Type a command for your AI agents..."
        className="w-full p-2 text-black"
      />
    </div>
  );
}
