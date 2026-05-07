# CinemaVault 後端 - 完整設置指南

## 📋 目錄

- [前置要求](#前置要求)
- [本地開發設置](#本地開發設置)
- [環境配置](#環境配置)
- [啟動服務器](#啟動服務器)
- [Docker 部署](#docker-部署)
- [API 測試](#api-測試)
- [架構設計](#架構設計)
- [常見問題](#常見問題)

---

## 前置要求

### 系統要求

- **Node.js**: 18.0 或更高版本
- **npm**: 9.0 或更高版本（或 yarn/pnpm）
- **SQLite 3** (通常已預裝)
- **Git** (用於版本控制)

### 可選項

- **Docker** 和 **Docker Compose** (用於容器化部署)
- **Postman** 或 **Insomnia** (用於 API 測試)

---

## 本地開發設置

### 1. 克隆倉庫

```bash
git clone <repository-url>
cd cinemavault-backend
```

### 2. 安裝依賴

```bash
npm install
```

或使用其他包管理器：

```bash
yarn install
# 或
pnpm install
```

### 3. 創建環境配置文件

```bash
cp .env.example .env
```

### 4. 配置環境變量

編輯 `.env` 文件並設置以下值：

```env
# 服務器配置
PORT=3000
NODE_ENV=development

# JWT 密鑰（開發時可使用示例值，生產環境必須更改！）
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# OMDB API 配置
OMDB_API_KEY=your_omdb_api_key_here
OMDB_API_URL=https://www.omdbapi.com

# 數據庫配置
DATABASE_URL=./data/cinemavault.db
DATABASE_TYPE=sqlite

# CORS 配置
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173

# 日誌級別
LOG_LEVEL=debug
```

### 5. 獲取 OMDB API 密鑰

1. 訪問 [OMDB API 網站](https://www.omdbapi.com/)
2. 點擊 "API Key" 選項卡
3. 填寫表單並獲取免費 API 密鑰
4. 將其添加到 `.env` 文件中的 `OMDB_API_KEY`

### 6. 初始化數據庫

```bash
npm run db:init
```

這將創建所有必需的表和索引。

---

## 環境配置

### 開發環境 (.env)

```env
NODE_ENV=development
JWT_SECRET=dev-secret-key
OMDB_API_KEY=your_dev_key
DATABASE_TYPE=sqlite
LOG_LEVEL=debug
```

### 生產環境 (.env.production)

```env
NODE_ENV=production
JWT_SECRET=your_strong_production_secret_key_here
OMDB_API_KEY=your_production_key
DATABASE_TYPE=sqlite
LOG_LEVEL=info
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**⚠️ 重要**: 不要在代碼中提交 `.env` 文件，始終使用 `.env.example` 作為模板。

---

## 啟動服務器

### 開發模式（熱重載）

```bash
npm run dev
```

輸出應該類似於：

```
╔════════════════════════════════════════╗
║  CinemaVault Backend API               ║
║  Server running on port 3000           ║
║  Environment: development              ║
║  http://localhost:3000                 ║
╚════════════════════════════════════════╝
```

### 生產模式

```bash
# 先編譯 TypeScript
npm run build

# 然後運行
npm start
```

### 檢查服務器健康狀態

```bash
curl http://localhost:3000/health
```

預期響應：

```json
{
  "status": "ok",
  "timestamp": "2026-05-07T10:00:00Z"
}
```

---

## Docker 部署

### 使用 Docker Compose（推薦）

#### 1. 構建並運行容器

```bash
docker-compose up -d
```

#### 2. 查看日誌

```bash
docker-compose logs -f
```

#### 3. 停止服務

```bash
docker-compose down
```

#### 4. 重建鏡像（更新代碼後）

```bash
docker-compose up -d --build
```

### 使用 Docker

#### 1. 構建鏡像

```bash
npm run build
docker build -t cinemavault-backend:latest .
```

#### 2. 運行容器

```bash
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your_secret_key \
  -e OMDB_API_KEY=your_api_key \
  -v $(pwd)/data:/app/data \
  --name cinemavault-backend \
  cinemavault-backend:latest
```

#### 3. 訪問日誌

```bash
docker logs -f cinemavault-backend
```

---

## API 測試

### 使用 cURL

#### 1. 註冊新用戶

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

#### 2. 登錄

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

複製響應中的 `token` 值。

#### 3. 獲取用戶信息

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. 獲取所有電影

```bash
curl -X GET "http://localhost:3000/api/movies?limit=10&offset=0"
```

#### 5. 從 OMDB 創建電影

```bash
curl -X POST http://localhost:3000/api/movies/omdb/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Inception"
  }'
```

### 使用 Postman

1. 導入 API 集合（見下文）
2. 設置環境變量：
   - `base_url`: http://localhost:3000/api
   - `token`: （從登錄響應複製）
3. 開始測試 API

#### Postman 環境設置示例

```json
{
  "name": "CinemaVault Local",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api",
      "enabled": true
    },
    {
      "key": "token",
      "value": "",
      "enabled": true
    }
  ]
}
```

---

## 架構設計

### 文件夾結構

```
cinemavault-backend/
├── src/
│   ├── config/                 # 配置文件
│   │   └── index.ts           # 主配置
│   ├── controllers/           # 控制器（HTTP 請求處理）
│   │   ├── AuthController.ts
│   │   ├── MovieController.ts
│   │   ├── WatchlistController.ts
│   │   ├── RatingController.ts
│   │   ├── ReviewController.ts
│   │   └── index.ts
│   ├── services/              # 業務邏輯層
│   │   ├── AuthService.ts
│   │   ├── MovieService.ts
│   │   ├── WatchlistService.ts
│   │   ├── RatingService.ts
│   │   ├── ReviewService.ts
│   │   └── index.ts
│   ├── database/              # 數據庫相關
│   │   ├── index.ts           # 數據庫初始化
│   │   ├── models.ts          # 數據模型
│   │   ├── repositories/      # 數據訪問層
│   │   │   ├── UserRepository.ts
│   │   │   ├── MovieRepository.ts
│   │   │   ├── WatchlistRepository.ts
│   │   │   ├── RatingRepository.ts
│   │   │   ├── ReviewRepository.ts
│   │   │   └── index.ts
│   │   └── init.ts            # 初始化腳本
│   ├── routes/                # API 路由
│   │   ├── auth.ts
│   │   ├── movies.ts
│   │   ├── watchlist.ts
│   │   ├── ratings.ts
│   │   ├── reviews.ts
│   │   └── index.ts
│   ├── middleware/            # 中間件
│   │   ├── setup.ts           # 全局中間件設置
│   │   ├── auth.ts            # 認證中間件
│   │   └── index.ts
│   ├── validators/            # 數據驗證
│   │   ├── schemas.ts         # Joi 驗證架構
│   │   ├── middleware.ts      # 驗證中間件
│   │   └── index.ts
│   ├── utils/                 # 工具函數
│   │   ├── auth.ts            # JWT 和密碼工具
│   │   ├── omdb.ts            # OMDB API 整合
│   │   ├── errors.ts          # 錯誤處理
│   │   └── index.ts
│   ├── types/                 # TypeScript 類型
│   │   └── express.ts         # Express 類型擴展
│   └── index.ts               # 應用主入口
├── dist/                      # 編譯後的 JavaScript（運行時）
├── data/                      # SQLite 數據庫文件
├── package.json
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
├── API.md
└── SETUP.md (本文件)
```

### 層級架構

```
┌─────────────────────┐
│   HTTP 請求          │
└────────────┬────────┘
             │
┌────────────▼────────────┐
│  中間件層 (Middleware)   │
│  - CORS, 安全, 認證      │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│  路由層 (Routes)        │
│  - 路由定義和驗證       │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│  控制器層 (Controllers)  │
│  - HTTP 請求處理        │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│  業務邏輯層 (Services)   │
│  - 核心業務邏輯         │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│  數據層 (Repositories)   │
│  - 數據庫操作           │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│  數據庫 (SQLite)         │
│  - 數據持久化           │
└─────────────────────────┘
```

### 主要特性

#### 1. 模塊化設計
- 清晰的分層架構
- 每個層級職責分明
- 易于測試和維護

#### 2. 安全性
- JWT Token 認證
- CORS 限制
- Helmet 安全頭部
- 密碼加密存儲 (bcryptjs)
- 數據驗證 (Joi)

#### 3. 性能
- 數據庫索引優化
- 連接池管理
- 請求日誌記錄 (Morgan)

#### 4. 可擴展性
- 易于添加新的業務邏輯
- 支持 OMDB API 集成
- 支持 Docker 容器化

---

## 常見問題

### Q: 如何更改 JWT 密鑰？

**A:** 編輯 `.env` 文件中的 `JWT_SECRET`：

```env
JWT_SECRET=your_new_secret_key_here
```

**注意**: 更改後，所有現有的 token 都會失效。

### Q: 如何添加新的 API 端點？

**A:** 按照以下步驟：

1. **創建 Validator Schema** (src/validators/schemas.ts)
2. **創建 Service 類** (src/services/)
3. **創建 Controller 方法** (src/controllers/)
4. **添加路由** (src/routes/)
5. **測試 API**

### Q: 如何部署到生產環境？

**A:** 推薦使用 Docker：

```bash
npm run build
docker build -t cinemavault-backend:latest .
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=$(openssl rand -hex 32) \
  -e OMDB_API_KEY=your_key \
  --restart unless-stopped \
  cinemavault-backend:latest
```

### Q: 如何備份數據庫？

**A:** SQLite 數據庫存儲在 `data/cinemavault.db`，只需複製此文件即可：

```bash
cp data/cinemavault.db data/cinemavault.db.backup
```

### Q: 如何重置數據庫？

**A:** 刪除數據庫文件並重新初始化：

```bash
rm -f data/cinemavault.db
npm run db:init
```

### Q: OMDB API 配額有限制嗎？

**A:** 是的。免費版本有以下限制：
- 每天 1,000 個請求
- 每秒 10 個請求

超過限制會收到 402 錯誤。

### Q: 如何調試應用程序？

**A:** 使用 VS Code 調試器或 Node.js 調試器：

```bash
node --inspect-brk dist/index.js
```

然後在 Chrome DevTools 中訪問 `chrome://inspect`。

### Q: 如何運行單元測試？

**A:** 當前項目未包含測試框架。要添加 Jest，運行：

```bash
npm install --save-dev jest @types/jest ts-jest
```

然後創建 `jest.config.js` 和測試文件。

---

## 相關資源

- [Express.js 文檔](https://expressjs.com/)
- [TypeScript 文檔](https://www.typescriptlang.org/)
- [SQLite 文檔](https://www.sqlite.org/docs.html)
- [JWT 介紹](https://jwt.io/)
- [OMDB API 文檔](https://www.omdbapi.com/)
- [Docker 文檔](https://docs.docker.com/)

---

## 支持和反饋

如有任何問題或建議，請：
1. 檢查 FAQ 部分
2. 查看代碼註釋和文檔
3. 提交 Issue 或 Pull Request

---

**最後更新**: 2026年5月7日
**版本**: 1.0.0

