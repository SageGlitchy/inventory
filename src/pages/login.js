import {useState} from "react";
import {supabase} from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function Login(){
    const [email, setEmail] =useState('');
    const [password, setPassword]= useState('');
    const[error, setError]= useState('');
    const [loading, setLoading]= useState(false);
    const router= useRouter();



const handleLogin= async(e)=>{
    e.preventDefault();
    setLoading(true);
    setError('');
    const{error}= await supabase.auth.signInWithPassword({email,password});
    setLoading(false);
    if(error){
        setError(error.message);
    }
    else{
        router.push('/');
    }
};


return (
    <div>
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e=> setEmail(e.target.value)}
            required
            ></input>

            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e=> setPassword(e.target.value)}
            required
            ></input>

            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </form>
    </div>
)

}