const express = require('express');
const router = express.Router();
const {
    generatePlugin,
    savePlugin,
    analyzePlugin,
    getPluginHistory,
    deletePlugin,
    renamePlugin
} = require('../controllers/pluginController');

router.post('/generate', generatePlugin);
router.post('/save', savePlugin);
router.post('/analyze', analyzePlugin);
router.get('/plugin-history', getPluginHistory);
router.delete('/:id', deletePlugin);
router.put('/:id/rename', renamePlugin);

module.exports = router;