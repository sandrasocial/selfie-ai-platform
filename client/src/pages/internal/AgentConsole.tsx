import { useState } from 'react';

export default function AgentConsole() {
  const [prompt, setPrompt] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const runCommand = async () => {
    if (!prompt.trim()) return;

    setLogs((prev) => [...prev, `> ${prompt}`]);
    setLoading(true);

    try {
      const res = await fetch('/api/agent-console', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          agent: 'Dev AI',
          context: 'You are my expert frontend developer inside the SELFIE AI™ agent team. Respond clearly, in code or guidance.',
        }),
      });

      const data = await res.json();
      setLogs((prev) => [...prev, data.response || 'No response']);
    } catch (err: any) {
      setLogs((prev) => [...prev, `❌ Error: ${err.message}`]);
    } finally {
      setPrompt('');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 font-mono bg-black text-white min-h-screen">
      <h1 className="text-2xl mb-4">💬 Agent Console</h1>

      <div className="mb-4 flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Dev AI..."
          className="flex-1 p-2 rounded bg-white text-black"
        />
        <button
          onClick={runCommand}
          disabled={loading}
          className="px-4 py-2 bg-white text-black rounded"
        >
          {loading ? 'Running...' : 'Run'}
        </button>
      </div>

      <div className="space-y-2">
        {logs.map((log, i) => (
          <pre key={i} className="whitespace-pre-wrap text-sm">
            {log}
          </pre>
        ))}
      </div>
    </div>
  );
}
