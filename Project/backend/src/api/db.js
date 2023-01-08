const { Pool } = require("pg");

const pool = new Pool({
    database: "kyue",
    host: "localhost",
    user: "pg",
    password: "pgid1212",
    port: 5432,
});

module.exports = {
    connect: async () => {
		try {
			await pool.connect();
		} catch (error) {
			console.error('Failed to connect', error);
		}
    },
    query: async (sql) => {
		try {
			return await pool.query(sql);
		} catch (error) {
			throw error
		}
    },
};
