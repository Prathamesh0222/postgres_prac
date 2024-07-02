import { Client } from "pg";
import { DB_URL } from "./config";

const client = new Client({
    connectionString: DB_URL,
})


async function createUsersTable() {
    await client.connect();
    const result = await client.query(`
        CREATE TABLE users {
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        }
        `)
    console.log(result);
}

async function relation() {
    await client.connect;
    const result = await client.query(`
        CREATE TABLE admin(
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
        )
        CREATE TABLE addresses(
        id SERIAL PRIMARY KEY,
        admin_id INTEGER NOT NULL,
        city VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        street VARCHAR(255) NOT NULL,
        pincode VARCHAR(20);
        created at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE CASADE
        )
        `)
    console.log(result);
}


//Insecure way of storing data in the tables
// async function insertUsersTable() {
//     await client.connect();
//     const result = await client.query(`
//         INESERT INTO users (title, description, check)
//         VALUES ("Todo","go to gym","true")
//         `)
// }

//better way of storing data in the tables

type Users = {
    email: string,
    username: string,
    password: string
}

async function insertUsersTable(users: Users) {
    await client.connect();
    const insertQuery = "INSERT INTO users (username,email,password) VALUES($1,$2,$3)"
    const values = [users.username, users.email, users.password];
    const res = await client.query(insertQuery, values);
    console.log("Insertion success:", res);
}


async function getUser(email: string) {
    try {
        await client.connect();
        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];
        const result = await client.query(query, values);
        if (result.rows.length > 0) {
            console.log('User found:', result.rows[0])
            return result.rows[0];
        } else {
            console.log('No user found with the given email.');
            return null;
        }
    } catch (e) {
        console.error('Error during fetching user:', e);
        throw e;
    } finally {
        await client.end();
    }

}

createUsersTable();

insertUsersTable({
    username: "prathhost",
    email: 'prath22@gmail.com',
    password: '1243213'
});

getUser('prath22@gmail.com').catch(console.error);

