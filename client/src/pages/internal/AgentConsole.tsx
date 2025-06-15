import { useState } from 'react';

export default function AgentConsole() {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runCommand = async () => {
    setLoading(true);
    setError(null);
    setLogs(prev => [...prev, `> ${input}`]);

    try {
      const response = await fetch('/api/agent-console', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: input }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Unknown error');

      setLogs(prev => [...prev, data.reply]);
    } catch (err: any) {
      setError(err.message);
      setLogs(prev => [...prev, `[ERROR] ${err.message}`]);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono p-6">
      <h1 className="text-2xl mb-4">🤖 Agent Console</h1>
      <div className="space-y-2 mb-4">
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
      <input
        type="text"
        className="bg-gray-800 text-white p-2 rounded w-full mb-2"
        placeholder="Type a command..."
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && runCommand()}
      />
      <button
        onClick={runCommand}
        className="bg-white text-black px-4 py-2 rounded disabled:opacity-50"
        disabled={!input || loading}
      >
        {loading ? 'Running...' : 'Run'}
      </button>
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
  );
}
