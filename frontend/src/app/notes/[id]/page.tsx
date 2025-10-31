'use client';

import { useParams, useRouter } from "next/navigation";
import { Note} from "@/app/lib/notes";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import toast from "react-hot-toast";

const NotePage = () => {
    const params = useParams();
    const id = params.id;
    const router = useRouter();
    const queryClient = useQueryClient();
    console.log(id)
    const {data: note} = useQuery<unknown, Error, Note>({
        queryKey:["note"],
        queryFn: async () => {
            try {
                const res = await fetch(`${api}/api/notes/view/${id}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-type": "application/json"
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

    const {mutate: deleteNote, isError, error} = useMutation ({
        mutationFn: async () => {
            try {
                const res = await fetch(`${api}/api/notes/delete/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-type": "application/json",
                        "Accept": "application/json"
                    }
                })
                const data = await res.json();
                console.log(data);
                if(!res.ok){
                    throw new Error (error?.message || "something went wrong")
                }
            } catch (error) {
                throw error;
            }
        },
        onSuccess: () => {
            toast.success("Note is deleted successfully");
            queryClient.invalidateQueries({
                queryKey: ["deleteNote"]
            })
            router.push("/notes")
        }
    })

    const handleDelete = () => {
        deleteNote();
    }

  // 3. Render the note
  if (!note) return <p>Loading...</p>;
    return (
        <div>
            <h3 className="text-2xl font-bold">{note?.title}</h3>
            <p>{note?.content}</p>
            <p className="text-xs text-gray-400">{note?.createdAt}</p>
            <div>
                <Link href={`edit/${note._id}`} className="btn bg-gray-400 px-4 py-2 mt-2 rounded text-black font-bold">edit</Link>
                <button type='button' className="btn bg-red-400 px-4 py-2 m-2 rounded text-black font-bold" onClick={handleDelete}>delete</button>
            </div>
            {isError && <p className="text-red-400">{error.message}</p>}
        </div>
    );
}

export default NotePage;