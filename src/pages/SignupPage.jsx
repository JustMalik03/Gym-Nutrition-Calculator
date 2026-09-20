import '../css/SignupPage.css'
import { Link } from 'react-router-dom'
import { use, useState } from 'react';



function SignupPage(){

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [passowrd, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function handleSubmit(e){
        e.preventDefault();
        
        
    }

    return(
        <>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor='username'>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <label htmlFor='email'>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor='password'>Password:</label>
            <input type="password" value={passowrd} required onChange={(e) => setPassword(e.target.value)}/>
            <label htmlFor='confirm-password'>Confirm Password:</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <input type="submit" />
            <Link to="/"><p>Already have an account? Login here!</p></Link>
        </form>
        </>
    )
}

export default SignupPage