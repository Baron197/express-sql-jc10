const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'saitama',
    password: 'abc123',
    database: 'tokoberkah',
    port: 3306,
    // multipleStatements: true
    // timezone: 'UTC'
})

module.exports = {
    sqlDB: db
}