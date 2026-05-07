# CinemaVault API 文檔

基礎 URL: `http://localhost:3000/api`

## 目錄

- [認證](#認證)
- [電影管理](#電影管理)
- [觀影單](#觀影單)
- [評分](#評分)
- [評論](#評論)

---

## 認證

### 用戶註冊

**請求**
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

**響應** (201)
```json
{
  "success": true,
  "message": "User registered successfully",
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
```

### 用戶登錄

**請求**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**響應** (200)
```json
{
  "success": true,
  "message": "Login successful",
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
```

### 獲取用戶信息

**請求**
```http
GET /auth/profile
Authorization: Bearer <token>
```

**響應** (200)
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "role": "user",
    "created_at": "2026-05-07T10:00:00Z"
  }
}
```

---

## 電影管理

### 獲取所有電影

**請求**
```http
GET /movies?limit=50&offset=0
```

**響應** (200)
```json
{
  "success": true,
  "message": "Movies fetched successfully",
  "data": {
    "movies": [
      {
        "id": 1,
        "title": "Inception",
        "year": 2010,
        "imdb_id": "tt1375666",
        "poster": "https://...",
        "plot": "A thief who...",
        "runtime": 148,
        "genre": "Action, Sci-Fi",
        "director": "Christopher Nolan",
        "actors": "Leonardo DiCaprio, Ellen Page",
        "external_rating": 8.8,
        "created_at": "2026-05-07T10:00:00Z"
      }
    ],
    "count": 100,
    "limit": 50,
    "offset": 0
  }
}
```

### 搜索電影

**請求**
```http
GET /movies/search?query=Inception&limit=50&offset=0
```

**響應** (200)
```json
{
  "success": true,
  "message": "Movies searched successfully",
  "data": {
    "movies": [...],
    "count": 5
  }
}
```

### 獲取電影詳情

**請求**
```http
GET /movies/:id
```

**響應** (200)
```json
{
  "success": true,
  "message": "Movie fetched successfully",
  "data": {
    "id": 1,
    "title": "Inception",
    "year": 2010,
    ...
  }
}
```

### 創建電影

**請求** (需要認證)
```http
POST /movies
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Inception",
  "year": 2010,
  "plot": "A thief who steals corporate secrets...",
  "runtime": 148,
  "genre": "Action, Sci-Fi",
  "director": "Christopher Nolan",
  "actors": "Leonardo DiCaprio, Ellen Page"
}
```

**響應** (201)
```json
{
  "success": true,
  "message": "Movie created successfully",
  "data": {
    "id": 1,
    "title": "Inception",
    ...
  }
}
```

### 從 OMDB 創建電影

**請求** (需要認證)
```http
POST /movies/omdb/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Inception"
}
```

**響應** (201)
```json
{
  "success": true,
  "message": "Movie created from OMDB successfully",
  "data": {
    "id": 1,
    "title": "Inception",
    "external_rating": 8.8,
    ...
  }
}
```

### 更新電影

**請求** (需要認證，需要擁有該電影)
```http
PUT /movies/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Inception Updated"
}
```

**響應** (200)
```json
{
  "success": true,
  "message": "Movie updated successfully",
  "data": {...}
}
```

### 刪除電影

**請求** (需要認證，需要擁有該電影)
```http
DELETE /movies/:id
Authorization: Bearer <token>
```

**響應** (200)
```json
{
  "success": true,
  "message": "Movie deleted successfully",
  "data": {}
}
```

---

## 觀影單

### 添加到觀影單

**請求** (需要認證)
```http
POST /watchlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "movie_id": 1,
  "status": "to-watch"
}
```

狀態可選值: `to-watch`, `watching`, `watched`

**響應** (201)
```json
{
  "success": true,
  "message": "Added to watchlist successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "movie_id": 1,
    "status": "to-watch",
    "added_at": "2026-05-07T10:00:00Z"
  }
}
```

### 獲取用戶觀影單

**請求** (需要認證)
```http
GET /watchlist?status=to-watch&limit=50&offset=0
Authorization: Bearer <token>
```

**響應** (200)
```json
{
  "success": true,
  "message": "Watchlist fetched successfully",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "movie_id": 1,
      "status": "to-watch",
      "added_at": "2026-05-07T10:00:00Z",
      "movie": {
        "id": 1,
        "title": "Inception",
        ...
      }
    }
  ]
}
```

### 更新觀影單狀態

**請求** (需要認證)
```http
PUT /watchlist/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "watched"
}
```

**響應** (200)
```json
{
  "success": true,
  "message": "Watchlist status updated successfully",
  "data": {...}
}
```

### 從觀影單刪除

**請求** (需要認證)
```http
DELETE /watchlist/:id
Authorization: Bearer <token>
```

**響應** (200)
```json
{
  "success": true,
  "message": "Removed from watchlist successfully",
  "data": {}
}
```

---

## 評分

### 提交評分

**請求** (需要認證)
```http
POST /ratings
Authorization: Bearer <token>
Content-Type: application/json

{
  "movie_id": 1,
  "rating": 8.5
}
```

評分範圍: 1-10

**響應** (201)
```json
{
  "success": true,
  "message": "Rating submitted successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "movie_id": 1,
    "rating": 8.5,
    "created_at": "2026-05-07T10:00:00Z"
  }
}
```

### 獲取電影評分

**請求**
```http
GET /ratings/:movieId?limit=50&offset=0
```

**響應** (200)
```json
{
  "success": true,
  "message": "Ratings fetched successfully",
  "data": {
    "ratings": [...],
    "average": 8.3,
    "count": 42
  }
}
```

### 更新評分

**請求** (需要認證)
```http
PUT /ratings/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 9.0
}
```

**響應** (200)
```json
{
  "success": true,
  "message": "Rating updated successfully",
  "data": {...}
}
```

### 刪除評分

**請求** (需要認證)
```http
DELETE /ratings/:id
Authorization: Bearer <token>
```

**響應** (200)
```json
{
  "success": true,
  "message": "Rating deleted successfully",
  "data": {}
}
```

---

## 評論

### 發表評論

**請求** (需要認證)
```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "movie_id": 1,
  "review_text": "This is an amazing movie!",
  "rating": 9.0
}
```

**響應** (201)
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "movie_id": 1,
    "review_text": "This is an amazing movie!",
    "rating": 9.0,
    "created_at": "2026-05-07T10:00:00Z"
  }
}
```

### 獲取電影評論

**請求**
```http
GET /reviews/movie/:movieId?limit=50&offset=0
```

**響應** (200)
```json
{
  "success": true,
  "message": "Reviews fetched successfully",
  "data": {
    "reviews": [...],
    "count": 15
  }
}
```

### 獲取用戶評論

**請求** (需要認證)
```http
GET /reviews/user/reviews?limit=50&offset=0
Authorization: Bearer <token>
```

**響應** (200)
```json
{
  "success": true,
  "message": "User reviews fetched successfully",
  "data": [...]
}
```

### 更新評論

**請求** (需要認證)
```http
PUT /reviews/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "review_text": "Updated review text",
  "rating": 8.0
}
```

**響應** (200)
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {...}
}
```

### 刪除評論

**請求** (需要認證)
```http
DELETE /reviews/:id
Authorization: Bearer <token>
```

**響應** (200)
```json
{
  "success": true,
  "message": "Review deleted successfully",
  "data": {}
}
```

---

## 錯誤響應

所有錯誤響應都遵循此格式：

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### 常見狀態碼

- `200`: 成功
- `201`: 已創建
- `400`: 請求錯誤/驗證失敗
- `401`: 未授權
- `403`: 禁止訪問
- `404`: 未找到
- `500`: 服務器錯誤

---

## 認證說明

所有受保護的端點都需要在 `Authorization` 標頭中提供有效的 JWT token：

```
Authorization: Bearer <your_token_here>
```

Token 會在註冊或登錄時返回，並在指定時間後過期（默認 7 天）。

---

## 示例用法 (cURL)

### 註冊
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "password": "password123"
  }'
```

### 登錄
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 獲取電影列表
```bash
curl -X GET http://localhost:3000/api/movies
```

### 創建電影 (需要 token)
```bash
curl -X POST http://localhost:3000/api/movies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Movie Title",
    "year": 2020,
    "genre": "Action"
  }'
```

