# 星际猎场 - 在线数据库版部署指南

## 📋 前置要求

1. **MongoDB Atlas 账号**（免费）
2. **Vercel 账号**（免费）
3. **GitHub 账号**（已有）

---

## 第一步：创建 MongoDB Atlas 数据库

### 1.1 注册/登录 MongoDB Atlas
- 访问 https://www.mongodb.com/cloud/atlas
- 注册账号或使用Google/GitHub登录

### 1.2 创建集群
1. 点击 "Create New Project"
2. 项目名称：`xingjiliechang`
3. 点击 "Build a Cluster"
4. 选择 **M0 Free Tier**（免费）
5. 选择最近的区域（如：AWS / Singapore）
6. 点击 "Create Cluster"（等待3-5分钟）

### 1.3 配置数据库访问
1. 点击 "Database Access" → "Add New Database User"
2. 用户名：`novel_writer`
3. 密码：生成随机密码并保存
4. 权限：选择 "Read and write to any database"
5. 点击 "Add User"

### 1.4 配置网络访问
1. 点击 "Network Access" → "Add IP Address"
2. 选择 "Allow Access from Anywhere"（或添加Vercel IP）
3. 点击 "Confirm"

### 1.5 获取连接字符串
1. 回到 "Clusters" 页面
2. 点击 "Connect" → "Connect your application"
3. 复制连接字符串，格式如下：
   ```
   mongodb+srv://novel_writer:<password>@cluster0.xxxxx.mongodb.net/xingjiliechang?retryWrites=true&w=majority
   ```
4. 将 `<password>` 替换为实际密码

---

## 第二步：部署到 Vercel

### 2.1 导入项目
1. 访问 https://vercel.com
2. 点击 "Add New Project"
3. 导入 GitHub 仓库 `xingjiliechang`
4. 点击 "Import"

### 2.2 配置环境变量
在项目设置页面，添加环境变量：

| 名称 | 值 |
|------|-----|
| `MONGODB_URI` | 上面复制的MongoDB连接字符串 |

### 2.3 部署
1. 点击 "Deploy"
2. 等待部署完成（约2-3分钟）
3. 获取部署域名，如：`https://xingjiliechang.vercel.app`

---

## 第三步：验证部署

### 3.1 测试 API
访问以下地址验证API是否工作：
```
https://你的域名.vercel.app/api/chapters
```

应返回：
```json
{
  "volumes": []
}
```

### 3.2 测试前端
打开网站，点击 "+ 新建章节"，创建一个测试章节。

---

## 功能特性

✅ **在线编辑** - 直接在前端编辑章节内容  
✅ **自动保存** - 保存到云端MongoDB数据库  
✅ **分卷管理** - 5卷结构，每卷可折叠  
✅ **字数统计** - 实时显示当前字数  
✅ **增删改查** - 完整的CRUD功能  
✅ **响应式设计** - 支持移动端  

---

## 费用预估

| 服务 | 免费额度 | 预估月用量 |
|------|---------|-----------|
| MongoDB M0 | 512MB存储 | 约50MB |
| Vercel Hobby | 100GB流量 | 约10GB |
| **总计** | **免费** | **免费** |

---

## 故障排除

### 连接失败
- 检查MongoDB Network Access是否允许Vercel IP
- 检查MONGODB_URI环境变量是否正确设置

### API 500错误
- 查看Vercel Functions Logs
- 检查MongoDB连接字符串格式

### 前端无法加载
- 检查浏览器控制台错误
- 确认API_BASE地址正确

---

## 备份策略（重要！）

MongoDB Atlas免费版不提供自动备份，建议：

1. **定期导出** - 使用MongoDB Compass手动导出
2. **GitHub备份** - 定期将内容导出为Markdown文件提交到GitHub

---

完成以上步骤后，网站即可在线编辑并自动保存到数据库！
