// server.js
const express = require('express');
const sql = require('mssql');
const app = express();
const port = 3000;

// Database connection configuration
const dbConfig = {
    user:  process.env.DB_USER, //'${DB_USER}',       // Replace with your database username
    password: process.env.DB_PASSWORD, //'${DB_PASSWORD}',   // Replace with your database password
    server: process.env.DB_HOST, //'${DB_HOST}',         // Replace with your database server
    database: process.env.DB_NAME,
    trustServerCertificate: true,
};

// Set the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', __dirname);
app.use(express.urlencoded({ extended: true }));

// Route handler for the HTML page
app.get('/', (req, res) => {
  // Establish a connection to the database
  sql.connect(dbConfig, (err) => {
    if (err) {
      console.log('Database connection failed:', err);
      return res.status(500).send('Database connection failed');
    }

    // Create a SQL query
    const query = 'SELECT * FROM users';

    // Execute the query
    new sql.Request().query(query, (err, result) => {
      if (err) {
        console.log('Query execution failed:', err);
        sql.close();
        return res.status(500).send('Query execution failed');
      }

      // Render the EJS template with the retrieved data
      res.render('index', { data: result.recordset });
      console.log(result.recordset)

      // Close the database connection
      sql.close();
    });
  });
});
app.post('/insert', (req, res) => {
    console.log(req.body.id)
    const id = req.body.id;
    const name = req.body.name;
  
    // Establish a connection to the database
    sql.connect(dbConfig, (err) => {
      if (err) {
        console.log('Database connection failed:', err);
        return res.status(500).send('Database connection failed');
      }
  
      // Create a SQL query to insert data
      const query = `INSERT INTO users (userid, username) VALUES ('${id}', '${name}')`;
  
      // Execute the query
      new sql.Request().query(query, (err) => {
        if (err) {
          console.log('Query execution failed:', err);
          sql.close();
          return res.status(500).send('Query execution failed');
        }
  
        // Redirect back to the main page after successful insertion
        res.redirect('/');
  
        // Close the database connection
        sql.close();
      });
    });
  });
  app.post('/update', (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
  
    // Establish a connection to the database
    sql.connect(dbConfig, (err) => {
      if (err) {
        console.log('Database connection failed:', err);
        return res.status(500).send('Database connection failed');
      }
  
      // Create a SQL query to update data
      const query = `UPDATE users SET username = '${name}' WHERE userid = '${id}'`;
  
      // Execute the query
      new sql.Request().query(query, (err) => {
        if (err) {
          console.log('Query execution failed:', err);
          sql.close();
          return res.status(500).send('Query execution failed');
        }
  
        // Redirect back to the main page after successful update
        res.redirect('/');
  
        // Close the database connection
        sql.close();
      });
    });
  });
  app.post('/delete', (req, res) => {
    const id = req.body.id;
  
    // Establish a connection to the database
    sql.connect(dbConfig, (err) => {
      if (err) {
        console.log('Database connection failed:', err);
        return res.status(500).send('Database connection failed');
      }
  
      // Create a SQL query to delete data
      const query = `DELETE FROM users WHERE userid = '${id}'`;
  
      // Execute the query
      new sql.Request().query(query, (err) => {
        if (err) {
          console.log('Query execution failed:', err);
          sql.close();
          return res.status(500).send('Query execution failed');
        }
  
        // Redirect back to the main page after successful deletion
        res.redirect('/');
  
        // Close the database connection
        sql.close();
      });
    });
  });
  
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
