import React, { useState } from 'react';
import axios from 'axios';
import '../../css/Login.css';

const Register = ({ handleRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onButtonClick = async () => {
    setEmailError('');
    setPasswordError('');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('/api/users/register', { email, password });
      if (response.status === 201) {
        setSuccessMessage('Registration successful! You can now log in.');
        setTimeout(() => handleRegister(false), 2000);
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'An error occurred. Please try again later.');
      } else {
        setErrorMessage('Network error. Please try again later.');
      }
    }
  };

  return (
    <div className="mainContainer">
      <div className="titleContainer">
        <div>Register</div>
      </div>
      <br />
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="inputContainer">
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email here"
            onChange={(ev) => setEmail(ev.target.value)}
            className="inputBox"
            required
          />
          <label className="errorLabel">{emailError}</label>
        </div>
        <br />
        <div className="inputContainer">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            placeholder="Enter your password here"
            onChange={(ev) => setPassword(ev.target.value)}
            className="inputBox"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="togglePasswordButton"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
          <label className="errorLabel">{passwordError}</label>
        </div>
        <br />
        <div className="inputContainer">
          <button type="button" className="inputButton" onClick={onButtonClick}>
            Register
          </button>
        </div>
        {errorMessage && <div className="error">{errorMessage}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
      </form>
    </div>
  );
};

export default Register;
