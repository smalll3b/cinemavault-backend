# CinemaVault Backend

## 项目结构
```
src/
  ├── config/          # 配置文件
  ├── controllers/     # 控制器（处理HTTP请求）
  ├── services/        # 业务逻辑层
  ├── models/          # 数据模型
  ├── middleware/      # 中间件
  ├── validators/      # 数据验证规则
  ├── routes/          # 路由定义
  ├── database/        # 数据库相关
  ├── utils/           # 工具函数
  ├── types/           # TypeScript类型定义
  └── index.ts         # 入口文件
```

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置：
- JWT_SECRET（生产环境要更改）
- OMDB_API_KEY（从 https://www.omdbapi.com 获取）
- 其他配置项

### 3. 初始化数据库
```bash
npm run db:init
```

### 4. 开发模式运行
```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动

## API 端点

### 用户认证
- `POST /api/auth/register` - 注册新用户
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取当前用户信息

### 电影管理
- `GET /api/movies` - 获取电影列表
- `GET /api/movies/:id` - 获取电影详情
- `POST /api/movies` - 创建电影（需要认证）
- `PUT /api/movies/:id` - 更新电影（需要认证）
- `DELETE /api/movies/:id` - 删除电影（需要认证）

### 观影单
- `POST /api/watchlist` - 添加到观影单
- `GET /api/watchlist` - 获取观影单
- `DELETE /api/watchlist/:id` - 从观影单删除

### 评分与评论
- `POST /api/ratings` - 提交评分
- `GET /api/ratings/:movieId` - 获取电影评分
- `POST /api/reviews` - 发表评论
- `GET /api/reviews/:movieId` - 获取电影评论

## 技术栈
- Express.js - Web框架
- SQLite - 数据库
- JWT - 身份认证
- Joi - 数据验证
- TypeScript - 类型安全
- OMDB API - 电影元数据

## 安全特性
- JWT Token认证
- CORS限制
- Helmet安全头部
- 密码加密存储（bcryptjs）
- 数据验证（Joi）
- 权限检查

## 环境变量

| 变量名 | 描述 | 示例 |
|--------|------|------|
| PORT | 服务器端口 | 3000 |
| NODE_ENV | 运行环境 | development |
| JWT_SECRET | JWT密钥 | your_secret_key |
| OMDB_API_KEY | OMDB API密钥 | your_omdb_key |
| DATABASE_URL | 数据库路径 | ./data/cinemavault.db |

## License
MIT

