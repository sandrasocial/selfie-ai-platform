export default function SimpleTest() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600">✅ App is Working!</h1>
      <p className="mt-4">If you can see this, the Next.js app is running correctly.</p>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p>Environment check:</p>
        <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Found' : '❌ Missing'}</p>
        <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Found' : '❌ Missing'}</p>
      </div>
    </div>
  )
}
