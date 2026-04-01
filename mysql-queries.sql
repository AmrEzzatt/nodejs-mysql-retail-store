-- 1. Create Tables

CREATE TABLE Suppliers (
    SupplierID INT AUTO_INCREMENT PRIMARY KEY,
    SupplierName TEXT,
    ContactNumber TEXT
);

CREATE TABLE Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName TEXT,
    Price DECIMAL(10,2),
    StockQuantity INT,
    SupplierID INT,
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
);

CREATE TABLE Sales (
    SaleID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT,
    QuantitySold INT,
    SaleDate DATE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- 2. Add Category Column
ALTER TABLE Products ADD Category VARCHAR(50);

-- 3. Remove Category Column
ALTER TABLE Products DROP COLUMN Category;

-- 4. Modify ContactNumber
ALTER TABLE Suppliers MODIFY ContactNumber VARCHAR(15);

-- 5. Add NOT NULL to ProductName
ALTER TABLE Products MODIFY ProductName TEXT NOT NULL;

-- 6. Inserts

-- a. Add Supplier
INSERT INTO Suppliers (SupplierName, ContactNumber)
VALUES ('FreshFoods', '01001234567');

-- b. Insert Products
INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID)
VALUES 
('Milk', 15.00, 50, 1),
('Bread', 10.00, 30, 1),
('Eggs', 20.00, 40, 1);

-- c. Add Sale
INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
VALUES (1, 2, '2025-05-20');

-- 7. Update Bread Price
UPDATE Products
SET Price = 25.00
WHERE ProductName = 'Bread';

-- 8. Delete Eggs
DELETE FROM Products
WHERE ProductName = 'Eggs';

-- 9. Total Quantity Sold per Product
SELECT p.ProductName, SUM(s.QuantitySold) AS TotalSold
FROM Products p
JOIN Sales s ON p.ProductID = s.ProductID
GROUP BY p.ProductName;

-- 10. Product with Highest Stock
SELECT * FROM Products
ORDER BY StockQuantity DESC
LIMIT 1;

-- 11. Suppliers Starting with 'F'
SELECT * FROM Suppliers
WHERE SupplierName LIKE 'F%';

-- 12. Products Never Sold
SELECT * FROM Products
WHERE ProductID NOT IN (
    SELECT ProductID FROM Sales
);

-- 13. Sales with Product Name
SELECT p.ProductName, s.SaleDate
FROM Sales s
JOIN Products p ON s.ProductID = p.ProductID;

-- 14. Create User and Grant Permissions
CREATE USER 'store_manager'@'localhost' IDENTIFIED BY 'password123';

GRANT SELECT, INSERT, UPDATE ON *.* TO 'store_manager'@'localhost';

-- 15. Revoke UPDATE
REVOKE UPDATE ON *.* FROM 'store_manager'@'localhost';

-- 16. Grant DELETE on Sales only
GRANT DELETE ON Sales TO 'store_manager'@'localhost';
