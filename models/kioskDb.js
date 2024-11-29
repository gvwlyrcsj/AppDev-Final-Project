// combined.js
const mysql = require('mysql2');

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_users', // Change this to your actual database name if necessary
});

// Function to update stock levels based on orders
function updateStockLevels(orders) {
    return new Promise((resolve, reject) => {
        const updates = orders.map(order => {
            let quantityUpdate = [];
            let sizeAdjustment = 0;

            // Adjust stock based on size
            switch (order.size) {
                case 'small':
                    sizeAdjustment = 10;
                    break;
                case 'medium':
                    sizeAdjustment = 15;
                    break;
                case 'large':
                    sizeAdjustment = 20;
                    break;
                case 'xl':
                    sizeAdjustment = 25;
                    break;
                default:
                    sizeAdjustment = 10; // Default adjustment for unrecognized size
            }

            quantityUpdate.push({
                name: order.name,
                description: 'Milktea', // Adjust as necessary
                quantity: sizeAdjustment * order.quantity,
                unit: 'grams',
            });

            quantityUpdate.push({
                name: 'Cup',
                description: order.size, // The size (small, medium, large, xl)
                quantity: order.quantity,
                unit: 'pieces',
            });

            quantityUpdate.push({
                name: 'Straw',
                description: 'Straw',
                quantity: order.quantity,
                unit: 'pieces',
            });

            quantityUpdate.push({
                name: 'Selecta Fram Fresh',
                description: 'Milk',
                quantity:
                    order.size === 'small'
                        ? 100
                        : order.size === 'medium'
                        ? 150
                        : order.size === 'large'
                        ? 200
                        : 250,
                unit: 'ml',
            });

            return quantityUpdate;
        });

        // Perform all updates in the database
        updates.forEach(update => {
            update.forEach(item => {
                const query =
                    'UPDATE addproducts SET quantity_in_stock = quantity_in_stock - ? WHERE name = ? AND description = ? AND unit = ?';
                connection.query(query, [item.quantity, item.name, item.description, item.unit], (err, result) => {
                    if (err) {
                        reject(err);
                    }
                });
            });
        });

        resolve();
    });
}

// Function to save order to the database (inserting into korders and korder_items)
function saveOrderToDatabase(orderData, totalAmount, dineOutOption) {
    return new Promise((resolve, reject) => {
        // Insert the main order into korders table
        const queryOrder = 'INSERT INTO korders (ktotal_amount, kdine_out) VALUES (?, ?)';

        connection.query(queryOrder, [totalAmount, dineOutOption], (err, results) => {
            if (err) {
                return reject(err);
            }

            const korderId = results.insertId; // Get the ID of the inserted order
            const orderItemsPromises = orderData.map(order => {
                const queryItem =
                    'INSERT INTO korder_items (korder_id, korder_num, kproductname, ksize, kquantity, kprice) VALUES (?, ?, ?, ?, ?, ?)';
                return new Promise((resolveItem, rejectItem) => {
                    connection.query(
                        queryItem,
                        [korderId, order.orderNumber, order.name, order.size, order.quantity, order.price],
                        (errItem, resultsItem) => {
                            if (errItem) {
                                rejectItem(errItem);
                            } else {
                                resolveItem(resultsItem);
                            }
                        }
                    );
                });
            });

            // Wait for all items to be inserted
            Promise.all(orderItemsPromises)
                .then(() => resolve('Order placed successfully!'))
                .catch(err => reject(err));
        });
    });
}

// Export both functions to be used in other modules
module.exports = { updateStockLevels, saveOrderToDatabase };
