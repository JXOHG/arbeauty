import fetch from 'node-fetch';

const API_URL = 'http://localhost:8080'; // Replace with your actual API URL if different

async function fetchGalleryImages() {
  try {
    const response = await fetch(`${API_URL}/api/gallery`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Gallery images:', data);
    
    if (data.length === 0) {
      console.log('No images found in the gallery.');
    } else {
      console.log(`Found ${data.length} images in the gallery.`);
    }
  } catch (error) {
    console.error('Error fetching gallery images:', error.message);
  }
}

fetchGalleryImages();