import client from "@/db/dbClient";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(req) {
  try {
    const clientDb = await client.connect();
    const db = clientDb.db("TodoCollection");
    const collection = db.collection("todos");

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({
      message: "Deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
