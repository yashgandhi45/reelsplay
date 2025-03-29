import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn: null, promise: null};
}

export async function dbConnect(){
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
    cached.promise = mongoose.connect(MONGODB_URI).then(()=>mongoose.connection);
    }
    try{
        cached.conn = await cached.promise;
    }catch{
        cached.promise = null;
        throw new Error("MongoDB connection failed");
    }
    return cached.conn;
}