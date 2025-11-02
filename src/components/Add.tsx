"use client"
import axios from 'axios';
import type { FormEvent } from 'react'
import { useState } from 'react';

interface TodoData {
  title: string;
  description: string;
  category: string;
  priority: string;
  createdAt: string;
}

function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Validate and prepare data
    const newTodo: TodoData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      priority: formData.get('priority') as string,
      createdAt: formData.get('createdAt') as string,
    };

    // Basic validation
    if (!newTodo.title.trim() || !newTodo.category || !newTodo.priority || !newTodo.createdAt) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/note/add', newTodo);
      
      if (response.status === 201) {
        alert('Todo added successfully!');
        // Reset form
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error('Failed to create todo');
      }
    } catch (err) {
      console.error('Error creating todo:', err);
      setError(err instanceof Error ? err.message : 'Failed to add todo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Set default date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Add New Todo</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter todo title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            minLength={1}
            maxLength={100}
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
            rows={3}
            placeholder="Enter todo description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            maxLength={500}
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
            defaultValue={today}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding...' : 'Add Todo'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Page