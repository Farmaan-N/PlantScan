/**
 * Plant Routes
 * Defines API endpoints for plant identification
 */

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { identifyPlantHandler } = require('../controllers/plantController');
const authenticateUser = require('../middleware/authMiddleware');

/**
 * POST /api/plant/identify
 * Accepts a single image upload and returns plant identification + details
 * 
 * Form Data:
 *   - image: File (required) - The plant image to identify
 */
router.post('/identify', authenticateUser, upload.single('image'), identifyPlantHandler);

module.exports = router;
