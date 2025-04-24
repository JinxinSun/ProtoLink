import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

// 导入路由
import uploadRoutes from './routes/upload';

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();
const port = process.env.PORT || 3000;

// 基本中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 设置静态文件服务，用于访问上传的原型文件
app.use('/static', express.static(path.join(process.cwd(), 'uploads')));

// 注册路由
app.use('/api/upload', uploadRoutes);

// 测试路由
app.get('/', (req, res) => {
  res.json({ message: 'ProtoLink API 服务运行中' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 