# 🚀 快速開始指南

## 5 分鐘快速啟動

### 1️⃣ 安裝依賴（1 分鐘）

```bash
npm install
```

### 2️⃣ 配置環境（1 分鐘）

```bash
cp .env.example .env
# 編輯 .env 並設置 OMDB_API_KEY（從 https://www.omdbapi.com 獲取免費密鑰）
```

### 3️⃣ 初始化數據庫（1 分鐘）

```bash
npm run db:init
```

### 4️⃣ 啟動服務器（1 分鐘）

```bash
npm run dev
```

### 5️⃣ 測試 API（1 分鐘）

```bash
# 註冊用戶
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'

# 獲取電影列表
curl http://localhost:3000/api/movies
```

✅ **完成！** 服務器運行在 `http://localhost:3000`

---

## 📖 重要文檔

| 文檔 | 內容 |
|------|------|
| **[README.md](./README.md)** | 項目概述和技術棧 |
| **[SETUP.md](./SETUP.md)** | 詳細安裝和配置步驟 |
| **[API.md](./API.md)** | 完整 API 參考文檔 |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | 架構設計詳解 |
| **[DEVELOPMENT.md](./DEVELOPMENT.md)** | 開發指南和最佳實踐 |
| **[COMPLETION_REPORT.md](./COMPLETION_REPORT.md)** | 項目完成報告 |

---

## 🔧 常用命令

```bash
# 開發模式（熱重載）
npm run dev

# 構建生產版本
npm run build

# 運行生產版本
npm start

# 初始化數據庫
npm run db:init

# 代碼檢查
npm run lint

# 代碼格式化
npm run format

# Docker 運行
docker-compose up -d

# Docker 查看日誌
docker-compose logs -f

# Docker 停止
docker-compose down
```

---

## 🐛 故障排除

### 問題: "Cannot find module 'express'"

**解決**: 運行 `npm install`

### 問題: "OMDB_API_KEY not found"

**解決**: 
1. 訪問 https://www.omdbapi.com
2. 獲取免費 API 密鑰
3. 在 `.env` 中設置 `OMDB_API_KEY=your_key`

### 問題: "Port 3000 already in use"

**解決**: 
- 更改 `.env` 中的 `PORT` 值
- 或: `lsof -ti:3000 | xargs kill -9`

### 問題: "Database locked"

**解決**: 刪除 `data/cinemavault.db` 並重新運行 `npm run db:init`

---

## 📞 API 端點快速查詢

### 認證
- `POST /api/auth/register` - 註冊
- `POST /api/auth/login` - 登錄
- `GET /api/auth/profile` - 獲取個人信息

### 電影
- `GET /api/movies` - 獲取列表
- `GET /api/movies/:id` - 獲取詳情
- `GET /api/movies/search?query=...` - 搜索
- `POST /api/movies` - 創建（需認證）
- `POST /api/movies/omdb/create` - 從 OMDB 創建

### 觀影單
- `POST /api/watchlist` - 添加（需認證）
- `GET /api/watchlist` - 獲取（需認證）
- `DELETE /api/watchlist/:id` - 刪除（需認證）

### 評分
- `POST /api/ratings` - 提交（需認證）
- `GET /api/ratings/:movieId` - 獲取評分

### 評論
- `POST /api/reviews` - 發表（需認證）
- `GET /api/reviews/movie/:movieId` - 獲取評論

完整 API 文檔見 [API.md](./API.md)

---

## 🎯 推薦下一步

1. ✅ 閱讀 [SETUP.md](./SETUP.md) 了解詳細配置
2. ✅ 查看 [API.md](./API.md) 學習所有端點
3. ✅ 了解 [ARCHITECTURE.md](./ARCHITECTURE.md) 中的架構設計
4. ✅ 跟隨 [DEVELOPMENT.md](./DEVELOPMENT.md) 的開發指南
5. ✅ 開始集成前端應用

---

## 💡 技術棧亮點

- 🏗️ **模塊化架構** - 清晰的分層設計
- 🔐 **JWT 認證** - 安全的用戶認證
- 📝 **TypeScript** - 類型安全的代碼
- 🗄️ **SQLite** - 輕量級數據庫
- 🔍 **OMDB 集成** - 自動獲取電影數據
- 🐳 **Docker 就緒** - 開箱即用的容器化

---

**準備好了嗎？** 立即運行 `npm install && npm run dev`！ 🚀

