// main.js
import dbConnect from "./connectionDB.js";

async function main() {
  try {
    const db = await dbConnect();
    console.log("Connected to database");

    // Create User table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS user (
        u_id INT PRIMARY KEY AUTO_INCREMENT, 
        u_first_name VARCHAR(255) NOT NULL,
        u_last_name VARCHAR(255) NOT NULL,
        u_email VARCHAR(255) NOT NULL UNIQUE, 
        u_password VARCHAR(255) NOT NULL,
        u_role ENUM('admin','user') DEFAULT 'user',
        phone VARCHAR(20) NOT NULL
      )
    `);
    console.log("User table created or already exists.");

    // Create Product table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Product (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        stock INT,
        price DECIMAL(10,2),
        isDeleted BOOLEAN DEFAULT FALSE,
        userId INT,
        FOREIGN KEY (userId) REFERENCES user(u_id)
      )
    `);
    console.log("Product table created or already exists.");

    // Insert a user
    const userQuery = `
      INSERT INTO user (u_first_name, u_last_name, u_email, u_password, phone)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [results] = await db.execute(userQuery, [
      'John',
      'Doe',
      'john.doe@example.com',
      'password123',
      '1234567890'
    ]);
    console.log('User inserted with ID:', results.insertId);

    // Insert a product linked to that user
    const productQuery = `
      INSERT INTO Product (name, stock, price, userId)
      VALUES (?, ?, ?, ?)
    `;
    const [productResults] = await db.execute(productQuery, [
      'Sample Product',
      100,
      19.99,
      results.insertId
    ]);
    console.log('Product inserted with ID:', productResults.insertId);

    // Close connection
    await db.end();
  } catch (error) {
    console.error("Error setting up database:", error);
  }
}

main();
