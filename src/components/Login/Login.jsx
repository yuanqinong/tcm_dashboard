import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement login/signup logic here
    console.log(isLogin ? 'Login with:' : 'Sign up with:', email, password);
    console.log("isLogin: ", isLogin);
    if (isLogin && email === "admin@gmail.com" && password === "admin") {
        console.log("Login successful");
        navigate('/content-manager');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>TCM Admin Dashboard</h1>
        <div className="auth-buttons">
          <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Log in</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Sign up</button>
        </div>
      </div>
      <div className="auth-right">
        <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" className="submit-button">{isLogin ? 'Log in' : 'Sign up'}</button>
        </form>
        {isLogin ? (
          <a href="#" className="forgot-password">Forget Password?</a>
        ) : <p className='spacer'></p>}
        <p className="switch-mode">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <a href="#" onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Sign up' : 'Login'}</a>
        </p>
      </div>
    </div>
  );
}

export default Login;