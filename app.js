const express = require("express");
const mysql   = require("mysql");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js

//routes
app.get("/", async function(req, res){

  let categories = await getCategories();
  //console.log(categories);
  res.render("index", {"categories":categories});

});//root

app.get("/quotes", async function(req, res){

  let rows = await getQuotes(req.query);
  res.render("quotes", {"records":rows});

});//quotes

function getQuotes(query){
    
    let keyword = query.keyword;
    
    let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = `SELECT quote, firstName, lastName, category FROM q_quotes
                      NATURAL JOIN q_author
                      WHERE 
                      quote LIKE '%${keyword}%'`;
        
           if (query.category) { //user selected a category
              sql += " AND category = '" + query.category + "'";
           }
        
           console.log("SQL:", sql)
           conn.query(sql, function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              resolve(rows);
           });
        
        });//connect
    });//promise
    
}//getQuotes


function getCategories(){
    
    let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = `SELECT DISTINCT category 
                      FROM q_quotes
                      ORDER BY category`;
        
           conn.query(sql, function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              resolve(rows);
           });
        
        });//connect
    });//promise
    
}//getQuotes

app.get("/dbTest", function(req, res){

    let conn = dbConnection();
    
    conn.connect(function(err) {
       if (err) throw err;
       console.log("Connected!");
    
       let sql = "SELECT * FROM q_author WHERE sex = 'F'";
    
       conn.query(sql, function (err, rows, fields) {
          if (err) throw err;
          res.send(rows);
       });
    
    });

});//dbTest

//values in red must be updated
function dbConnection(){

   let conn = mysql.createConnection({
                 host: "cst336db.space",
                 user: "cst336_dbUser",
             password: "secret19",
             database: "cst336_db"
       }); //createConnection

return conn;

}




//starting server
app.listen(process.env.PORT, process.env.IP, function(){
console.log("Express server is running...");
});