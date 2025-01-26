import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkLoginStatus } from '../redux/userSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);

  if (loading) return <div className="text-center p-4 text-xl text-gray-700">Loading...</div>;
  if (error) return <div className="text-center p-4 text-xl text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-teal-200 py-10">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        {user ? (
          <>
            <h1 className="text-4xl font-semibold text-gray-800 text-center mb-4">Welcome, {user.username}!</h1>
            <div className="text-center text-xl text-gray-600">
              <div className="space-y-3">
                <p><span className="font-semibold">Email:</span> {user.email}</p>
                <p><span className="font-semibold">Phone:</span> {user.phone}</p>
                <p><span className="font-semibold">Address:</span> {user.address}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-xl text-gray-500">No user data available</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
