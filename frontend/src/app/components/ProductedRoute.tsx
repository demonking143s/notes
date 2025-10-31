"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import {api} from '@/app/lib/api';
import { User } from "../lib/users";
import LoadingSpinner from "./LoadingSpinner";

type AuthContextType = {
    authUser: User | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    authUser: null,
    isLoading: true
})

export const useAuth = () => useContext(AuthContext)

const ProductedRoute = ({children}: { children: React.ReactNode}) => {
    const router = useRouter();

    const {data: authUser, isLoading} = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await fetch(`${api}/api/auth/getme`,{
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const data = await res.json();

                if(data.error){
                    return null;
                }

                if(!res.ok){
                    throw new Error(data.error || 'Something went wrong');
                }
                console.log(data);
                return data;
            } catch (error) {
                console.log(error);      
                throw error;
            }
        },
        retry: false
    })

    useEffect(()=> {
        if(!isLoading && !authUser){
            router.replace('/auth/login')
        }
    }, [router, isLoading, authUser]);

    if(isLoading) {
        return(
            <LoadingSpinner size={20} color='white' />
        )
    }

    return (
        <AuthContext.Provider value={{authUser, isLoading}}>
            {children}
        </AuthContext.Provider>
    );
}

export default ProductedRoute;