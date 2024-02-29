import express from 'express'
import {createPost, getAllPosts, getPostID, modificarPost, eliminarPost} from './db.js'


const app = express()
app.use(express.json())
const port = 3000

app.all('*', (req, res) => {
    res.status(501).json({ error: "El método HTTP no se implementó :(" });
  });  

app.get('/posts', async (req, res) => {
    try {
        const publicaciones = await getAllPosts()
        res.status(200).json(publicaciones)
    } catch (error) {
        res.status(500).send("Error contactando la base de datos/código :(")
    }
})

app.get('/posts/:postId', async (req, res) => {
    const id = req.params.postId;
    try {
        const publicacionID = await getPostID(id)
        res.status(200).json(publicacionID)
    } catch (error) {
        res.status(500).send("Error contactando la base de datos/código :(")
    }
    
})

app.post('/posts', async (req, res) => {
    const body = req.body
    const titulo = body.title
    const contenido = body.content
    let hora = new Date()
    const created = hora.toISOString().slice(0, 19).replace('T', ' ')
    const nombre = body.nombre
    const tipo = body.tipo
    try {
        const create = await createPost(titulo, contenido, created, nombre, tipo)
        res.status(200).json(body)
    } catch (error) {
        res.status(500).send("Error contactando la base de datos/código :(")
    }
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
    try {
        const poner = await modificarPost(id, titulo, contenido, created, nombre, tipo)
        res.status(200).json(info)
    } catch (error) {
        res.status(500).send("Error contactando la base de datos/código :(")
    }
})

app.delete('/posts/:postId', async (req, res) => {
    const id = req.params.postId
    try {
        const quitar = await eliminarPost(id)
        res.status(204)
    } catch (error) {
        res.status(500).send("Error contactando la base de datos/código :(")
    }
})

app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})