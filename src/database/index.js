import "dotenv/config";
import { Pool } from "pg";
import { DB } from "../config/database";
import { serverFeedback } from "../helpers/Feedback";
const pool = new Pool({
  connectionString: DB
});
const query = (text, params, isArr = false) => {

  return new Promise(async (resolve, reject) => {
    pool
      .query(text, params)
      .then(async  response => {
        const { rows } = response;
        isArr ? resolve(rows) : resolve(rows[0]);
        pool.end()
      })
      .catch(async err => {
        reject(err);
        pool.end()
      });
  });
};

const getSocketMessages = () => {
  return new Promise((resolve) => {
     pool.query(
        "SELECT * FROM chats ORDER BY id DESC LIMIT 10",
        (error, results) => {
           if (error) {
              throw error;
           }
           resolve(results.rows);
         }
     );
  });
};
const createSocketMessage = (message) => {
  return new Promise((resolve) => {
     pool.query(`INSERT INTO chats (username,text) VALUES ($1, $2) RETURNING *;`,
        [message.username,message.text],
        (error, results) => {
           if (error) {
              throw error;
           }
           resolve(results.rows);
        }
     );
  });
};

const dataCreate = async (res, table, columns, values) => {
  const queryString = `INSERT INTO ${table} (${columns}) VALUES (${values}) RETURNING *;`;
  const { rows: Result } = await pool.query(queryString);
  return serverFeedback(res, 201, ...['status', 201, 'message', 'success', 'data', Result[0]]);
};

const getChats = async (columns) => {

  const query = `SELECT ${columns} FROM chats;`;
  const { rows } = await pool.query(query);
  return rows;
}

export default { query, getChats, dataCreate,getSocketMessages,createSocketMessage };
