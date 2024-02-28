import express from 'express'
import {getAllPosts} from './db.js'

const app = express()
app.use(express.json())
const port = 3000

app.get('/posts', async (req, res) => {
  const publicaciones = await getAllPosts()
  res.status(200).json(publicaciones)
})

app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})