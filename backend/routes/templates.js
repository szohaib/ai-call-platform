const express = require('express');
const router = express.Router();
const { templates } = require('../templates/callTemplates');

// Get all templates
router.get('/', (req, res) => {
  const templateList = Object.values(templates);
  res.json({ success: true, templates: templateList });
});

// Get specific template
router.get('/:id', (req, res) => {
  const template = templates[req.params.id];
  if (!template) {
    return res.status(404).json({ success: false, error: 'Template not found' });
  }
  res.json({ success: true, template });
});

module.exports = router;
