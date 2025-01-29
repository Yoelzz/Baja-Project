const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let tempData = { host: "127.0.0.1", user: "elz", password: "Just4jesus!", database: "test data" };

function createConnection(sqlData) {
    const db = mysql.createConnection({
        host: sqlData.host,
        user: sqlData.user,
        password: sqlData.password,
        database: sqlData.database
    });

    db.connect((err: any) => {
        if (err) {
            console.error("Database connection failed: ", err);
            return;
        }
        console.log("Connected to MySQL database.");
    });
    return db;
}

app.post("/execute-sql", (req: any, res: any) => {
    const { table, data, dbSQL }: { table: string; data: Object; dbSQL: string } = req.body;
    if (!table) {
        return res.status(400).send("No table specified.");
    };

    tempData.database = dbSQL;
    const db = createConnection(tempData);

    const columns: string = Object.keys(data).map((val) => `\`${val}\``).join(", ");
    const values: string = Object.values(data).map((val) => val).join(", ");
    const query: string = `INSERT INTO \`${table}\` (${columns}) VALUES (${values})`;

    db.query(query, (err: string, results: any) => {
        if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).send("Query execution failed.");
        }
        res.status(200).json({ message: "Data inserted successfully", results });
    });
});

app.post("/read-sql", (req: any, res: any) => {
  const { table, data, dbSQL }: { table: string; data: Object; dbSQL: string } = req.body;
  if (!table) {
      return res.status(400).send("No table specified.");
  };

  tempData.database = dbSQL;
  const db = createConnection(tempData);
  const keys = data["selectKeys"].length == 0 ? "*" :data["selectKeys"].map((val) => `\`${val}\``).join(", ");
  const where: string = data["where"] ? ` WHERE ${data["where"]}` : "";

  const query = `SELECT ${keys} FROM \`${table}\`` + where;

  db.query(query, (err: string, results: any) => {
      if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).send("Query execution failed.");
      }
      res.status(200).json({ message: "Data successfully fetched", results });
  });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
