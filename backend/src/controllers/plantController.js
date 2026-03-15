/**
 * Plant Controller
 * Handles plant identification requests:
 * 1. Receives uploaded image
 * 2. Calls PlantNet for identification
 * 3. Calls OpenRouter LLM for plant info
 * 4. Saves to Supabase
 * 5. Returns full plant data to the client
 */

const { identifyPlant } = require('../services/plantnetService');
const { generatePlantInfo } = require('../services/llmService');
const { saveScan } = require('../services/supabaseService');

/**
 * POST /api/plant/identify
 * Main scan handler - orchestrates the full plant scan workflow
 */
const identifyPlantHandler = async (req, res, next) => {
  try {
    // Validate that an image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided. Please upload a plant image.' });
    }

    console.log(`🌿 Received scan request: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB)`);

    // ── Step 1: Identify plant with PlantNet ─────────────────────────────────
    console.log('📡 Sending image to PlantNet API...');
    const identification = await identifyPlant(req.file.buffer, req.file.originalname);
    console.log(`✅ Identified: ${identification.plantName} (${identification.confidence}% confidence)`);

    // ── Step 2: Generate plant info with LLM ─────────────────────────────────
    console.log('🤖 Generating plant information with LLM...');
    const plantInfo = await generatePlantInfo(identification.plantName, identification.scientificName);
    console.log('✅ Plant information generated');

    // ── Step 3: Compile the full response ────────────────────────────────────
    const fullPlantData = {
      plantName: identification.plantName,
      scientificName: identification.scientificName,
      confidence: identification.confidence,
      commonNames: identification.commonNames,
      family: identification.family,
      description: plantInfo.description,
      medicinalUses: plantInfo.medicinalUses,
      keyBenefits: plantInfo.keyBenefits,
      sideEffects: plantInfo.sideEffects,
      restrictions: plantInfo.restrictions,
      habitat: plantInfo.habitat,
      growingRegions: plantInfo.growingRegions,
    };

    // ── Step 4: Save to Supabase (associated with current user) ─
    try {
      const savedScan = await saveScan(fullPlantData, req.user.id);
      fullPlantData.scanId = savedScan.id;
      console.log(`💾 Scan saved to database with ID: ${savedScan.id}`);
    } catch (dbError) {
      console.warn('⚠️  Could not save scan to database:', dbError.message);
      // Continue even if DB save fails - user still gets their plant data
    }

    // ── Step 5: Return full plant data ────────────────────────────────────────
    res.json({
      success: true,
      data: fullPlantData,
    });
  } catch (err) {
    next(err); // Pass error to global error handler
  }
};

module.exports = { identifyPlantHandler };
