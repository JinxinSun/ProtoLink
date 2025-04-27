import express from 'express';
import prototypeController from '../controllers/prototype';

const router = express.Router();

/**
 * 原型相关API路由
 */

// 解析短链接获取原型信息
router.get('/link/:shortLink', prototypeController.resolveLink);

// 获取原型列表
router.get('/list', prototypeController.listPrototypes);

export default router; 