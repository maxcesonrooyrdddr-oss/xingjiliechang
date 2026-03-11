# 星际猎场 - 后端API架构

## 技术栈
- **前端**: GitHub Pages / Vercel (静态托管)
- **后端**: Vercel Serverless Functions (Node.js)
- **数据库**: MongoDB Atlas (免费层 512MB)

## API端点

### 章节管理
```
GET    /api/chapters          # 获取所有章节列表
GET    /api/chapters/:id      # 获取单个章节内容
POST   /api/chapters          # 创建新章节
PUT    /api/chapters/:id      # 更新章节内容
DELETE /api/chapters/:id      # 删除章节
```

### 数据结构
```javascript
{
  _id: ObjectId,
  volumeId: Number,        // 卷ID (1, 2, 3...)
  chapterNum: String,      // 章节编号 ("1-1", "1-2"...)
  title: String,           // 章节标题
  content: String,         // Markdown内容
  wordCount: Number,       // 字数统计
  createdAt: Date,
  updatedAt: Date
}
```

## 部署步骤

1. 创建 MongoDB Atlas 账号
2. 创建 Cluster 和 Database
3. 获取连接字符串
4. 在 Vercel 配置环境变量
5. 部署 API 和前端

## 环境变量
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/xingjiliechang?retryWrites=true&w=majority
```
