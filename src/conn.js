import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'mysql',
  port: 3306,
  user: 'root',
  password: '123456789',
  database: 'gravity_falls',
});

export default pool;
