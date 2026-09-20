import '../css/SignupPage.css'
import { Link } from 'react-router-dom'
import { use, useState } from 'react';



function SignupPage(){

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [passowrd, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

    function handleSubmit(e){
        e.preventDefault();
        if(!username.trim()){
            alert("Username cannot be empty.");
        }
        if(!email.test(emailRegex)){
            alert("Please enter a valid email address.")
        }
        if(passowrd.trim() !== confirmPassword.trim()){
            alert("Your passwords do not match.");
        }
        
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