import { createClient } from '@supabase/supabase-js'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export default async function handler(req, res) {
  const { data } = await supabase
    .from('settings')
    .select('key_value')
    .eq('key_name', 'github_ops_token')
    .single()

  const token = data?.key_value
  const repoUrl = `https://${token}@github.com/sandrasocial/selfie-ai-platform.git`
  const branchName = `feature/dev-ai-${Date.now()}`

  const tempDir = `/tmp/dev-ai-${Date.now()}`
  fs.mkdirSync(tempDir)

  exec(`git clone ${repoUrl} ${tempDir}`, (err) => {
    if (err) return res.status(500).json({ error: 'Clone failed', details: err })

    const filePath = path.join(tempDir, 'App.tsx')
    fs.appendFileSync(filePath, `\n// Dev AI auto-update at ${new Date().toISOString()}`)

    exec(`cd ${tempDir} && git checkout -b ${branchName} && git add . && git commit -m "Dev AI update" && git push origin ${branchName}`, (err2) => {
      if (err2) return res.status(500).json({ error: 'Push failed', details: err2 })

      res.status(200).json({ message: 'Dev AI pushed update to GitHub', branch: branchName })
    })
  })
}
