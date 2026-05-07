# 開發指南

本文檔定義了該項目的開發標準和最佳實踐。

## 代碼風格

### TypeScript

- 使用 Prettier 進行代碼格式化
- 使用 ESLint 進行代碼檢查
- 所有文件使用 2 個空格縮進

### 命名約定

| 類型 | 風格 | 示例 |
|------|------|------|
| 類 | PascalCase | `UserService`, `MovieController` |
| 函數 | camelCase | `getUserById`, `createMovie` |
| 常數 | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `API_KEY` |
| 接口 | PascalCase（帶 I 前綴） | `IUser`, `IMovie` |
| 變數 | camelCase | `userId`, `movieTitle` |
| 文件 | PascalCase (類)/ camelCase (工具) | `UserService.ts`, `auth.ts` |

### 目錄結構

遵循分層架構模式：

```
src/
├── config/          # 配置
├── controllers/     # 控制器
├── services/        # 業務邏輯
├── database/        # 數據持久化
├── routes/          # 路由
├── middleware/      # 中間件
├── validators/      # 驗證
├── utils/           # 工具函數
├── types/           # 類型定義
└── index.ts         # 入口
```

## 編碼標準

### 類和方法

```typescript
// ✅ 好
class UserService {
  private userRepository: UserRepository;

  constructor(db: sqlite3.Database) {
    this.userRepository = new UserRepository(db);
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return user;
  }
}

// ❌ 不好
class UserService {
  async GetUser(id) {
    const user = await this.repo.get(id);
    if (!user) return null;
    return user;
  }
}
```

### 錯誤處理

```typescript
// ✅ 好 - 使用自定義錯誤類
try {
  const user = await userService.getUserById(userId);
} catch (error) {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
  }
}

// ❌ 不好 - 不明確的錯誤處理
try {
  const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
  return user;
} catch (e) {
  console.log('error');
}
```

### 註釋

```typescript
// ✅ 好 - 清晰的目的和解釋
/**
 * 根據電影標題從 OMDB 搜索電影
 * @param title - 要搜索的電影標題
 * @returns OMDB 電影數據或 null
 */
async getMovieFromOMDB(title: string): Promise<Partial<Movie> | null> {
  // ...
}

// ❌ 不好 - 無用或過度的註釋
// 從 OMDB 獲取電影
async getMovie(title: string) {
  // 設置 URL
  const url = `...`;
  // 執行請求
  const res = await axios.get(url);
  // 返回
  return res.data;
}
```

## 提交規範

### Git 提交信息

遵循 Conventional Commits 格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 類型

- `feat`: 新功能
- `fix`: 錯誤修復
- `docs`: 文檔更新
- `style`: 代碼風格（不影響功能）
- `refactor`: 代碼重構
- `test`: 測試相關
- `chore`: 構建或依賴更新

#### 示例

```bash
# 好的提交信息
git commit -m "feat(auth): add JWT token refresh mechanism"
git commit -m "fix(movies): handle null poster in OMDB response"
git commit -m "docs: update API documentation"

# 不好的提交信息
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

## 測試

### 測試結構

```typescript
// 示例：userService.test.ts
describe('UserService', () => {
  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      // Arrange
      const input = { email: 'test@test.com', username: 'test', password: 'pass123' };
      
      // Act
      const result = await userService.register(...);
      
      // Assert
      expect(result.user.email).toBe(input.email);
    });

    it('should throw error if user already exists', async () => {
      // Arrange & Act & Assert
      await expect(userService.register(existingUser)).rejects.toThrow();
    });
  });
});
```

## 性能最佳實踐

### 數據庫

```typescript
// ✅ 好 - 使用索引
CREATE INDEX idx_movies_imdb_id ON movies(imdb_id);

// ❌ 不好 - 頻繁掃描全表
SELECT * FROM movies WHERE plot LIKE '%keyword%';

// ✅ 好 - 分頁查詢
SELECT * FROM movies LIMIT 50 OFFSET 0;

// ❌ 不好 - 一次加載所有數據
SELECT * FROM movies;
```

### API 響應

```typescript
// ✅ 好 - 只返回必要的字段
{
  "id": 1,
  "title": "Movie",
  "year": 2020
}

// ❌ 不好 - 返回過多敏感信息
{
  "id": 1,
  "title": "Movie",
  "year": 2020,
  "created_by": 1,
  "updated_at": "...",
  "internalNotes": "..."
}
```

## 安全最佳實踐

### 認證和授權

```typescript
// ✅ 好 - 驗證權限
async deleteMovie(id: number, userId: number, userRole: string) {
  const movie = await this.getMovieById(id);
  if (movie.created_by !== userId && userRole !== 'admin') {
    throw new AppError(403, 'Insufficient permissions');
  }
  // ...
}

// ❌ 不好 - 沒有檢查
async deleteMovie(id: number) {
  await this.movieRepository.deleteMovie(id);
}
```

### 輸入驗證

```typescript
// ✅ 好 - 驗證所有輸入
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const { error, value } = schema.validate(input);

// ❌ 不好 - 直接使用用戶輸入
db.run(`INSERT INTO users VALUES ('${email}', '${password}')`);
```

## 依賴管理

### 添加新依賴

```bash
# 添加生產依賴
npm install package-name

# 添加開發依賴
npm install --save-dev package-name

# 檢查安全漏洞
npm audit
```

### 更新依賴

```bash
# 檢查過期的依賴
npm outdated

# 更新所有依賴
npm update

# 更新特定依賴
npm update package-name@latest
```

## 發布流程

### 版本管理

遵循 Semantic Versioning (MAJOR.MINOR.PATCH)：

- `MAJOR`: 破壞性變更
- `MINOR`: 新功能（向後兼容）
- `PATCH`: 錯誤修復

### 發布步驟

```bash
# 1. 確保所有測試通過
npm test

# 2. 更新版本
npm version patch  # 或 minor, major

# 3. 推送更改
git push origin main
git push origin --tags

# 4. 創建 Release
# （在 GitHub 上通過 UI 創建或使用 CLI）
```

## 代碼審查檢查清單

- [ ] 代碼遵循命名約定
- [ ] 所有函數都有文檔字符串
- [ ] 沒有控制台日誌留在代碼中
- [ ] 錯誤被適當處理
- [ ] 敏感信息不會被暴露
- [ ] 考慮了性能影響
- [ ] 添加了必要的測試
- [ ] 提交信息清晰有意義

## 常見陷阱

### 1. 忘記驗證用戶輸入

❌ 錯誤：
```typescript
async searchMovies(query: string) {
  return this.db.all(`SELECT * FROM movies WHERE title LIKE '%${query}%'`);
}
```

✅ 正確：
```typescript
async searchMovies(query: string) {
  if (!query || query.trim().length === 0) {
    throw new AppError(400, 'Search query is required');
  }
  return this.db.all(`SELECT * FROM movies WHERE title LIKE ?`, [`%${query}%`]);
}
```

### 2. 在循環中查詢數據庫

❌ 錯誤：
```typescript
for (const movieId of movieIds) {
  const movie = await this.getMovieById(movieId);  // N+1 查詢
  movies.push(movie);
}
```

✅ 正確：
```typescript
const movies = await this.db.all(
  `SELECT * FROM movies WHERE id IN (${movieIds.join(',')})`,
  []
);
```

### 3. 存儲明文密碼

❌ 錯誤：
```typescript
await db.run(
  `INSERT INTO users (email, password) VALUES (?, ?)`,
  [email, password]  // 明文密碼！
);
```

✅ 正確：
```typescript
const hashedPassword = await hashPassword(password);
await db.run(
  `INSERT INTO users (email, password) VALUES (?, ?)`,
  [email, hashedPassword]
);
```

---

**更新日期**: 2026年5月7日
**版本**: 1.0.0

