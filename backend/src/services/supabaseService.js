/**
 * Supabase Service
 * All database operations for scan history are centralized here
 */

const supabase = require('../lib/supabaseClient');

/**
 * Saves a completed plant scan to the database
 * @param {Object} scanData - All plant scan details to store
 * @param {string} userId - The ID of the user who owns this scan
 * @returns {Object} - The newly created scan record
 */
const saveScan = async (scanData, userId) => {
  const { data, error } = await supabase
    .from('scans')
    .insert([
      {
        user_id: userId,
        plant_name: scanData.plantName,
        scientific_name: scanData.scientificName,
        confidence: scanData.confidence,
        image_url: scanData.imageUrl || null,
        description: scanData.description,
        medicinal_uses: scanData.medicinalUses,
        key_benefits: scanData.keyBenefits,
        side_effects: scanData.sideEffects,
        restrictions: scanData.restrictions,
        habitat: scanData.habitat,
        growing_regions: scanData.growingRegions,
      },
    ])
    .select() // Return the inserted record
    .single();

  if (error) {
    console.error('Supabase insert error:', error.message);
    throw new Error(`Failed to save scan: ${error.message}`);
  }

  return data;
};

/**
 * Retrieves all scans from the database, ordered by newest first, filtered by user
 * @param {string} userId - The user ID to filter by
 * @param {number} limit - Maximum number of records to return
 * @returns {Array} - Array of scan records
 */
const getScans = async (userId, limit = 50) => {
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Supabase select error:', error.message);
    throw new Error(`Failed to fetch scans: ${error.message}`);
  }

  return data || [];
};

/**
 * Deletes a single scan by its ID and ensures it belongs to the user
 * @param {string} id - The UUID of the scan to delete
 * @param {string} userId - The user ID for security verification
 */
const deleteScan = async (id, userId) => {
  const { error } = await supabase
    .from('scans')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Supabase delete error:', error.message);
    throw new Error(`Failed to delete scan: ${error.message}`);
  }
};

module.exports = { saveScan, getScans, deleteScan };
