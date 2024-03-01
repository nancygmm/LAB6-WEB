import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  port: 33069,
  user: 'root',
  password: '123456789',
  database: 'gravity_falls',
});

export default pool;
