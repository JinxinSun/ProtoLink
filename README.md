# ProtoLink - 原型托管平台

轻量级原型托管平台，实现原型上传、链接生成、在线预览等核心功能，提升产品团队协作效率。

## API文档

### 原型管理模块API

#### 获取原型列表

```
GET /api/prototypes/list
```

**请求参数：**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|-----|------|
| page | Number | 否 | 页码，默认1 |
| pageSize | Number | 否 | 每页条数，默认10，最大100 |

**响应示例：**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "00001111-2222-3333-4444-555566667779",
        "name": "测试原型3",
        "shortLink": "test3",
        "accessUrl": "https://protolink.company.com/p/test3",
        "previewUrl": "https://protolink.company.com/preview/test3",
        "createdAt": "2025-04-22T10:00:00Z"
      },
      {
        "id": "00001111-2222-3333-4444-555566667778",
        "name": "测试原型2",
        "shortLink": "test2",
        "accessUrl": "https://protolink.company.com/p/test2",
        "previewUrl": "https://protolink.company.com/preview/test2",
        "createdAt": "2025-04-21T10:00:00Z"
      }
    ],
    "total": 3,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  },
  "responseTime": 42
}
```

**响应字段说明：**

| 字段名 | 类型 | 描述 |
|-------|------|-----|
| success | Boolean | 接口是否成功 |
| data.items | Array | 原型列表 |
| data.items[].id | String | 原型ID |
| data.items[].name | String | 原型名称 |
| data.items[].shortLink | String | 短链接码 |
| data.items[].accessUrl | String | 访问地址 |
| data.items[].previewUrl | String | 预览地址 |
| data.items[].createdAt | String | 创建时间 |
| data.total | Number | 总条数 |
| data.page | Number | 当前页码 |
| data.pageSize | Number | 每页条数 |
| data.totalPages | Number | 总页数 |
| responseTime | Number | 接口响应时间（毫秒） |

**HTTP状态码：**

| 状态码 | 说明 |
|-------|------|
| 200 | 成功 |
| 500 | 服务器内部错误 |

## 性能说明

原型列表API接口的响应时间应小于1秒，以确保良好的用户体验。 