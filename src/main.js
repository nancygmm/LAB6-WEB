import express from 'express'
import {createPost, getAllPosts, getPostID, modificarPost, eliminarPost} from './db.js'


const app = express()
app.use(express.json())
const port = 3000

app.get('/posts', async (req, res) => {
  const publicaciones = await getAllPosts()
  res.status(200).json(publicaciones)
})

app.get('/posts/:postId', async (req, res) => {
    const id = req.params.postId;
    const publicacionID = await getPostID(id)
    res.status(200).json(publicacionID)
})

app.post('/posts', async (req, res) => {
    const body = req.body
    const titulo = body.title
    const contenido = body.content
    let hora = new Date()
    const created = hora.toISOString().slice(0, 19).replace('T', ' ')
    const nombre = body.nombre
    const tipo = body.tipo
    const create = await createPost(titulo, contenido, created, nombre, tipo)
    res.status(200).json(body)
})

app.put('/posts/:postId', async (req, res) => {
    const id = req.params.postId
    const info =req.body
    const titulo = info.title
    const contenido = info.content
    let hora = new Date()
    const created = hora.toISOString().slice(0, 19).replace('T', ' ')
    const nombre = info.nombre
    const tipo = info.tipo
    const poner = await modificarPost(id, titulo, contenido, created, nombre, tipo)
    res.status(200).json(info)
})

app.delete('/posts/:postId', async (req, res) => {
    const id = req.params.postId
    const quitar = await eliminarPost(id)
    res.status(204)
})

app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})