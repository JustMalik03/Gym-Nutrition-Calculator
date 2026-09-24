import { useState } from 'react'
import { Link } from 'react-router-dom';

import '../css/LoginPage.css'

function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(username);
      console.log(password);
    }

  return (
    <>
    <h1><a href="/" style={{ textDecoration: 'underline' }}>Login</a></h1>
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>
        <label htmlFor='password'>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="submit" id="login-btn" value="Submit"/>
        <Link to="/signup"><p>Need to create an account? Sign up here!</p></Link>
      </form>
      </div>
    </>
  )
}

export default LoginPage
