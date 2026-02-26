import client from "@/db/dbClient";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req) {
  try {
    const clientDb = await client.connect();
    const db = clientDb.db("TodoCollection");
    const collection = db.collection("todos");

    const body = await req.json();
    const { id, title } = body;

    if (!id || !title) {
      return NextResponse.json(
        { error: "ID and title are required" },
        { status: 400 }
      );
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title: title } }
    );

    return NextResponse.json({
      message: "Updated successfully",
      modifiedCount: result.modifiedCount,
      "id":id
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}