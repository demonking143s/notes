'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import { Note } from "@/app/lib/notes";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

const NotesPage = () => {

    const {data: notes} = useQuery<unknown, Error, Note[]>({
        queryKey: ["notes"],
        queryFn: async () => {
            try {
                const res = await fetch(`${api}/api/notes/view`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-type": 'application/json'
                    }
                })
                const data = await res.json();
                console.log(data);
                if(!res.ok){
                    throw new Error (data.error || "something went wrong")
                }
                return data;
            } catch (error) {
                throw error;
            }
        }
    })

  return (
    <div>
        <h1 className="text-3xl text-white mb-4">Home</h1>
        {notes?.length === 0 ? (
            <p>No more notes</p>
        ) : (<ul className="space-y-3">
            {notes?.map((note)=>
                <li className="bg-white p-3 rounded shadow" key={note._id}>
                    <Link href={`notes/${note._id}`} className="font-semibold text-blue-600">
                        {note.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                        {new Date (note.createdAt).toLocaleString()}
                    </p>
                </li>
            )}
            </ul>)
            }
    </div>
  )
}

export default NotesPage;