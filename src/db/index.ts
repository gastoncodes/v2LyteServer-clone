const mysql = require("mysql");

const connection = () => {
  const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    database: "v2lyte",
    user: "root",
    password: "",
  });

  db.connect(function (error: Error | null) {
    if (error) {
      console.error("Error connecting to database:", error);
    } else {
      console.log("Database is connected");
    }
  });
};

export default connection;
