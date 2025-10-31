'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { useAuth } from "@/app/components/ProductedRoute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import toast from "react-hot-toast";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const ProfileEditPage = () => {
      const {authUser, isLoading} = useAuth();
      const router = useRouter();
      const queryClient = useQueryClient();
  type UserInput = {
    username: string,
    email: string,
    oldPassword: string,
    newPassword: string
  }

  const [formData, setFormData] = useState<UserInput>({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: ""
  })
    
    
  // 1. Fetch all notes from backend
  useEffect(() => {
    formData.username = authUser?.username || '';
    formData.email = authUser?.email || ''
  }, [authUser]);

  const {mutate: updateProfile, isPending, isError, error} = useMutation<unknown, Error, UserInput>({
      mutationFn: async ({username, email, oldPassword, newPassword}) => {
        try {
          const res = await fetch(`${api}/api/user/update`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({username, email, oldPassword, newPassword})
          })

          const data = await res.json();

          console.log(data);

          if(!res.ok) {
            throw new Error(data.error || "something went wrong")
          }
        } catch (error) {
          throw error;
        }
      }, 
      onSuccess: () => {
        toast.success("User updated successfully");
        queryClient.invalidateQueries({
          queryKey: ["authUser"]
        })
        router.push('/notes')
      }
    })

  const editUser = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    updateProfile(formData);
  }

  const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]:value})
      }

//   // 3. Render the note
  // if () return <p>Loading...</p>;
  return (
    <form onSubmit={editUser}>
      <h1 className="text-2xl font-bold mb-3">Profile Edit</h1>
      <input
        type="text"
        name="username"
        className="border p-2 w-full mb-2 rounded"
        placeholder="Username"
        value={formData.username}
        onChange={handleInputChanges}
      />
      <input
      type="email"
      name="email"
        className="border p-2 w-full mb-2 rounded"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChanges}
      />
      <input
      type="password"
      name="oldPassword"
        className="border p-2 w-full mb-2 rounded"
        placeholder="Old Password"
        value={formData.oldPassword}
        onChange={handleInputChanges}
      />
      <input
      type="password"
      name="newPassword"
        className="border p-2 w-full mb-2 rounded"
        placeholder="New Password"
        value={formData.newPassword}
        onChange={handleInputChanges}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending ? <LoadingSpinner size={20} color='white' />: "Edit"}
      </button>
      {isError && <p className="text-red-400">{error.message}</p>} 
    </form>
  );
}

export default ProfileEditPage;