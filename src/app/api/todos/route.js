import client from "@/db/dbClient";
import clientPromise from "@/db/dbClient";
import { NextResponse } from "next/server";

export async function GET(req) {
  try{
    const clientDb= await client.connect();
    const db = clientDb.db("TodoCollection");
    const collection = db.collection("todos");
    const todosCollection=await collection.find({}).toArray();
    return NextResponse.json(todosCollection)
    }catch(err){
         return NextResponse.json({ error: "database connection failed" }, { status: 500 });
  }
  
}