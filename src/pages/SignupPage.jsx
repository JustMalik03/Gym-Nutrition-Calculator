import '../css/SignupPage.css'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';



function SignupPage(){

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await fetch("http://localhost:3000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })

            const result = await res.json();
            if(res.ok){
                console.log("Data successfully sent.");
                
            } else {
                console.log("Something went wrong.")
            }
        } catch(error){
            console.error("Failed to connect to server", error);
        }
    };

    return(
        <>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Username Field */}
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        {...register('username', {
                            required: 'Username is required',
                            minLength: {
                                value: 4,
                                message: 'Username must be at least 4 characters long'
                            }, maxLength: {
                                value: 26,
                                message: "Username cannot exceed 26 characters"
                            }
                        })}
                    />
                    {errors.username && (
                        <span className="error-message">
                            {errors.username.message}
                        </span>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: 'Email is invalid'
                            }
                        })}
                    />
                    {errors.email && (
                        <span className="error-message">
                            {errors.email.message}
                        </span>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters long'
                            }
                        })}
                    />
                    {errors.password && (
                        <span className="error-message">
                            {errors.password.message}
                        </span>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label className="form-label">Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        {...register('confirmPassword', {
                            required: 'Confirm Password is required',
                            validate: (value) =>
                                value === document.getElementsByName('password')[0].value ||
                                'Passwords do not match'
                        })}
                    />
                    {errors.confirmPassword && (
                        <span className="error-message">
                            {errors.confirmPassword.message}
                        </span>
                    )}
                </div>

                <input type="submit" value="Sign Up"/>
            <p>Already have an account? <Link to="/login">Login here!</Link></p>
        </form>
        </>
    )
}

export default SignupPage