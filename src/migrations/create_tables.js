import { DB } from "../config/database";
import { Pool } from 'pg';
const pool = new Pool({
  connectionString: DB
});

const dropping = async () => {
  const userMigration = `DROP TABLE IF EXISTS users CASCADE`;
  const chatMigration = `DROP TABLE IF EXISTS chats CASCADE`;
  const roomMigration = `DROP TABLE IF EXISTS rooms CASCADE`;
  try {
    await pool.query(userMigration);
    await pool.query(chatMigration);
    await pool.query(roomMigration);
    return 'Tables dropped';
  } catch (err) {
    return `${err}, Dropped failed`;
  }
};
const insertData = async () => {
  const roomInsert = `INSERT INTO rooms(name) 
  VALUES('devs')`;
  try {
    await pool.query(roomInsert);
    console.log("Data Inserted");
  } catch (err) {
    console.log(`${err}, Inserted failed`);
  }
};
const usersTable = `CREATE TABLE users(
    id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(80) UNIQUE NOT NULL
  );`;
  const roomsTable = `CREATE TABLE rooms(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(80) UNIQUE NOT NULL,
    participants varchar(255) ARRAY DEFAULT ARRAY['devs'],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );`;
const chatsTable = `CREATE TABLE chats(
    id SERIAL PRIMARY KEY NOT NULL,
    username varchar(255) REFERENCES users(username) NOT NULL,
    room INTEGER REFERENCES rooms(id) NOT NULL,
    text text NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );`;
const createAllTables = async () => {
  try {
    await pool.query(usersTable);
    await pool.query(roomsTable);
    await pool.query(chatsTable);
    return 'created'
  } catch (err) {
    return `creation failed`;
  }
};

const forumTables = async () => {
  await dropping();
  await createAllTables();
  await insertData();
  await process.exit(0);
};
forumTables();

