import { DB } from "../config/database";
import { Pool } from 'pg';
const pool = new Pool({
  connectionString: DB
});

const dropping = async () => {
  const userMigration = `DROP TABLE IF EXISTS users CASCADE`;
  const chatMigration = `DROP TABLE IF EXISTS chats CASCADE`;
  try {
    await pool.query(userMigration);
    await pool.query(chatMigration);
    return 'Tables dropped';
  } catch (err) {
    return `${err}, Dropped failed`;
  }
};
const usersTable = `CREATE TABLE users(
    id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(80) UNIQUE NOT NULL
  );`;
const chatsTable = `CREATE TABLE chats(
    id SERIAL PRIMARY KEY NOT NULL,
    username varchar(255) REFERENCES users(username) NOT NULL,
    text varchar(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
  );`;
const createAllTables = async () => {
  try {
    await pool.query(usersTable);
    await pool.query(chatsTable);
    return 'created'
  } catch (err) {
    return `creation failed`;
  }
};

const forumTables = async () => {
  await dropping();
  await createAllTables();
  await process.exit(0);
};
forumTables();

