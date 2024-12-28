import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [newImageAlt, setNewImageAlt] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/gallery`);
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        setError('Failed to fetch images');
      }
    } catch (error) {
      setError('Error fetching images');
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!newImage) return;

    const formData = new FormData();
    formData.append('image', newImage);
    formData.append('alt', newImageAlt);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/gallery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        setSuccess('Image uploaded successfully');
        setNewImage(null);
        setNewImageAlt('');
        fetchImages();
      } else {
        setError('Failed to upload image');
      }
    } catch (error) {
      setError('Error uploading image');
    }
  };

  const handleImageDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        setSuccess('Image deleted successfully');
        fetchImages();
      } else {
        setError('Failed to delete image');
      }
    } catch (error) {
      setError('Error deleting image');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Manage Gallery</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
      
      <form onSubmit={handleImageUpload} className="mb-8">
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Upload New Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-2">Image Description (Alt Text)</label>
          <input
            type="text"
            id="alt"
            value={newImageAlt}
            onChange={(e) => setNewImageAlt(e.target.value)}
            className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <button type="submit" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200">
          Upload Image
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="border rounded-md p-4">
            <img src={image.url} alt={image.alt} className="w-full h-48 object-cover mb-2" />
            <p className="text-sm text-gray-500 mb-2">{image.alt}</p>
            <button
              onClick={() => handleImageDelete(image.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;

