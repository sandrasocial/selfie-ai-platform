import { createClient } from '@supabase/supabase-js'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'

// ✅ INIT SUPABASE CLIENT HERE
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { data } = await supabase
      .from('settings')
      .select('key_value')
      .eq('key_name', 'github_ops_token')
      .single()

    const token = data?.key_value
    const repoUrl = `https://${token}@github.com/sandrasocial/selfie-ai-platform.git`
    const branchName = `feature/dev-ai-${Date.now()}`
    const tempDir = `/tmp/dev-ai-${Date.now()}`
    fs.mkdirSync(tempDir, { recursive: true })

    exec(`git clone ${repoUrl} ${tempDir}`, (err) => {
      if (err) {
        console.error('❌ Clone failed:', err)
        return res.status(500).json({ error: 'Clone failed', details: err.message })
      }

      const filePath = path.join(tempDir, 'App.tsx')
      fs.appendFileSync(filePath, `\n// Dev AI auto-update at ${new Date().toISOString()}`)

      exec(`cd ${tempDir} && git checkout -b ${branchName} && git add . && git commit -m "Dev AI update" && git push origin ${branchName}`, (err2) => {
        if (err2) {
          console.error('❌ Push failed:', err2)
          return res.status(500).json({ error: 'Push failed', details: err2.message })
        }

        console.log(`✅ Dev AI pushed to branch: ${branchName}`)
        res.status(200).json({ message: 'Dev AI pushed update to GitHub', branch: branchName })
      })
    })
  } catch (err) {
    console.error('🔥 Dev AI execution error:', err)
    res.status(500).json({ error: err.message, stack: err.stack })
  }
}
