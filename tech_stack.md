 # ProtoLink - 技术架构设计文档

## 1. 技术栈推荐

### 1.1 前端技术栈

| 技术/框架 | 推荐选型 | 选择理由 |
|----------|---------|---------|
| 核心框架 | React | 轻量级原型预览平台适合使用组件化思想；React生态成熟，开发效率高；满足交互反馈需求（如上传进度反馈、iframe预览等） |
| UI组件库 | Ant Design | 企业级UI组件库，提供丰富的表单、表格、上传组件；设计规范统一；支持主题定制 |
| 构建工具 | Vite | 快速的开发服务器启动和热更新；优化的构建性能；模块化支持完善 |
| 路由管理 | React Router | 满足原型管理页与预览页的路由切换需求；支持嵌套路由 |
| 状态管理 | Context API + Hooks | 应用规模较小，无需引入Redux等复杂状态管理；使用React内置方案保持轻量 |
| HTTP客户端 | Axios | 处理文件上传进度监听；兼容性好；拦截器功能满足统一错误处理 |
| 类型检查 | TypeScript | 提高代码质量和可维护性；增强开发时的类型提示 |

### 1.2 后端技术栈

| 技术/框架 | 推荐选型 | 选择理由 |
|----------|---------|---------|
| 核心框架 | Node.js + Express | 轻量级应用适合使用Node.js；处理静态文件服务高效；与前端技术栈技术统一，降低维护成本 |
| 文件处理 | Multer | Express中间件，专门处理multipart/form-data格式；支持多文件上传和目录结构保持 |
| API规范 | RESTful | 简单直观的API设计，满足原型CRUD需求；易于理解和维护 |
| 身份验证 | JWT | 轻量级无状态认证方案；可扩展支持未来SSO集成需求 |

### 1.3 API交互与安全策略

| 策略类型 | 推荐方案 | 说明 |
|----------|---------|------|
| API协议 | RESTful HTTP JSON | 简单明确的资源操作模型；JSON序列化支持良好 |
| CORS策略 | 企业域白名单 | 限制只允许企业内部域名访问API，防止外部调用 |
| 安全传输 | HTTPS | 满足PRD中"全程使用HTTPS"的非功能需求 |
| 认证机制 | JWT | 支持后续扩展为企业SSO，实现更严格的访问控制 |
| 文件校验 | MIME类型 + 大小限制 | 限制只上传HTML及相关资源文件；防止恶意文件上传 |
| 短链保护 | 随机哈希 + 访问控制 | 生成不可预测的短链接，避免遍历攻击 |

## 2. 数据库与存储方案

### 2.1 原型文件存储（静态资源）

| 方案       | 理由                               |
|------------|------------------------------------|
| 本地文件系统（开发阶段） | 实现简单，部署灵活              |
| 阿里云 OSS / AWS S3 / 腾讯云 COS | 企业部署推荐，支持对象存储与 CDN 加速 |

### 2.2  结构化数据存储（用户/原型元数据/链接）

| 方案       | 理由                               |
|------------|------------------------------------|
| MongoDB    | 适用于灵活的文档结构存储，便于原型元数据变更扩展 |
| PostgreSQL（备选） | 若需复杂关系与权限管理，则推荐使用关系型数据库 |

| 数据结构参考 | 字段示例                        |
|--------------|----------------------------------|
| Prototypes   | id, name, uploadTime, shortUrl, filePath |
| Users（预留）| id, username, role, token        |

#### 核心表结构设计

**prototypes表**（原型记录表）
```
- id: UUID (主键)
- name: VARCHAR(255) (原型名称)
- short_link: VARCHAR(20) (唯一短链接码)
- file_path: VARCHAR(255) (服务器存储路径)
- created_at: TIMESTAMP (创建时间)
- updated_at: TIMESTAMP (更新时间)
- created_by: UUID (创建用户，外键关联users表)
- metadata: JSONB (可扩展元数据)
```

**users表**（用户表，支持未来扩展）
```
- id: UUID (主键)
- username: VARCHAR(50) (用户名)
- email: VARCHAR(100) (邮箱)
- password_hash: VARCHAR(255) (密码哈希，预留字段)
- created_at: TIMESTAMP (创建时间)
- updated_at: TIMESTAMP (更新时间)
```

## 3. 项目目录结构设计

### 3.1 前端项目结构

```
protolink-frontend/
├── public/                # 静态资源
├── src/
│   ├── api/               # API请求封装
│   │   ├── prototype.ts   # 原型相关API
│   │   └── upload.ts      # 上传相关API
│   ├── components/        # 通用组件
│   │   ├── Upload/        # 文件上传组件
│   │   ├── ProgressBar/   # 进度条组件
│   │   └── LinkDisplay/   # 链接展示组件
│   ├── hooks/             # 自定义Hooks
│   │   └── useUpload.ts   # 上传逻辑Hook
│   ├── pages/             # 页面组件
│   │   ├── Home/          # 首页（上传页）
│   │   ├── Preview/       # 原型预览页
│   │   └── Management/    # 原型管理页
│   ├── types/             # TypeScript类型定义
│   ├── utils/             # 工具函数
│   ├── App.tsx            # 应用入口组件
│   ├── index.tsx          # 应用入口点
│   └── router.tsx         # 路由配置
├── .eslintrc.js           # ESLint配置
├── tsconfig.json          # TypeScript配置
├── vite.config.ts         # Vite配置
└── package.json           # 依赖管理
```

### 3.2 后端项目结构

```
protolink-backend/
├── src/
│   ├── controllers/       # 控制器层
│   │   ├── prototype.js   # 原型相关控制器
│   │   └── upload.js      # 上传相关控制器
│   ├── middlewares/       # 中间件
│   │   ├── auth.js        # 认证中间件
│   │   ├── upload.js      # 文件上传中间件
│   │   └── error.js       # 错误处理中间件
│   ├── models/            # 数据模型
│   │   ├── prototype.js   # 原型模型
│   │   └── user.js        # 用户模型
│   ├── routes/            # 路由
│   │   ├── prototype.js   # 原型相关路由
│   │   └── upload.js      # 上传相关路由
│   ├── services/          # 业务逻辑
│   │   ├── prototype.js   # 原型服务
│   │   ├── shortlink.js   # 短链接服务
│   │   └── storage.js     # 存储服务
│   ├── utils/             # 工具函数
│   │   ├── logger.js      # 日志工具
│   │   └── validate.js    # 验证工具
│   ├── config/            # 配置文件
│   │   ├── database.js    # 数据库配置
│   │   └── app.js         # 应用配置
│   └── app.js             # 应用入口
├── .env                   # 环境变量
├── .eslintrc.js           # ESLint配置
└── package.json           # 依赖管理
```

### 3.3 前后端协作方式

| 协作点 | 实现方式 | 说明 |
|-------|---------|------|
| API契约 | OpenAPI规范 | 定义清晰的API文档，便于前后端理解接口 |
| 状态码规范 | HTTP标准状态码 | 使用标准HTTP状态码表达API结果 |
| 数据交换 | JSON格式 | 前后端数据交换使用JSON格式 |
| 错误处理 | 统一错误响应格式 | `{ code: number, message: string, details?: any }` |
| 上传协议 | multipart/form-data | 支持大文件和目录结构上传 |
| 环境划分 | 开发/测试/生产 | 各环境配置独立，确保开发测试不影响生产 |

## 4. 功能模块组件设计

### 4.1 文件上传模块组件

#### 4.1.1 文件夹上传组件（FileUploader）

**职责**：
- 支持拖拽上传和文件选择框上传Axure HTML文件夹
- 处理文件夹结构保持和传输
- 提供上传状态和进度反馈

**依赖**：
- ProgressBar组件
- Toast消息组件
- Upload API服务

**接口**：
```typescript
// 输入接口
interface FileUploaderProps {
  onUploadSuccess: (result: { id: string, shortLink: string }) => void;
  onUploadFail: (error: Error) => void;
  maxSize?: number; // 最大上传大小(MB)
}

// 输出接口
interface UploadResult {
  id: string;       // 原型ID
  shortLink: string; // 生成的短链接
  name: string;     // 原型名称
}
```

**复用策略**：
- 独立组件，可在不同页面复用
- 上传逻辑抽离为useUpload自定义Hook

#### 4.1.2 后端文件处理服务（StorageService）

**职责**：
- 接收并处理multipart/form-data格式的文件上传
- 在服务器文件系统中保持目录结构
- 生成唯一文件路径

**依赖**：
- Multer中间件
- 文件系统模块
- 原型数据模型

**接口**：
```typescript
// 服务接口
interface StorageService {
  savePrototype(files: File[], meta: { name: string }): Promise<{ id: string, path: string }>;
  getPrototypePath(id: string): Promise<string>;
  deletePrototype(id: string): Promise<boolean>;
}
```

**复用策略**：
- 核心存储逻辑集中在StorageService中
- 支持未来扩展到对象存储

### 4.2 链接生成模块组件

#### 4.2.1 短链接生成服务（ShortLinkService）

**职责**：
- 为每个上传的原型生成唯一短链接
- 确保链接唯一性和不可预测性
- 提供链接持久化存储

**依赖**：
- 数据库原型模型
- 随机生成库

**接口**：
```typescript
// 服务接口
interface ShortLinkService {
  generateLink(prototypeId: string): Promise<string>;
  resolveLink(shortLink: string): Promise<string>; // 返回原型ID
}
```

**复用策略**：
- 独立服务，可被多个控制器调用
- 算法封装，支持未来定制短链接生成策略

#### 4.2.2 链接展示组件（LinkDisplay）

**职责**：
- 展示生成的短链接
- 提供链接复制功能
- 显示复制状态反馈

**依赖**：
- 剪贴板API
- Toast消息组件

**接口**：
```typescript
// 输入接口
interface LinkDisplayProps {
  link: string;
  onPreview?: () => void;
}
```

**复用策略**：
- 独立UI组件，可在上传成功页和管理页面复用

### 4.3 原型预览模块组件

#### 4.3.1 iframe预览组件（PrototypeViewer）

**职责**：
- 通过iframe加载HTML原型
- 处理iframe跨域安全问题
- 提供全屏预览选项

**依赖**：
- 原型数据服务

**接口**：
```typescript
// 输入接口
interface PrototypeViewerProps {
  prototypeId: string;
  shortLink?: string;
}
```

**复用策略**：
- 独立页面组件，通过路由直接访问
- 预览逻辑抽离，支持嵌入和独立访问两种模式

### 4.4 原型管理模块组件

#### 4.4.1 原型列表组件（PrototypeList）

**职责**：
- 展示用户上传的原型列表
- 支持分页加载
- 提供预览和删除操作

**依赖**：
- 原型API服务
- 表格组件
- 确认对话框组件

**接口**：
```typescript
// 输入接口
interface PrototypeListProps {
  pageSize?: number;
  onPreview: (id: string) => void;
  onDelete: (id: string) => void;
}

// 数据接口
interface PrototypeItem {
  id: string;
  name: string;
  shortLink: string;
  createdAt: string;
  previewUrl: string;
}
```

**复用策略**：
- 业务组件，在管理页面使用
- 分页逻辑抽离为自定义Hook

#### 4.4.2 原型数据服务（PrototypeService）

**职责**：
- 提供原型CRUD操作
- 处理原型元数据管理
- 支持分页和筛选

**依赖**：
- 数据库模型
- 存储服务
- 短链接服务

**接口**：
```typescript
// 服务接口
interface PrototypeService {
  listPrototypes(page: number, pageSize: number): Promise<{
    items: PrototypeItem[],
    total: number
  }>;
  getPrototype(id: string): Promise<PrototypeItem>;
  deletePrototype(id: string): Promise<boolean>;
}
```

**复用策略**：
- 核心业务逻辑集中在服务层
- 控制器负责请求处理，服务负责业务逻辑

## 5. 未来扩展规划

### 5.1 企业级功能扩展

| 功能 | 实现方案 | 技术架构预留 |
|------|---------|------------|
| SSO集成 | OIDC/SAML协议 | 认证中间件支持多种认证策略 |
| 权限控制 | RBAC模型 | 用户表预留角色字段；路由支持权限中间件 |
| 团队协作 | 多租户模型 | 表结构预留组织ID；存储路径支持团队隔离 |
| 版本管理 | 原型版本历史 | 数据结构支持版本链接；存储方案支持多版本 |
| 大规模部署 | 容器化 | 服务拆分设计；无状态API设计支持水平扩展 |

### 5.2 性能与可扩展性考量

- 文件服务支持CDN集成，提升访问速度
- 数据库设计考虑分表分库，支持大规模数据
- API设计支持缓存层接入，提升重复访问性能
- 服务间通信预留消息队列接入点，支持异步处理

## 6. 设计合理性依据

本技术架构设计基于PRD中的需求和约束，合理性体现在：

1. **轻量级解决方案**：选择React+Node.js技术栈符合"轻量级原型托管平台"的项目定位
2. **安全合规**：采用本地文件存储符合"文件保存仅限企业内部网络"的合规要求
3. **性能保障**：文件直接服务+CDN可能支持符合"首次加载时间≤3s"的性能指标
4. **高可用性**：Node.js集群部署+负载均衡可实现"≥99.9%月度可用性"
5. **功能完备**：技术组件全面覆盖四大核心模块的所有功能点
6. **扩展性考虑**：预留企业级功能扩展接口，支持未来业务演进