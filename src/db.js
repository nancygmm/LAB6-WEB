import conn from './conn.js';

export async function getAllPosts() {
  const [rows] = await conn.query('SELECT * FROM blog_posts');
  return rows;
}

export async function getPostID(id) {
  const [rows] = await conn.query('SELECT * FROM blog_posts WHERE id = ?', [id]);
  return rows;
}

export async function createPost(title, content, created_at, nombre, tipo) {
  const [result] = await conn.query('INSERT INTO blog_posts (title, content, created_at, nombre, tipo) VALUES (?, ?, ?, ?, ?)', [title, content, created_at, nombre, tipo]);
  return result;
}

export async function modificarPost(id, title, content, created_at, nombre, tipo) {
  const [result] = await conn.query('UPDATE blog_posts SET title=?, content=?, created_at=?, nombre=?, tipo=? WHERE id = ? ', [title, content, created_at, nombre, tipo, id]);
  return result;
}

export async function eliminarPost(id) {
  const [result] = await conn.query('DELETE FROM blog_posts WHERE id = ?', [id]);
  return result;
}
