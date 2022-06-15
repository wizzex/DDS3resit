const express = require('express');
const controller = require('../controllers/contact');
const auth = require('../middlewares/auth');
const error = require('../middlewares/error');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/', auth, controller.list);
router.get('/:id', auth, controller.details);
router.get('/:id/avatar', controller.getAvatar);
router.post('/', auth, controller.create);
router.post('/:id/avatar', auth, upload.single('file'), controller.createAvatar);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.delete);

module.exports = router;