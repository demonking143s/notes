'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { User } from '@/app/lib/users';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/app/components/LoadingSpinner';

const SignUpPage = () => {
  type UserInput = Pick<User, 'username' | 'email' | 'password' | 'role'>
    const router = useRouter();
    const queryClient = useQueryClient();
    const [formData, setFormdata] = useState<UserInput>({
      username: "",
      email: "",
      password: "",
      role: "user"
    })

    const {mutate: signup, isPending, isError, error} = useMutation<unknown, Error, UserInput>({
      mutationFn: async ({username, email, password, role}) => {
        try {
          const res = await fetch(`${api}/api/auth/signup`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({username, email, password, role})
          })

          const data = await res.json();

          console.log(data);

          if(!res.ok){
            throw new Error(data.error || "Something went wrong")
          }
        } catch (error) {
          throw error;
        }
      },
      onSuccess: () => {
        toast.success("User successfully created")
        queryClient.invalidateQueries({
          queryKey: ["authUser"]
        })
        router.push('/notes')
      }
    })

    const addNewUser = (e: React.FormEvent) => {
      e.preventDefault();
      console.log(formData)
      signup(formData);
    }

    const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setFormdata({...formData, [name]:value})
    }

  return (
    <form onSubmit={addNewUser}>
      <h1 className="text-2xl font-bold mb-3">Signup</h1>
      <input
        type="text"
        name='username'
        className="border p-2 w-full mb-2 rounded"
        placeholder="Username"
        value={formData.username}
        onChange={handleInputChanges}
      />
      <input
        type='email'
        name='email'
        className="border p-2 w-full mb-2 rounded"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChanges}
      />
      <input
        type='password'
        name='password'
        className="border p-2 w-full mb-2 rounded"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChanges}
      />
      <p>already have account? <span className='text-blue-500' onClick={()=>router.push("auth/login")}>login</span></p>
      <button
        type='submit'
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending? <LoadingSpinner size={20} color='white' /> : "signup"}
      </button>
      {isError && <p className='text-red-400'>{error.message}</p>}
    </form>
  )
}

export default SignUpPage