'use client';

import { useParams, useRouter } from "next/navigation";
import { useState} from 'react';
import Link from "next/link";
import { User } from "../lib/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuth } from "../components/ProductedRoute";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const ProfilePage = () => {
    const {authUser, isLoading} = useAuth();
    const username = authUser?.username;
    const queryClient = useQueryClient();
    const router = useRouter();

      const {data: user} = useQuery<unknown, Error, User>({
      queryKey: ["userProfile"],
      queryFn: async () => {
        try {
          const res = await fetch(`${api}/api/user/profile/${username}`,{
            method: "GET",
            credentials: "include",
            headers: {
              "Content-type": "application/json"
            }
          })
          const data = await res.json();

          console.log(data);

          if(!res.ok) {
            throw new Error(data.error || "something went wrong")
          }

          return data;
        } catch (error) {
          throw error;
        }
      }
    })

    const {mutate: logout, isError, error} = useMutation({
      mutationFn: async () => {
        try {
          const res = await fetch(`${api}/api/auth/logout`,{
            method: "POST",
            credentials: "include"
          })
          const data = await res.json();
          console.log(data);
          if(!res.ok) {
            throw new Error (data.error || "something went wrong")
          }
        } catch (error) {
          throw error;
        }
      },
      onSuccess: () => {
        toast.success("logout successfully")
        queryClient.invalidateQueries({
          queryKey: ["logout"]
        })
        router.push("/auth/login")
      }
    })
    
    const handleLogOut = () => {
      logout();
    }

  // 3. Render the note
  if (!user) return <p><LoadingSpinner size={20} color='white' /></p>;
    return (
        <div>
            <h3 className="text-2xl font-bold">{user?.username}</h3>
            <p>{user?.email}</p>
            <div className="mt-2">
                <Link href={`profile/edit`} className="btn bg-gray-400 px-4 py-2 mt-2 rounded text-black font-bold">edit</Link>
                <button type="button" className="btn bg-red-400 px-4 py-2 mt-2 ml-2 rounded text-black font-bold" onClick={handleLogOut}>log out</button>
            </div>
        </div>
    );
}

export default ProfilePage;