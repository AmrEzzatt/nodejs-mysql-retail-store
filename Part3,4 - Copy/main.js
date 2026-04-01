// main.js
import dbConnect from "./connectionDB.js";

async function main() {
  try {
    const db = await dbConnect();

    // 1. Create tables
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Suppliers (
        SupplierID INT AUTO_INCREMENT PRIMARY KEY,
        SupplierName VARCHAR(255),
        ContactNumber VARCHAR(255)
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS Products (
        ProductID INT AUTO_INCREMENT PRIMARY KEY,
        ProductName VARCHAR(255),
        Price DECIMAL(10,2),
        StockQuantity INT,
        SupplierID INT,
        FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS Sales (
        SaleID INT AUTO_INCREMENT PRIMARY KEY,
        ProductID INT,
        QuantitySold INT,
        SaleDate DATE,
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
      )
    `);
    console.log("Tables created successfully.");

    // 2. Add column Category
    await db.execute(`ALTER TABLE Products ADD COLUMN Category VARCHAR(100)`);
    console.log("Category column added.");

    // 3. Remove column Category
    await db.execute(`ALTER TABLE Products DROP COLUMN Category`);
    console.log("Category column removed.");

    // 4. Change ContactNumber to VARCHAR(15)
    await db.execute(`ALTER TABLE Suppliers MODIFY ContactNumber VARCHAR(15)`);
    console.log("ContactNumber modified.");

    // 5. Add NOT NULL to ProductName
    await db.execute(`ALTER TABLE Products MODIFY ProductName VARCHAR(255) NOT NULL`);
    console.log("ProductName set to NOT NULL.");

    // 6a. Insert supplier FreshFoods
    const [supplierResult] = await db.execute(
      `INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)`,
      ['FreshFoods', '01001234567']
    );
    console.log("Supplier inserted with ID:", supplierResult.insertId);

    // 6b. Insert products
    const [milk] = await db.execute(
      `INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)`,
      ['Milk', 15.00, 50, supplierResult.insertId]
    );
    const [bread] = await db.execute(
      `INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)`,
      ['Bread', 10.00, 30, supplierResult.insertId]
    );
    const [eggs] = await db.execute(
      `INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)`,
      ['Eggs', 20.00, 40, supplierResult.insertId]
    );
    console.log("Products inserted.");

    // 6c. Insert sale of Milk
    await db.execute(
      `INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)`,
      [milk.insertId, 2, '2025-05-20']
    );
    console.log("Sale inserted.");

    // 7. Update Bread price
    await db.execute(`UPDATE Products SET Price = ? WHERE ProductName = ?`, [25.00, 'Bread']);
    console.log("Bread price updated.");

    // 8. Delete Eggs
    await db.execute(`DELETE FROM Products WHERE ProductName = ?`, ['Eggs']);
    console.log("Eggs deleted.");

    // 9. Total quantity sold per product
    const [salesTotals] = await db.execute(`
      SELECT ProductID, SUM(QuantitySold) AS TotalSold
      FROM Sales GROUP BY ProductID
    `);
    console.log("Total quantity sold:", salesTotals);

    // 10. Product with highest stock
    const [highestStock] = await db.execute(`
      SELECT ProductName, StockQuantity
      FROM Products ORDER BY StockQuantity DESC LIMIT 1
    `);
    console.log("Highest stock product:", highestStock);

    // 11. Suppliers starting with F
    const [suppliersF] = await db.execute(`
      SELECT * FROM Suppliers WHERE SupplierName LIKE 'F%'
    `);
    console.log("Suppliers starting with F:", suppliersF);

    // 12. Products never sold
    const [unsold] = await db.execute(`
      SELECT ProductName FROM Products
      WHERE ProductID NOT IN (SELECT ProductID FROM Sales)
    `);
    console.log("Unsold products:", unsold);

    // 13. Sales with product name and date
    const [salesDetails] = await db.execute(`
      SELECT s.SaleID, p.ProductName, s.SaleDate
      FROM Sales s JOIN Products p ON s.ProductID = p.ProductID
    `);
    console.log("Sales details:", salesDetails);

    // 14. Create user store_manager
    await db.execute(`
      CREATE USER IF NOT EXISTS 'store_manager'@'localhost' IDENTIFIED BY 'password123'
    `);
    await db.execute(`
      GRANT SELECT, INSERT, UPDATE ON retail_db.* TO 'store_manager'@'localhost'
    `);
    console.log("User store_manager created and granted permissions.");

    // 15. Revoke UPDATE
    await db.execute(`
      REVOKE UPDATE ON retail_db.* FROM 'store_manager'@'localhost'
    `);
    console.log("UPDATE permission revoked.");

    // 16. Grant DELETE on Sales
    await db.execute(`
      GRANT DELETE ON retail_db.Sales TO 'store_manager'@'localhost'
    `);
    console.log("DELETE permission granted on Sales.");

    await db.end();
  } catch (error) {
    console.error("Error setting up database:", error);
  }
}

main();
