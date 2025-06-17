const express = require('express');
const router = express.Router();
const {
    generatePlugin,
    savePlugin,
    analyzePlugin,
    getPluginHistory,
    deletePlugin,
    renamePlugin,
    updatePlugin
} = require('../controllers/pluginController');

router.post('/generate', generatePlugin);
router.post('/save', savePlugin);
router.post('/analyze', analyzePlugin);
router.get('/plugin-history', getPluginHistory);
router.delete('/:id', deletePlugin);
router.put('/:id/rename', renamePlugin);
router.put('/update/:id', updatePlugin);

module.exports = router;
