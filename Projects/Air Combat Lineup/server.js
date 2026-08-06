import express from 'express'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(here, 'data', 'state.json')
const PORT = 5174

const app = express()
app.use(express.json({ limit: '5mb' }))

app.get('/api/state', async (_req, res) => {
  try {
    res.type('application/json').send(await readFile(DATA_FILE, 'utf8'))
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.json({ teams: [], players: [], accounts: [], games: [] })
    } else {
      console.error(err)
      res.status(500).json({ error: 'Could not read the state file.' })
    }
  }
})

app.put('/api/state', async (req, res) => {
  try {
    await mkdir(dirname(DATA_FILE), { recursive: true })
    const tempFile = join(dirname(DATA_FILE), `.state.json.${process.pid}.${Date.now()}.tmp`)
    await writeFile(tempFile, JSON.stringify(req.body, null, 2), 'utf8')
    await rename(tempFile, DATA_FILE)
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not write the state file.' })
  }
})

app.listen(PORT, () => console.log(`Lineup state server on http://localhost:${PORT}`))
