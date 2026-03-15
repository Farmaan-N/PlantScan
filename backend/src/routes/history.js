/**
 * History Routes
 * Defines API endpoints for scan history management
 */

const express = require('express');
const router = express.Router();
const { getHistoryHandler, deleteScanHandler } = require('../controllers/historyController');
const authenticateUser = require('../middleware/authMiddleware');

/**
 * GET /api/history
 * Returns all saved plant scans (newest first)
 * Optional query param: ?limit=10
 */
router.get('/', authenticateUser, getHistoryHandler);

/**
 * DELETE /api/history/:id
 * Deletes a specific scan by its UUID
 */
router.delete('/:id', authenticateUser, deleteScanHandler);

module.exports = router;
