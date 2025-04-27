const request = require('supertest');
const { app } = require('../../src/app');  // 假设app.js导出了app对象
const db = require('../../src/config/database');

/**
 * 原型API测试
 */
describe('原型API测试', () => {
  let mockData;
  
  // 测试前准备模拟数据
  beforeAll(async () => {
    // 清空测试数据库
    await db.prototypes.clear();
    
    // 插入测试数据
    mockData = [
      { 
        id: '00001111-2222-3333-4444-555566667777',
        name: '测试原型1', 
        short_link: 'test1', 
        file_path: '/uploads/test1',
        created_at: new Date('2025-04-20T10:00:00Z'),
        updated_at: new Date('2025-04-20T10:00:00Z')
      },
      { 
        id: '00001111-2222-3333-4444-555566667778',
        name: '测试原型2', 
        short_link: 'test2', 
        file_path: '/uploads/test2',
        created_at: new Date('2025-04-21T10:00:00Z'),
        updated_at: new Date('2025-04-21T10:00:00Z')
      },
      { 
        id: '00001111-2222-3333-4444-555566667779',
        name: '测试原型3', 
        short_link: 'test3', 
        file_path: '/uploads/test3',
        created_at: new Date('2025-04-22T10:00:00Z'),
        updated_at: new Date('2025-04-22T10:00:00Z')
      }
    ];
    
    for (const item of mockData) {
      await db.prototypes.save(item);
    }
  });
  
  // 测试后清理环境
  afterAll(async () => {
    await db.prototypes.clear();
  });
  
  /**
   * 测试原型列表接口
   */
  describe('GET /api/prototypes/list', () => {
    // 测试默认分页
    it('应返回默认分页的原型列表', async () => {
      const response = await request(app)
        .get('/api/prototypes/list')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // 验证响应结构
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.items).toBeDefined();
      expect(Array.isArray(response.body.data.items)).toBe(true);
      
      // 验证分页信息
      expect(response.body.data.page).toBe(1);
      expect(response.body.data.pageSize).toBe(10);
      expect(response.body.data.total).toBe(mockData.length);
      
      // 验证数据内容
      expect(response.body.data.items.length).toBe(mockData.length);
      expect(response.body.data.items[0].name).toBe('测试原型3'); // 按创建时间降序排序
      
      // 验证响应时间
      expect(response.body.responseTime).toBeDefined();
      expect(typeof response.body.responseTime).toBe('number');
      expect(response.body.responseTime).toBeLessThan(1000); // 响应时间应小于1秒
      
      // 验证响应头
      expect(response.headers['x-response-time']).toBeDefined();
    });
    
    // 测试自定义分页参数
    it('应返回自定义分页的原型列表', async () => {
      const response = await request(app)
        .get('/api/prototypes/list?page=2&pageSize=1')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // 验证分页信息
      expect(response.body.data.page).toBe(2);
      expect(response.body.data.pageSize).toBe(1);
      
      // 验证数据内容
      expect(response.body.data.items.length).toBe(1);
      expect(response.body.data.items[0].name).toBe('测试原型2'); // 第二页第一条
    });
    
    // 测试异常处理
    it('应处理无效的分页参数', async () => {
      const response = await request(app)
        .get('/api/prototypes/list?page=-1&pageSize=abc')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // 无效参数应被修正为默认值
      expect(response.body.data.page).toBe(1);
      expect(response.body.data.pageSize).toBe(10);
    });
  });
}); 