declare global {
    var mongoose: any;
}

import * as mongoose from "mongoose";

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
	throw new Error("Please define the DB_URL environment variable");
}


let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async (): Promise<typeof mongoose> => {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {

		cached.promise = mongoose.connect(DB_URL).then((mongoose) => {
			return mongoose;
		});
	}
	cached.conn = await cached.promise;
	return cached.conn;
};

export default dbConnect;