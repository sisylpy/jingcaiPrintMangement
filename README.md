# 耗材提醒小程序

## 项目简介
农批市场多联针式打印机票据自助打印中心 - 耗材提醒微信小程序

## 功能模块
1. 微信授权登录
2. 设备列表查看
3. 设备详情（含纸张余量、阈值配置、责任人）
4. 加纸操作
5. 校准纸张数量
6. 提醒消息中心
7. 加纸历史记录

## 目录结构
```
miniprogram/
├── pages/              # 页面文件
│   ├── index/         # 首页（设备列表）
│   ├── device/        # 设备详情
│   ├── refill/        # 加纸操作
│   ├── messages/      # 消息中心
│   └── history/       # 加纸历史
├── utils/             # 工具类
├── app.js             # 小程序入口
├── app.json           # 全局配置
└── app.wxss           # 全局样式
```

## 开发指南

### 1. 配置后端API地址
在 `utils/config.js` 中配置后端服务器地址：
```javascript
const API_BASE_URL = 'http://your-server.com/api/miniprogram';
```

### 2. 配置微信小程序AppID
在微信开发者工具中配置小程序AppID

### 3. 部署步骤
1. 使用微信开发者工具打开本项目
2. 修改配置文件中的API地址
3. 编译并上传代码
4. 提交审核

## API接口文档

### 登录相关
- `POST /auth/wxLogin` - 微信授权登录
- `POST /auth/updateSubscribe` - 更新订阅状态
- `GET /auth/getInfo` - 获取管理员信息

### 设备管理
- `GET /device/list` - 查询设备列表
- `GET /device/detail` - 查询设备详情
- `POST /device/refill` - 加纸操作
- `POST /device/calibrate` - 校准纸张数量

### 提醒记录
- `GET /alert/list` - 查询提醒记录
- `GET /alert/unreadCount` - 查询未读消息数
- `POST /alert/markRead` - 标记已读

### 加纸记录
- `GET /refill/listByDevice` - 查询设备的加纸记录
- `GET /refill/latest` - 查询最近一次加纸记录

## 技术栈
- 微信小程序原生框架
- WeUI 组件库

