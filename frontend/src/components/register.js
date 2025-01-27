/**
 * This component handles patient registration by collecting user details 
 * and submitting them to the backend. It also displays validation messages 
 * and provides a redirect link to the login page for existing users.
 */

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const PatientRegistration = () => {
  const [patientData, setPatientData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientData.username || !patientData.email || !patientData.phone || !patientData.address || !patientData.password) {
      setError('All fields are required');
      return;
    }

    //API CALL FOR SIGNING USER IN
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/accounts/register/', patientData);
      console.log(response.data);

      setSuccessMessage('Registration successful! Redirecting...');
      setError('');
      
      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (err) {
      setSuccessMessage('');
      
      if (err.response?.data?.username) {
        setError('Username already exists');
      } else if (err.response?.data?.email) {
        setError('Email already exists');
      } else if (err.response?.data?.phone) {
        setError('Phone number already exists');
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error(err.response?.data);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Patient Registration</h2>

        {successMessage && (
          <p className="text-green-500 text-center mb-4 transition-opacity duration-500 opacity-100">
            {successMessage}
          </p>
        )}

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={patientData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={patientData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={patientData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={patientData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={patientData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-gray-700">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PatientRegistration;
