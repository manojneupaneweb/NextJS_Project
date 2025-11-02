"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

interface Todo {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  createdAt: string;
}

function EditTodoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const todoId = searchParams.get('id');

  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch todo data
  useEffect(() => {
    const fetchTodo = async () => {
      if (!todoId) {
        setError('No todo ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`/api/note/get?id=${todoId}`);
        
        // Handle different response structures
        let todoData = response.data;
        if (response.data && response.data.data) {
          todoData = response.data.data;
        }
        if (response.data && response.data.success && response.data.data) {
          todoData = response.data.data;
        }

        if (todoData) {
          setTodo(todoData);
        } else {
          setError('Todo not found');
        }
      } catch (err) {
        console.error('Error fetching todo:', err);
        setError('Failed to load todo. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [todoId]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!todo) return;
    
    const { name, value } = e.target;
    setTodo(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!todo || !todoId) return;

    try {
      setSaving(true);
      setError(null);

      // Update the todo via API
      const response = await axios.put(`/api/note/edit?id=${todoId}`, todo);

      if (response.data.success) {
        // Redirect back to main page or show success message
        router.push('/');
      } else {
        throw new Error(response.data.error || 'Failed to update todo');
      }
    } catch (err) {
      console.error('Error updating todo:', err);
      setError(err instanceof Error ? err.message : 'Failed to update todo. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading todo...</p>
        </div>
      </div>
    );
  }

  if (error && !todo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Edit Todo</h1>
            <p className="text-gray-600 text-sm mt-1">Update your todo details</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={todo?.title || ''}
                onChange={handleInputChange}
                placeholder="Enter todo title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={todo?.description || ''}
                onChange={handleInputChange}
                placeholder="Enter todo description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            {/* Category Field */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={todo?.category || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a category</option>
                <option value="work">Work</option>
                <option value="shopping">Shopping</option>
                <option value="health">Health</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Priority Field */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                id="priority"
                name="priority"
                value={todo?.priority || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Created At Field */}
            <div>
              <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700 mb-2">
                Created At *
              </label>
              <input
                type="date"
                id="createdAt"
                name="createdAt"
                value={todo?.createdAt || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Update Todo'}
              </button>
            </div>
          </form>
        </div>

        {/* Debug Info (remove in production) */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h3>
          <pre className="text-xs text-gray-600">
            Todo ID: {todoId}
            {'\n'}
            Current Data: {JSON.stringify(todo, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default EditTodoPage;