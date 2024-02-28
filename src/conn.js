import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: 'localhost',
    port: 33069,
    user: 'root',
    database: 'gravity_falls',
    password: '123456789',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export default pool