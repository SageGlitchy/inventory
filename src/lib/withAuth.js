import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "./supabaseClient";


export default function withAuth(Component){
    return function ProtectedComponent(props){
        const router =useRouter();

        useEffect(()=> {
            supabase.auth.getSession().then(({data:{session}})=>{
                if (!session){
                    router.replace('/login');
                }
            });

            const {data: {subscription} }= supabase.auth.onAuthStateChange((event,session)=>{
                if(!session){
                    router.replace('/login');
                }
            });

            return ()=> {
                if (subscription){
                    subscription.unsubscribe();
                }
            };
        }, [router]);

        return <Component {...props}></Component>
    };
}