# 🏔️ 阿里大环线离线路书助手 v3.0

> 移动端 H5 · 离线优先 · 微信可用 · 16天行程 · 冈仁波齐转山

## 快速开始

1. 将所有文件部署到静态服务器（GitHub Pages / Gitee Pages / 个人服务器）
2. 将链接发到微信或浏览器中打开
3. 进入 `index.html` 即可使用

## 本地使用

直接用浏览器打开 `index.html` 即可，无需服务器。

## 项目结构

```
阿里环线助手/
├── index.html            # 主入口（单页应用）
├── manifest.json         # PWA 配置文件
├── service-worker.js     # PWA 离线缓存
├── css/
│   └── style.css         # 移动端优先样式
├── js/
│   ├── app.js            # 主应用逻辑
│   └── utils.js          # 工具函数（localStorage等）
├── data/
│   └── trip-data.js      # 16天行程+转山+CheckList+应急数据
├── maps/                 # 地图图片（需自行放入）
│   └── README.md         # 地图说明
└── README.md             # 本文件
```

## 功能模块

| 模块     | 优先级 | 说明                                     |
| -------- | ------ | ---------------------------------------- |
| 🏠 今日   | P0     | 默认首页，自动匹配当天行程               |
| 📋 行程   | P0     | 16天完整路书，支持展开/折叠/标记/备注    |
| 🏔️ 转山   | P0     | 冈仁波齐转山3天路线、装备、下撤判断      |
| ✅ 准备   | P0     | CheckList 按类别/场景，支持勾选和自定义 |
| 📊 海拔   | P0     | Canvas 海拔曲线 + 每日详情表            |
| 💰 记账   | P1     | 简易 AA 记账，CSV/JSON导出              |
| 🗺️ 地图   | P0     | 静态地图图片，点击查看大图              |
| 🆘 应急   | P0     | 高反/车辆/失温/迷路/报警/医院应急指引   |

## 技术特点

- **零框架**：纯 HTML + CSS + JS，无框架依赖
- **离线优先**：核心数据内置，localStorage 保存用户数据
- **微信兼容**：字体≥14px，按钮≥44px，适配微信内置浏览器
- **移动优先**：竖屏主适配，卡片式布局，大按钮
- **PWA Ready**：包含 manifest.json 和 service-worker.js
- **无服务器**：纯静态部署，无后端依赖

## 数据存储

| 数据             | Key                      |
| ---------------- | ------------------------ |
| 行程备注         | `ali_trip_v3`            |
| CheckList 勾选   | `ali_checklist_v3`       |
| 转山装备勾选     | `ali_kora_checklist_v3`  |
| 自定义CheckList  | `ali_checklist_custom_v3`|
| 记账数据         | `ali_expenses_v3`        |
| 已完成天数       | `ali_completed_days_v3`  |
| 用户设置         | `ali_settings_v3`        |

## 部署方式

### GitHub Pages

1. 将项目 push 到 GitHub 仓库
2. Settings → Pages → 选择分支 → Save
3. 获得 `https://你的用户名.github.io/仓库名/` 链接

### Gitee Pages

1. 将项目 push 到 Gitee 仓库
2. 服务 → Gitee Pages → 启动
3. 获得链接

### 本地 HTML 备用包

直接将整个文件夹复制到手机，用浏览器打开 `index.html`。

## 微信使用提示

- ✅ 核心行程可离线查看
- ✅ CheckList 可勾选
- ✅ 记账可输入
- ✅ 今日行程可复制到微信
- ⚠️ 微信内数据仅存在本机，建议定期导出备份
- 💡 出发前保存地图图片到手机相册

## 导出备份

在"准备"或"记账"模块中点击"导出备份"按钮，下载 JSON 文件。

## 地图图片

`maps/` 文件夹中的地图图片需要用户自行准备。详见 [maps/README.md](maps/README.md)。

## 开发说明

- 本项目为第一阶段交付物
- 不需要后端服务器
- 不需要数据库
- 不需要用户登录
- 所有数据保存在用户浏览器中

## License

个人使用项目，阿里大环线旅行者专用 🏔️
