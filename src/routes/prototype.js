const express = require('express');
const router = express.Router();
const prototypeController = require('../controllers/prototype');

/**
 * 原型相关API路由
 */

// 生成短链接
router.post('/link', prototypeController.generateLink);

// 解析短链接获取原型信息
router.get('/link/:shortLink', prototypeController.resolveLink);

module.exports = router; 