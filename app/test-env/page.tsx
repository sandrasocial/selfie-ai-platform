'use client'

export default function EnvTestPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Environment Variables Test</h1>

      <div className="space-y-4">
        <div className="rounded border p-4">
          <h2 className="mb-2 font-semibold">Supabase URL:</h2>
          <p className="rounded bg-gray-100 p-2 font-mono text-sm">{supabaseUrl || 'NOT FOUND'}</p>
        </div>

        <div className="rounded border p-4">
          <h2 className="mb-2 font-semibold">Supabase Anon Key:</h2>
          <p className="rounded bg-gray-100 p-2 font-mono text-sm">
            {supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT FOUND'}
          </p>
        </div>

        <div className="rounded border p-4">
          <h2 className="mb-2 font-semibold">All Environment Variables:</h2>
          <pre className="overflow-auto rounded bg-gray-100 p-2 text-xs">
            {JSON.stringify(
              Object.entries(process.env).filter(([key]) => key.startsWith('NEXT_PUBLIC_')),
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  )
}
