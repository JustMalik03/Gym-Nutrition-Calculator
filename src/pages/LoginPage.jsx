import { useState } from 'react'
import { Link } from 'react-router-dom';

import '../css/LoginPage.css'

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(username);
      console.log(password);
    }

  return (
    <>
    <h1>Gym Nutrition Calculator</h1>
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor='email'>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        <label htmlFor='password'>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="submit" id="login-btn" value="Submit"/>
        <p>Need to create an account? <Link to="/signup">Sign up here!</Link></p>
      </form>
      </div>
    </>
  )
}

export default LoginPage
