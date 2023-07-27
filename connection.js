require("dotenv").config();
const mysql = require('mysql2');
var mysqlConnection = mysql.createConnection({
    host:process.env.DBHOST,
    user:process.env.DBUSER,
    password:process.env.DBPASSWORD,
    database:process.env.DBDATABASE
})
mysqlConnection.connect((err)=>{
    if(err){
        console.log("Error in DB connection : "+JSON.stringify(err,undefined,2));
    }else{
        console.log("DB connected successfully")
    }
})
module.exports = mysqlConnection;