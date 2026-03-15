/**
 * LLM Service (Google Gemini)
 * Sends plant name to an LLM to generate rich plant information
 * Uses Google AI Studio Gemini API
 */

const axios = require('axios');

/**
 * Generates detailed plant information using an LLM
 * @param {string} plantName - Common name of the plant
 * @param {string} scientificName - Scientific name of the plant
 * @returns {Object} - { description, medicinalUses, habitat, growingRegions }
 */
const generatePlantInfo = async (plantName, scientificName) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    // Return placeholder data if no API key is configured
    console.warn('⚠️  Gemini API key not configured. Returning placeholder plant info.');
    return getPlaceholderInfo(plantName);
  }

  const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

  // Craft a clear, structured prompt for the LLM
  const prompt = `You are a helpful plant expert. Give simple, easy-to-understand information about the plant "${plantName}" (${scientificName}). Avoid using overly technical or complex scientific words.
  
  Return ONLY a valid JSON object with exactly these 7 fields:
  {
    "description": "A simple 2-3 sentence description of what the plant looks like and its main features",
    "medicinalUses": "A simple explanation of how people use this plant for health or traditional remedies",
    "keyBenefits": "List the top 3 most important uses or health benefits of the plant as an array of strings",
    "sideEffects": "A simple description of any bad effects or things to watch out for",
    "restrictions": "Simple information on who should not use it (like children or pregnant women) and safety tips",
    "habitat": "A simple description of where it usually grows",
    "growingRegions": "A simple list of regions or countries where it is found"
  }
  
  Do not include any text before or after the JSON object. Do not include markdown formatting like \`\`\`json.`;

  try {
    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey,
        },
        timeout: 30000, // 30 second timeout
      }
    );

    // Extract the text content from the Gemini response
    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('LLM returned empty response');
    }

    // Parse the JSON response from the LLM
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('LLM response did not contain valid JSON');
    }

    const plantInfo = JSON.parse(jsonMatch[0]);

    // Ensure all required fields are present
    return {
      description: plantInfo.description || 'No description available.',
      medicinalUses: plantInfo.medicinalUses || 'No medicinal information available.',
      keyBenefits: plantInfo.keyBenefits || [],
      sideEffects: plantInfo.sideEffects || 'No common side effects reported.',
      restrictions: plantInfo.restrictions || 'No specific restrictions reported.',
      habitat: plantInfo.habitat || 'Habitat information not available.',
      growingRegions: plantInfo.growingRegions || 'Growing regions not available.',
    };
  } catch (err) {
    console.error('LLM error:', err.message);
    return getPlaceholderInfo(plantName);
  }
};

/**
 * Returns placeholder plant info when the LLM is unavailable
 */
const getPlaceholderInfo = (plantName) => ({
  description: `${plantName} is a beautiful plant. Please add your Gemini API key in the settings to see a full description.`,
  medicinalUses: 'Information about how this plant is used for health will show up here.',
  keyBenefits: ['Benefit 1', 'Benefit 2', 'Benefit 3'],
  sideEffects: 'Any side effects will be listed here.',
  restrictions: 'Important warnings will be shown here.',
  habitat: 'Info about where it grows naturally will appear here.',
  growingRegions: 'The parts of the world where this plant grows will be shown here.',
});

module.exports = { generatePlantInfo };
