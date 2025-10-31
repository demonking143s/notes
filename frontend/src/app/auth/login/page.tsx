'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { User } from '@/app/lib/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/app/components/LoadingSpinner';

const LogInPage = () => {
  type UserInput = {
    input: string;
    password: string;
  }
  const queryClient = useQueryClient();
    const router = useRouter();
    const [formData, setFormdata] = useState<UserInput>({
      input: "",
      password: ""
    })

    const {mutate: login, isPending, isError, error} = useMutation<unknown, Error, UserInput>({
      mutationFn: async ({input, password}) => {
        try {
          const res = await fetch(`${api}/api/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({input,password})
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
        toast.success("User successfully logged");
        queryClient.invalidateQueries({
          queryKey: ["authUser"]
        })
        router.push('/notes')
      }
    })

    const logInUser = (e: React.FormEvent) => {
      e.preventDefault();
      console.log(formData);
      login(formData);
    }

    const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
          const {name, value} = e.target;
          setFormdata({...formData, [name]:value})
        }

  return (
    <form onSubmit={logInUser}>
      <h1 className="text-2xl font-bold mb-3">Login</h1>
      <input
        type='text'
        name='input'
        className="border p-2 w-full mb-2 rounded"
        placeholder="Username or Email"
        value={formData.input}
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
      <p>Don't have account? <span className='text-blue-500' onClick={()=>router.push('/auth/signup')}>signup</span></p>
      <button
        type='submit'
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending? <LoadingSpinner size={20} color='white' />:"log in"}
      </button>
      {isError && <p className='text-red-400'>{error.message}</p>}
    </form>
  )
}

export default LogInPage