import express from 'express'
import {createPost, getAllPosts, getPostID, modificarPost, eliminarPost} from './db.js'
import fs from 'fs';
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const app = express()
app.use(express.json())

const port = 3000

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Gravity Falls', 
        version: '1.0.0', 
        description: 'Documentación de Gravity Falls', 
      },
    },
    apis: ['src/main.js'], 
  };
  
  const swagg = swaggerJsdoc(options)

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagg));




const vEndPoint = (req, res, next) => {
    const endpointsPermitidos = ['/posts', '/posts/:id'];
    if (!endpointsPermitidos.includes(req.path)) {
      const error = new Error('El endpoint no existe :(');
      error.status = 400;
      return next(error);
    }
    next();
  };
  
  app.use(vEndPoint);
  
  app.use((err, req, res, next) => {
    if (err.status === 400) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  });
 
  const vStructure = (req, res, next) => {
    if ((req.method === 'PUT' || req.method === 'POST') && !req.is('application/json')) {
      const error = new Error('Datos incorrectos debe de ser un JSON :/');
      error.status = 400;
      return next(error);
    }
    next();
  };
  
  app.use(vStructure);
  
  app.use((err, req, res, next) => {
    if (err.status === 400) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  });
  

  
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