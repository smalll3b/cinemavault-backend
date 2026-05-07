# CinemaVault 後端項目架構總結

## 📊 項目概況

**CinemaVault** 是一個完整的電影庫管理系統的後端服務，提供 REST API 支持用戶認證、電影管理、觀影單、評分和評論功能。

### 快速事實

- **框架**: Express.js 4.18+
- **語言**: TypeScript 5.3+
- **數據庫**: SQLite 3
- **認證**: JWT (JSON Web Token)
- **驗證**: Joi
- **外部 API**: OMDB
- **部署**: Docker & Docker Compose

---

## 🏗️ 架構概覽

### 1. 模塊化分層設計

```
┌─────────────────────────────────────┐
│     HTTP 客戶端 (前端/移動端)       │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│        中間件層 (Middleware)         │
│  ✓ CORS    ✓ Helmet   ✓ Morgan     │
│  ✓ JWT驗證 ✓ 錯誤處理 ✓ 請求日誌   │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│          路由層 (Routes)             │
│  ✓ 路由匹配   ✓ 請求分發            │
│  ✓ 參數校驗   ✓ 權限檢查            │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│       控制器層 (Controllers)         │
│  ✓ 請求處理  ✓ 響應格式化          │
│  ✓ 服務調用  ✓ 錯誤捕獲            │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│       業務邏輯層 (Services)          │
│  ✓ 用戶認證  ✓ 電影管理            │
│  ✓ 觀影單   ✓ 評分評論            │
│  ✓ 業務規則  ✓ 數據驗證            │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│   數據持久化層 (Repositories)        │
│  ✓ CRUD操作  ✓ 查詢建築            │
│  ✓ 事務管理  ✓ 索引優化            │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│     數據庫層 (SQLite Database)       │
│  ✓ 數據存儲  ✓ 事務                 │
│  ✓ 索引      ✓ 約束                 │
└─────────────────────────────────────┘
```

### 2. 文件結構 (完整映射)

```
cinemavault-backend/
│
├── 📦 src/
│   ├── 🔧 config/
│   │   └── index.ts              # 環境和配置管理
│   │
│   ├── 🎮 controllers/
│   │   ├── AuthController.ts     # 認證相關
│   │   ├── MovieController.ts    # 電影 CRUD
│   │   ├── WatchlistController.ts# 觀影單管理
│   │   ├── RatingController.ts   # 評分管理
│   │   ├── ReviewController.ts   # 評論管理
│   │   └── index.ts
│   │
│   ├── 💼 services/
│   │   ├── AuthService.ts        # 認證業務邏輯
│   │   ├── MovieService.ts       # 電影業務邏輯
│   │   ├── WatchlistService.ts   # 觀影單邏輯
│   │   ├── RatingService.ts      # 評分邏輯
│   │   ├── ReviewService.ts      # 評論邏輯
│   │   └── index.ts
│   │
│   ├── 💾 database/
│   │   ├── index.ts              # 數據庫初始化
│   │   ├── models.ts             # TypeScript 模型
│   │   ├── init.ts               # 初始化腳本
│   │   └── repositories/
│   │       ├── UserRepository.ts # 用戶數據層
│   │       ├── MovieRepository.ts# 電影數據層
│   │       ├── WatchlistRepository.ts
│   │       ├── RatingRepository.ts
│   │       ├── ReviewRepository.ts
│   │       └── index.ts
│   │
│   ├── 🛣️ routes/
│   │   ├── auth.ts               # 認證路由
│   │   ├── movies.ts             # 電影路由
│   │   ├── watchlist.ts          # 觀影單路由
│   │   ├── ratings.ts            # 評分路由
│   │   ├── reviews.ts            # 評論路由
│   │   └── index.ts
│   │
│   ├── 🧭 middleware/
│   │   ├── setup.ts              # CORS, Helmet, Morgan
│   │   ├── auth.ts               # JWT 驗證中間件
│   │   └── index.ts
│   │
│   ├── ✅ validators/
│   │   ├── schemas.ts            # Joi 驗證架構
│   │   ├── middleware.ts         # 驗證中間件
│   │   └── index.ts
│   │
│   ├── 🛠️ utils/
│   │   ├── auth.ts               # JWT/密碼工具
│   │   ├── omdb.ts               # OMDB API 客戶端
│   │   ├── errors.ts             # 錯誤類和格式化
│   │   └── index.ts
│   │
│   ├── 📝 types/
│   │   └── express.ts            # Express 類型擴展
│   │
│   └── 🚀 index.ts               # 應用入口
│
├── 📦 dist/                       # TypeScript 編譯輸出
├── 💾 data/
│   └── cinemavault.db            # SQLite 數據庫文件
│
├── 📋 配置文件
│   ├── package.json              # NPM 依賴和腳本
│   ├── tsconfig.json             # TypeScript 配置
│   ├── .env.example              # 環境變量模板
│   ├── .gitignore                # Git 忽略規則
│   ├── .eslintrc.json            # ESLint 配置
│   └── .prettierrc                # Prettier 配置
│
├── 🐳 Docker 配置
│   ├── Dockerfile                # Docker 鏡像定義
│   ├── docker-compose.yml        # Docker Compose 定義
│   └── .dockerignore             # Docker 忽略規則
│
└── 📚 文檔
    ├── README.md                 # 項目簡介
    ├── SETUP.md                  # 安裝和運行指南
    ├── API.md                    # API 文檔
    ├── DEVELOPMENT.md            # 開發指南
    └── ARCHITECTURE.md           # 本文件
```

---

## 🔐 安全特性實現

### 1. JWT 認證流程

```
用戶登錄
   ↓
驗證郵箱和密碼
   ↓
生成 JWT Token
   ├─ userId
   ├─ email
   ├─ role
   └─ expiresIn: 7天
   ↓
返回 Token 給客戶端
   ↓
客戶端在後續請求中帶上 Token
   ↓
服務器驗證 Token 簽名和過期時間
   ↓
允許或拒絕請求
```

### 2. 密碼安全

```typescript
// 使用 bcryptjs 進行密碼加密
const hashedPassword = await bcrypt.hash(password, saltRounds: 10);

// 驗證密碼時進行比對
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### 3. CORS 配置

```typescript
// 只允許特定來源的跨域請求
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://yourdomain.com'
];

// 檢查請求來源
if (allowedOrigins.includes(origin)) {
  callback(null, true);
} else {
  callback(new Error('CORS not allowed'));
}
```

### 4. 數據驗證

```typescript
// 使用 Joi 進行 JSON Schema 驗證
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).required()
});

// 驗證傳入數據
const { error, value } = registerSchema.validate(req.body);
```

### 5. 安全頭部 (Helmet)

```typescript
// 自動設置安全 HTTP 頭
app.use(helmet());

// 包括：
// - Content-Security-Policy
// - X-Frame-Options: DENY
// - X-Content-Type-Options: nosniff
// - X-XSS-Protection
```

---

## 📊 數據庫設計

### 表結構

#### Users 表
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users(email);
```

#### Movies 表
```sql
CREATE TABLE movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  year INTEGER,
  imdb_id TEXT UNIQUE,
  poster TEXT,
  plot TEXT,
  runtime INTEGER,
  genre TEXT,
  director TEXT,
  actors TEXT,
  external_rating REAL,
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);
CREATE INDEX idx_movies_imdb_id ON movies(imdb_id);
CREATE INDEX idx_movies_title ON movies(title);
```

#### Watchlist 表
```sql
CREATE TABLE watchlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  movie_id INTEGER NOT NULL,
  status TEXT DEFAULT 'to-watch',
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  UNIQUE(user_id, movie_id)
);
```

#### Ratings 表
```sql
CREATE TABLE ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  movie_id INTEGER NOT NULL,
  rating REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  UNIQUE(user_id, movie_id)
);
```

#### Reviews 表
```sql
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  movie_id INTEGER NOT NULL,
  review_text TEXT NOT NULL,
  rating REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id)
);
```

---

## 🔌 API 端點列表

| 方法 | 端點 | 認證 | 描述 |
|------|------|------|------|
| POST | /api/auth/register | ❌ | 用戶註冊 |
| POST | /api/auth/login | ❌ | 用戶登錄 |
| GET | /api/auth/profile | ✅ | 獲取用戶信息 |
| GET | /api/movies | ❌ | 獲取電影列表 |
| GET | /api/movies/:id | ❌ | 獲取電影詳情 |
| GET | /api/movies/search | ❌ | 搜索電影 |
| POST | /api/movies | ✅ | 創建電影 |
| POST | /api/movies/omdb/create | ✅ | 從 OMDB 創建電影 |
| PUT | /api/movies/:id | ✅ | 更新電影 |
| DELETE | /api/movies/:id | ✅ | 刪除電影 |
| POST | /api/watchlist | ✅ | 添加到觀影單 |
| GET | /api/watchlist | ✅ | 獲取觀影單 |
| PUT | /api/watchlist/:id | ✅ | 更新觀影單狀態 |
| DELETE | /api/watchlist/:id | ✅ | 刪除觀影單項 |
| POST | /api/ratings | ✅ | 提交評分 |
| GET | /api/ratings/:movieId | ❌ | 獲取電影評分 |
| PUT | /api/ratings/:id | ✅ | 更新評分 |
| DELETE | /api/ratings/:id | ✅ | 刪除評分 |
| POST | /api/reviews | ✅ | 發表評論 |
| GET | /api/reviews/movie/:movieId | ❌ | 獲取電影評論 |
| GET | /api/reviews/user/reviews | ✅ | 獲取用戶評論 |
| PUT | /api/reviews/:id | ✅ | 更新評論 |
| DELETE | /api/reviews/:id | ✅ | 刪除評論 |

---

## 🔄 典型請求流程

### 用戶登錄並創建電影的完整流程

```
1️⃣  客戶端發送登錄請求
    POST /api/auth/login
    {
      "email": "user@example.com",
      "password": "password123"
    }

2️⃣  驗證中間件處理
    ├─ 檢查 Content-Type
    ├─ 解析 JSON 體
    └─ 通過管道

3️⃣  路由匹配
    └─ 找到 POST /api/auth/login 路由

4️⃣  驗證層
    ├─ 使用 Joi schema 驗證
    ├─ 檢查郵箱格式
    ├─ 檢查密碼長度
    └─ 通過驗證

5️⃣  控制器層
    └─ AuthController.login() 調用

6️⃣  服務層
    ├─ AuthService.login()
    ├─ 查詢用戶
    ├─ 比對密碼
    └─ 生成 JWT

7️⃣  響應
    {
      "success": true,
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
          "id": 1,
          "email": "user@example.com",
          "username": "username",
          "role": "user"
        }
      }
    }

8️⃣  客戶端保存 Token
    localStorage.setItem('token', response.data.token);

9️⃣  客戶端發送創建電影請求
    POST /api/movies
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    {
      "title": "Inception",
      "year": 2010,
      "plot": "..."
    }

🔟 JWT 驗證中間件
    ├─ 從 Authorization header 提取 token
    ├─ 驗證簽名
    ├─ 檢查過期時間
    ├─ 添加 user 信息到 request
    └─ 通過驗證

1️⃣1️⃣ 路由 + 驗證層
    ├─ 匹配 POST /api/movies
    ├─ 驗證請求體
    └─ 通過驗證

1️⃣2️⃣ 控制器層
    └─ MovieController.createMovie()

1️⃣3️⃣ 服務層
    └─ MovieService.createMovie()

1️⃣4️⃣ Repository 層
    ├─ 檢查 IMDB ID 是否已存在
    ├─ 執行 INSERT 語句
    └─ 返回新記錄

1️⃣5️⃣ 響應
    {
      "success": true,
      "message": "Movie created successfully",
      "data": {
        "id": 1,
        "title": "Inception",
        "year": 2010,
        ...
      }
    }
```

---

## 🚀 性能優化

### 1. 數據庫索引

- `idx_movies_imdb_id` - 快速查找IMDB電影
- `idx_users_email` - 快速驗證用戶
- `idx_watchlist_user_id` - 快速獲取用戶觀影單
- `idx_ratings_movie_id` - 快速獲取電影評分
- `idx_reviews_movie_id` - 快速獲取電影評論

### 2. API 分頁

所有列表 API 都支持分頁：
```
GET /api/movies?limit=50&offset=0
```

### 3. 請求日誌

使用 Morgan 記錄所有 HTTP 請求，便於調試和監控。

### 4. 錯誤處理

統一的錯誤響應格式，減少客戶端解析複雜性。

---

## 🔧 可擴展性設計

### 添加新功能步驟

1. **定義數據模型** (database/models.ts)
2. **創建 Repository** (database/repositories/)
3. **創建 Service** (services/)
4. **創建 Controller** (controllers/)
5. **定義驗證 Schema** (validators/schemas.ts)
6. **創建路由** (routes/)
7. **測試 API**

### 添加新的外部 API 集成

1. **在 utils/ 創建新文件** (例如: tmdb.ts)
2. **實現 API 客戶端函數**
3. **在 Service 層調用**
4. **添加相應的 Controller 方法**

---

## 📈 部署架構

### 本地開發
```
npm run dev
↓
http://localhost:3000
```

### Docker 開發
```
docker-compose up
↓
http://localhost:3000
```

### 生產環境建議
```
Docker Container
  ↓
Nginx (反向代理)
  ↓
Express Server (多進程)
  ↓
SQLite Database
```

---

## ✅ 技術檢查清單

- ✅ Express.js 服務器設置
- ✅ TypeScript 類型安全
- ✅ JWT 認證和授權
- ✅ CORS 安全限制
- ✅ Helmet 安全頭部
- ✅ Joi 數據驗證
- ✅ SQLite 數據庫
- ✅ 模塊化架構
- ✅ 錯誤處理中間件
- ✅ OMDB API 集成
- ✅ Docker 容器化
- ✅ 完整 API 文檔
- ✅ 開發指南
- ✅ 密碼加密存儲
- ✅ 數據庫索引優化

---

**項目版本**: 1.0.0  
**最後更新**: 2026年5月7日  
**維護者**: CinemaVault 開發團隊

