/**
 * History Controller
 * Handles scanning history requests:
 * - Get all scans
 * - Delete a scan
 */

const { getScans, deleteScan } = require('../services/supabaseService');

/**
 * GET /api/history
 * Returns all plant scans ordered by newest first
 */
const getHistoryHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;

    // Fetch the detailed list
    const scans = await getScans(userId, limit);
    
    // Fetch total count for stats
    const { count, error: countError } = await require('../lib/supabaseClient')
      .from('scans')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    res.json({
      success: true,
      data: scans,
      stats: {
        totalScans: count || 0,
      }
    });
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * DELETE /api/history/:id
 * Deletes a specific scan by ID
 */
const deleteScanHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Scan ID is required' });
    }

    await deleteScan(id, req.user.id);

    res.json({
      success: true,
      message: `Scan ${id} deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getHistoryHandler, deleteScanHandler };
