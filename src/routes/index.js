const express = require('express');
const router = express.Router();
const prototypeRoutes = require('./prototype');

/**
 * API路由配置
 */

// 原型相关API
router.use('/prototypes', prototypeRoutes);

module.exports = router;