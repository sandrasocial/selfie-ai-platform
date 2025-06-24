'use client'

export default function EnvTestPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Supabase URL:</h2>
          <p className="text-sm font-mono bg-gray-100 p-2 rounded">
            {supabaseUrl || 'NOT FOUND'}
          </p>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Supabase Anon Key:</h2>
          <p className="text-sm font-mono bg-gray-100 p-2 rounded">
            {supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT FOUND'}
          </p>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">All Environment Variables:</h2>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
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
