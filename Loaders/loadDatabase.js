const mysql = require('mysql')

module.exports = async () => {

    let db = await mysql.createConnection({
        host: "45.59.162.17",
        user: "u15_zOUasv21vJ",
        password: "!DSPwDTxVPrJ6st!M!92=MJQ",
        database: "s15_V14"
        
    })

    return  db;
}