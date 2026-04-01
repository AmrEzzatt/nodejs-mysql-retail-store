import mysql from 'mysql2/promise';

async function dbConnect() {
try {
        const db =await mysql.createConnection({
        host: 'localhost',
        user: 'root',       // default XAMPP user
        password: '',       // set if you added one in XAMPP
        database: 'myapp_db' // create this in phpMyAdmin
        })
        console.log('Connected to the MySQL database.');
        return db;
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }

}

export default dbConnect ;