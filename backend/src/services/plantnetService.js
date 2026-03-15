/**
 * PlantNet Service
 * Sends plant images to the PlantNet API for identification
 * Docs: https://my.plantnet.org/doc/openapiV2
 */

const axios = require('axios');
const FormData = require('form-data');

const PLANTNET_BASE_URL = 'https://my-api.plantnet.org/v2/identify/all';

/**
 * Identifies a plant from an image buffer
 * @param {Buffer} imageBuffer - The image file buffer from multer
 * @param {string} originalName - Original filename (for extension detection)
 * @returns {Object} - { plantName, scientificName, confidence, commonNames }
 */
const identifyPlant = async (imageBuffer, originalName) => {
  const apiKey = process.env.PLANTNET_API_KEY;

  if (!apiKey || apiKey === 'your-plantnet-api-key-here') {
    console.warn('⚠️ PlantNet API key is not configured. Returning mock plant data for testing.');
    
    // Return mock data after a short artificial delay to simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          plantName: 'Monstera Deliciosa',
          scientificName: 'Monstera deliciosa',
          confidence: 95,
          commonNames: ['Swiss Cheese Plant', 'Ceriman'],
          family: 'Araceae',
        });
      }, 1500);
    });
  }

  // Build multipart form data with the image
  const formData = new FormData();
  formData.append('images', imageBuffer, {
    filename: originalName || 'plant.jpg',
    contentType: 'image/jpeg',
  });

  try {
    const response = await axios.post(
      `${PLANTNET_BASE_URL}?api-key=${apiKey}&lang=en&nb-results=1`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 15000, // 15 second timeout
      }
    );

    const results = response.data.results;

    if (!results || results.length === 0) {
      throw new Error('No plant identified. Please try a clearer image.');
    }

    // Extract the top result
    const topResult = results[0];
    const species = topResult.species;

    return {
      plantName: species.commonNames?.[0] || species.scientificNameWithoutAuthor,
      scientificName: species.scientificNameWithoutAuthor,
      confidence: Math.round(topResult.score * 100), // convert 0-1 to percentage
      commonNames: species.commonNames || [],
      family: species.family?.scientificNameWithoutAuthor || 'Unknown',
    };
  } catch (err) {
    // Handle PlantNet-specific errors
    if (err.response) {
      const status = err.response.status;
      if (status === 404) throw new Error('No plant found in the image. Try a clearer photo.');
      if (status === 403) throw new Error('Invalid PlantNet API key. Please check your configuration.');
      if (status === 429) throw new Error('PlantNet API rate limit exceeded. Please try again later.');
      throw new Error(`PlantNet API error: ${err.response.data?.message || err.message}`);
    }
    throw err;
  }
};

module.exports = { identifyPlant };
