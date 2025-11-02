import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const connection = await pool.getConnection();
    
    let query: string;
    let params: string[];
    
    if (id) {
      // Get single todo
      query = 'SELECT * FROM todos WHERE id = ?';
      params = [id];
    } else {
      // Get all todos
      query = 'SELECT * FROM todos ORDER BY createdAt DESC, id DESC';
      params = [];
    }
    
    const [rows] = await connection.execute(query, params);
    connection.release();

    if (id) {
      // Single todo response
      const todo = Array.isArray(rows) ? rows[0] : null;
      if (!todo) {
        return NextResponse.json(
          { success: false, error: 'Todo not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: todo });
    } else {
      // All todos response
      return NextResponse.json({ success: true, data: rows });
    }

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch todos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}