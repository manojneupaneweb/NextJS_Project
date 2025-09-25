'use client'
import axios from 'axios';
import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';


type UserData = {
  _id: string;
  username: string;
  email: string;
} | null;

function Page() {
  const router = useRouter();
  const [userData, setUserData] = React.useState<UserData>(null);

  const handleLogout = async () => {
    try {
      const response = await axios.get('/api/users/logout');
      if (response.status === 200) {
        toast.success("Logged out successfully");
        router.push('/');
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error("Failed to fetch user data", error);
      toast.error("Failed to fetch user data");
    }
  }
  const handleUserData = async () => {
    try {
      const response = await axios.get('/api/users/me');
      setUserData(response.data.user);
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed");
    }
  }
  useEffect(() => {
    handleUserData();
  },[])
  return (
    <div className="min-h-screen flex items-center flex-col justify-center bg-gray-100">
      <Toaster />
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Profile Page</h1>
        <p className="text-gray-600 text-center">This is the profile page content.</p>
        <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          onClick={handleLogout}
        >Logout</button>
      </div>

      <div className='mt-20'>
        <p>Id : {userData?._id}</p>
        <p>Username : {userData?.username}</p>
        <p>Email : {userData?.email}</p>
      </div>
    </div>
  )
}

export default Page