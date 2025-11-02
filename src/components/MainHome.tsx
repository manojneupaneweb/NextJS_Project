"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Add from './Add';

interface Todo {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  createdAt: string;
}

function MainPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos from API
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/note/get');
      
      console.log('Full API Response:', response); // Debug log
      console.log('Response Data:', response.data); // Debug log

      // Handle different response structures
      let todosData: any = response.data;
      
      // If response has a data property (common in APIs)
      if (response.data && response.data.data !== undefined) {
        todosData = response.data.data;
      }
      
      // If response has a success property
      if (response.data && response.data.success && response.data.data !== undefined) {
        todosData = response.data.data;
      }

      // If it's a string, try to parse it as JSON
      if (typeof todosData === 'string') {
        try {
          todosData = JSON.parse(todosData);
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', parseError);
        }
      }

      // Ensure we have an array
      if (Array.isArray(todosData)) {
        setTodos(todosData);
      } else if (todosData && typeof todosData === 'object') {
        // If it's a single todo object, wrap it in an array
        setTodos([todosData]);
      } else {
        console.warn('Unexpected response format. Expected array but got:', typeof todosData, todosData);
        setTodos([]);
      }
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Failed to load todos. Please try again.');
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Delete todo function
  const handleDelete = async (id: number) => {
    try {
      // Remove from local state immediately (optimistic update)
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      
      // Optional: Call API to delete from server
      // await axios.delete(`/api/note/delete?id=${id}`);
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo.');
      // Re-fetch to sync with server if delete failed
      fetchTodos();
    }
  };

  // Refresh todos
  const handleRefresh = () => {
    fetchTodos();
  };

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <Add />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading todos...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <Add />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-red-700 font-medium">Error loading todos</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Add />
      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Todo List</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                console.log('Current todos state:', todos);
                console.log('Todos type:', typeof todos);
                console.log('Is array:', Array.isArray(todos));
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm transition-colors"
            >
              Debug
            </button>
          </div>
        </div>

        {!todos || todos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">No todos found.</p>
            <p className="text-gray-400 mt-2">Create your first todo using the form above!</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {todos.map((todo) => (
              <li 
                key={todo.id} 
                className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-semibold text-gray-800">{todo.title}</h2>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        todo.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : todo.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {todo.priority}
                      </span>
                    </div>
                    
                    {todo.description && (
                      <p className="text-gray-600 mb-3">{todo.description}</p>
                    )}
                    
                    <div className="text-sm text-gray-500 flex flex-wrap gap-4">
                      <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                        {todo.category}
                      </span>
                      <span>
                        Created: {new Date(todo.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex space-x-2">
                    <a 
                      href={`/edit-todo?id=${todo.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition-colors"
                    >
                      Edit
                    </a>
                    <button 
                      onClick={() => handleDelete(todo.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default MainPage;