import pool from "@/lib/db";
import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";

// GET all todos
export async function GET() {
  const [rows] = await pool.query("SELECT * FROM todos");
  return NextResponse.json(rows);
}

// POST a new todo
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, category, priority, createdAt } = body;

    if (!title || !createdAt) {
      return NextResponse.json({ message: "Title and createdAt are required" }, { status: 400 });
    }

    const [result] = await pool.query(
      "INSERT INTO todos (title, description, category, priority, createdAt) VALUES (?, ?, ?, ?, ?)",
      [title, description, category, priority, createdAt]
    ) as unknown as [ResultSetHeader, unknown];

    return NextResponse.json({ message: "Todo added successfully", id: result.insertId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
