'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Note } from '@/app/lib/notes'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/app/lib/api';
import LoadingSpinner from '@/app/components/LoadingSpinner';

const AddNotePage = () => {
    const router = useRouter();
    const queryClinet = useQueryClient();
    type NoteInput = Pick<Note, "title" | "content" | "tags">
    const [formData, setFormData] = useState<NoteInput>({
      title: "",
      content: "",
      tags: []
    })

    const [tag, setTag] = useState<string>('');

    const {mutate: addNote, isPending, isError, error} = useMutation<unknown, Error, NoteInput>({
      mutationFn: async ({title, content, tags}) => {
        try {
          const res = await fetch(`${api}/api/notes/add`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({title, content, tags})
          })
          const data = await res.json();
          console.log(data)
          if(!res.ok){
            throw new Error(data.error || "something went wrong")
          }
        } catch (error) {
          throw error;
        }
      },
      onSuccess: () => {
        toast.success("new note added sucessfully");
        queryClinet.invalidateQueries({
          queryKey:["addNote"]
        })
        router.push('/notes')
      }
    })

    const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const {name, value} = e.target;
      setFormData({...formData, [name]:value})
    }
    
    const handleInputTag = () => {
      const trimmed = tag.trim();
      if(trimmed && !formData.tags.includes(trimmed)) {
        setFormData((prev)=>({
          ...prev,
          tags: [...prev.tags, trimmed],
        }))
        setTag('');
      }
    }

    const handleRemoveTag = (tagToRemove: string) => {
      setFormData((prev)=>({
        ...prev,
        tags: prev.tags.filter((tag)=>tag!==tagToRemove),
      }))
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addNote(formData)
    }
  return(
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-3">Add New Note</h1>
      <input
        type='text'
        name='title'
        className="border p-2 w-full mb-2 rounded"
        placeholder="Title"
        value={formData.title}
        onChange={handleInputChanges}
      />
      <textarea
        name='content'
        className="border p-2 w-full mb-2 rounded h-32"
        placeholder="Content"
        value={formData.content}
        onChange={handleInputChanges}
      />
      <div>
      <input
        type='text'
        name='tag'
        className="border p-2 h-10 w-20 mb-2 rounded"
        placeholder="add new tags"
        value={tag}
        onChange={(e)=>setTag(e.target.value)}
      />
      <button type='button' onClick={handleInputTag} className='text-2xl font-bold px-2'>+</button>
      </div>
      <div className='px-3 h-30 w-full border border-gray-400 border-spacing-1 my-2 py-4 rounded '>
        {formData.tags.length > 0 && formData.tags.map((tag) => <span className='border p-2 mr-2 h-10' onClick={()=>handleRemoveTag(tag)} key={tag}>{tag}❌</span>)}
      </div>
      <button
        type='submit'
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending?<LoadingSpinner size={20} color='white' />:"save"}
      </button>
      {isError&&<p className='text-red-400'>{error.message}</p>};
    </form>
  )
}

export default AddNotePage