import { useState } from 'react'
import { Link } from 'react-router-dom';

import '../css/LoginPage.css'

function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

  return (
    <>
    <h1>Gym Nutrition Calculator</h1>
      <form>
        <label htmlFor='username'>Username:</label>
        <input type="text" id="username" onChange={(e) => setUsername(e.target.value)} required/>
        <label htmlFor='password'>Password:</label>
        <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} required />
        <input type="submit" id="login-btn" value="Submit"/>
        <Link to="/signup"><p>Need to create an account? Sign up here!</p></Link>
      </form>
    </>
  )
}

export default LoginPage
