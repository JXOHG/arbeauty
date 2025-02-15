import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const HoursManager = () => {
  const navigate = useNavigate();
  const [hours, setHours] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHours();
  }, []);

  const fetchHours = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hours`);
      if (response.ok) {
        const data = await response.json();
        setHours(data);
      } else {
        setError('Failed to load store hours');
      }
    } catch (error) {
      setError('Failed to load store hours');
    } finally {
      setLoading(false);
    }
  };

  const handleHourChange = (index, field, value) => {
    const updatedHours = [...hours];
    updatedHours[index] = {
      ...updatedHours[index],
      [field]: value
    };
    setHours(updatedHours);
    setError('');
    setSuccess('');
  };

  const saveHours = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/hours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ hours }),
      });

      if (response.ok) {
        setSuccess('Store hours updated successfully!');
        fetchHours(); // Refresh the hours after saving
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update store hours');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Manage Store Hours</h2>
        <div className="text-gray-600">Loading store hours...</div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Manage Store Hours</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      <div className="space-y-4">
        {hours.map((hour, index) => (
          <div key={hour.id || index} className="flex gap-4">
            <input
              type="text"
              value={hour.day}
              onChange={(e) => handleHourChange(index, 'day', e.target.value)}
              className="w-1/3 p-2 border rounded"
            />
            <input
              type="text"
              value={hour.time}
              onChange={(e) => handleHourChange(index, 'time', e.target.value)}
              className="w-2/3 p-2 border rounded"
            />
          </div>
        ))}
      </div>
      <button
        onClick={saveHours}
        disabled={saving}
        className={`mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 w-full ${
          saving ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {saving ? 'Saving...' : 'Save Store Hours'}
      </button>
    </div>
  );
};

export default HoursManager;