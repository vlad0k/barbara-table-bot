const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/tables.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

// db.run(`CREATE TABLE reserve(
//     id integer not null,
//     name text,
//     time text,
//     tablenum integer,
//     telephone text
//   )`);



db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
