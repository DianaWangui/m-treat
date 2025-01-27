/**
 * Dashboard Component
 * 
 * This component handles the user dashboard functionality, including:
 * - Displaying user information (username, email, phone, address).
 * - Allowing the user to edit their phone and address details.
 * - Handling the form submission to update user details.
 * - Showing success or error messages based on the outcome of the update operation.
 * - Providing a logout option for the user.
 * 
 * Success and error messages are shown below the username and are auto-hidden after 2 seconds.
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkLoginStatus, updateUserDetails, fetchUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/userSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.user);
  const accessToken = localStorage.getItem('access_token');

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(''); 

  useEffect(() => {
    dispatch(checkLoginStatus());
    if (accessToken) {
      dispatch(fetchUserData());
    } else {
      console.log('No access token found.');
    }
  }, [dispatch, accessToken]);

  useEffect(() => {
    if (user) {
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUserDetails = { phone, address };

    if (accessToken) {
      dispatch(updateUserDetails(updatedUserDetails))
        .then(() => {
          setStatusMessage('Successfully updated your details!');
          setTimeout(() => setStatusMessage(''), 2000);
        })
        .catch(() => {
          setStatusMessage('Failed to update. Please try again later.');
          setTimeout(() => setStatusMessage(''), 2000);
        });
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (loading) return <div className="text-center p-4 text-xl text-gray-700">Loading...</div>;
  if (error) return <div className="text-center p-4 text-xl text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-teal-200 py-10">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-semibold text-gray-800 text-center mb-4">
          Welcome, {user ? user.username : 'User'}!
        </h1>

        {statusMessage && (
          <div className={`mt-4 text-center text-lg ${statusMessage.includes('Successfully') ? 'text-green-500' : 'text-red-500'}`}>
            {statusMessage}
          </div>
        )}

        <div className="text-center text-xl text-gray-600">
          <div className="space-y-3">
            <p>
              <span className="font-semibold">Email:</span> {user ? user.email : 'Not available'}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {isEditing ? (
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />
              ) : (
                phone || 'Not available'
              )}
            </p>
            <p>
              <span className="font-semibold">Address:</span> {isEditing ? (
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />
              ) : (
                address || 'Not available'
              )}
            </p>
          </div>

          <div className="mt-4 flex justify-center">
            {isEditing ? (
              <button onClick={handleSubmit} className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
                Save Changes
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-6 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600">
                Edit Details
              </button>
            )}
          </div>

          <div className="mt-4 flex justify-center">
            <button onClick={handleLogout} className="px-6 py-2 text-white bg-red-500 rounded-md hover:bg-red-600">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
