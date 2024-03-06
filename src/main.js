import express from 'express';
import fs from 'fs';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {
  createPost, getAllPosts, getPostID, modificarPost, eliminarPost,
} from './db.js';

const app = express();
app.use(express.json());
const port = 3000;

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

const swagg = swaggerJsdoc(options);

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

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Manda a traer todos los posts
 *     description: Endpoint que va a traer los posts
 *     responses:
 *       '200':
 *         description: Proceso exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   created:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   tipo:
 *                     type: string
 *       '500':
 *         description: No se pudieron traer los posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.get('/posts', async (req, res) => {
  try {
    const publicaciones = await getAllPosts();
    res.status(200).json(publicaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error contactando la base de datos/código :(' });
  }
});

/**
   * @swagger
   * /posts/{postId}:
   *   get:
   *     summary: Manda a traer un post específico
   *     description: Endpoint que va a traer un post por su ID
   *     parameters:
   *       - in: path
   *         name: postId
   *         required: true
   *         description: ID del post a traer
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Proceso exitoso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 title:
   *                   type: string
   *                 content:
   *                   type: string
   *                 created:
   *                   type: string
   *                 nombre:
   *                   type: string
   *                 tipo:
   *                   type: string
   *       '500':
   *         description: No se pudo traer el post
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   */

app.get('/posts', async (req, res) => {
  try {
    const publicaciones = await getAllPosts();
    res.status(200).json(publicaciones);
  } catch (error) {
    res.status(500).send('Error contactando la base de datos/código :(');
  }
});

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Manda a traer un post específico
 *     description: Endpoint que va a traer un post por su ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post a traer
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Proceso exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 created:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 tipo:
 *                   type: string
 *       '500':
 *         description: No se pudo traer el post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

app.get('/posts/:postId', async (req, res) => {
  const id = req.params.postId;
  try {
    const publicacionID = await getPostID(id);
    res.status(200).json(publicacionID);
  } catch (error) {
    res.status(500).send('Error contactando la base de datos/código :(');
  }
});

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crea un nuevo post
 *     description: Endpoint para crear un nuevo post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               nombre:
 *                 type: string
 *               tipo:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Proceso exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 created:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 tipo:
 *                   type: string
 *       '500':
 *         description: No se pudo crear el post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

app.post('/posts', async (req, res) => {
  const { body } = req;
  const titulo = body.title;
  const contenido = body.content;
  const hora = new Date();
  const created = hora.toISOString().slice(0, 19).replace('T', ' ');
  const { nombre } = body;
  const { tipo } = body;
  try {
    const create = await createPost(titulo, contenido, created, nombre, tipo);
    res.status(200).json(body);
  } catch (error) {
    console.log(error)
    res.status(500).send('Error contactando la base de datos/código :(');
  }
});

/**
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: Modifica un post existente
 *     description: Endpoint para modificar un post existente por su ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post a modificar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               nombre:
 *                 type: string
 *               tipo:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Proceso exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 created:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 tipo:
 *                   type: string
 *       '500':
 *         description: No se pudo modificar el post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

app.put('/posts/:postId', async (req, res) => {
  const id = req.params.postId;
  const info = req.body;
  const titulo = info.title;
  const contenido = info.content;
  const hora = new Date();
  const created = hora.toISOString().slice(0, 19).replace('T', ' ');
  const { nombre } = info;
  const { tipo } = info;
  try {
    const poner = await modificarPost(id, titulo, contenido, created, nombre, tipo);
    res.status(200).json(info);
  } catch (error) {
    res.status(500).send('Error contactando la base de datos/código :(');
  }
});

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Elimina un post existente
 *     description: Endpoint para eliminar un post existente por su ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Proceso exitoso sin contenido
 */

app.delete('/posts/:postId', async (req, res) => {
  const id = req.params.postId;
  try {
    const quitar = await eliminarPost(id);
    res.status(204);
  } catch (error) {
    res.status(500).send('Error contactando la base de datos/código :(');
  }
});

app.all('*', (req, res) => {
  res.status(501).json({ error: 'El método HTTP no se implementó :(' });
});

app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`);
});
