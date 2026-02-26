import client from "@/db/dbClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  const clientDb = await client.connect();
  const db = clientDb.db("TodoCollection");
  const collection = db.collection("todos");
  const { title } = await req.json();
  const addTodo = await collection.insertOne({ title: title });
  console.log("body", req);

  return NextResponse.json({
    message: "Post OK",
    insertedId: addTodo.insertedId,
  });
}
