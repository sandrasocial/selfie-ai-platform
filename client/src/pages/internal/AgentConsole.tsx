import { useState } from 'react';

export default function AgentConsole() {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [model, setModel] = useState<'gpt4' | 'claude'>('gpt4');
  const [loading, setLoading] = useState(false);

  const runCommand = async () => {
    if (!input.trim()) return;

    setLogs(prev => [...prev, `> ${input}`]);
    setLoading(true);

    try {
      const response = await fetch('/api/agent-console', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: input, model }),
      });

      const data = await response.json();
      setLogs(prev => [...prev, data.reply]);
    } catch (err) {
      setLogs(prev => [...prev, '[Error processing command]']);
    }

    setLoading(false);
    setInput('');
  };

  return (
    <div className="p-6 font-mono bg-black text-white min-h-screen">
      <h1 className="text-2xl mb-4">🧠 Agent Console</h1>

      <div className="flex items-center gap-4 mb-4">
        <input
          className="flex-1 p-2 bg-gray-900 border border-gray-700 rounded"
          placeholder="Type a command..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && runCommand()}
        />

        <select
          className="bg-gray-800 border border-gray-600 p-2 rounded"
          value={model}
          onChange={e => setModel(e.target.value as 'gpt4' | 'claude')}
        >
          <option value="gpt4">GPT-4</option>
          <option value="claude">Claude 3</option>
        </select>

        <button
          onClick={runCommand}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50"
        >
          {loading ? 'Running...' : 'Run'}
        </button>
      </div>
<button
  onClick={async () => {
    setLogs(prev => [...prev, '> Pushing Dev AI update...']);
    setLoading(true);

    try {
      const res = await fetch('/api/dev-ai/push', { method: 'POST' });
      const data = await res.json();

      if (data?.message) {
        setLogs(prev => [...prev, `✅ ${data.message} (branch: ${data.branch})`]);
      } else {
        setLogs(prev => [...prev, '⚠️ Unknown response from Dev AI']);
      }
    } catch (err) {
      setLogs(prev => [...prev, '❌ Failed to push Dev AI update']);
    }

    setLoading(false);
  }}
  disabled={loading}
  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50 ml-2"
>
  {loading ? 'Pushing...' : 'Push Dev AI Update'}
</button>

      <div className="space-y-2 text-sm leading-relaxed">
        {logs.map((log, i) => (
          <pre key={i} className="bg-gray-900 p-2 rounded border border-gray-700 whitespace-pre-wrap">
            {log}
          </pre>
        ))}
      </div>
    </div>
  );
}
