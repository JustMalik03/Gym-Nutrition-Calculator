import '../css/SignupPage.css'
import { Link } from 'react-router-dom'

function SignupPage(){
    return(
        <>
        <h1>Sign Up</h1>
        <form>
            <label htmlFor='username'>Username:</label>
            <input type="text" id="username" required />
            <label htmlFor='email'>Email:</label>
            <input type="email" id="email" />
            <label htmlFor='password'>Password:</label>
            <input type="password" id="password" required />
            <label htmlFor='confirm-password'>Confirm Password:</label>
            <input type="password" id="confirm-password" required />
            <input type="submit" />
            <Link to="/"><p>Already have an account? Login here!</p></Link>
        </form>
        </>
    )
}

export default SignupPage