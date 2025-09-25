import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-gray-600">Please choose an option to continue</p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/login"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition duration-200 block text-center"
          >
            Login
          </Link>
          
          <Link 
            href="/signup"
            className="w-full border border-gray-300 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition duration-200 block text-center"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}