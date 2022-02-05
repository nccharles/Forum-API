import "dotenv/config";
import { Pool } from "pg";
import { DB } from "../config/database";
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

const dataCreate = async (table, columns, values) => {
  const queryString = `INSERT INTO ${table} (${columns}) VALUES (${values}) RETURNING *;`;
  const { rows: Result } = await pool.query(queryString);
  return Result[0];
};

const getChats = async (columns) => {

  const query = `SELECT ${columns} FROM chats;`;
  const { rows } = await pool.query(query);
  return rows;
}
const getUsers = async (username="") => {
  let query = `SELECT * FROM users;`;
  if(username){
    query=`SELECT * FROM users WHERE username='${username}';`;
  }
  const { rows } = await pool.query(query);
  return rows;
}
const getRooms = async (columns) => {

   const query = `SELECT ${columns} FROM rooms;`;
   const { rows } = await pool.query(query);
   return rows;
 }
 const getRoomChats = async (a,b) => {

   const query = `SELECT * FROM rooms WHERE name='${a}' or name='${b}';`;
   let { rows } = await pool.query(query);
   if(rows.length){
   const chatquery = `SELECT * FROM chats where room=${rows[0].id};`;
   const data = (await pool.query(chatquery)).rows; 
   rows[0].chats=data
   }
   return rows[0] || [];
 }

export default { query,getRoomChats,getRooms,getUsers, getChats,dataCreate };
