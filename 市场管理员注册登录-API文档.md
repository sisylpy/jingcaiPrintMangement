# 市场管理员注册登录 API 文档

## 1. 市场管理员注册

### 接口说明
市场管理员通过微信小程序注册账号

### 请求信息
- **URL**: `/api/marketmanager/register`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| file | File | 是 | 管理员头像图片文件 |
| code | String | 是 | 微信小程序授权码（wx.login获取） |
| marketId | Integer | 是 | 市场ID |
| managerName | String | 是 | 管理员真实姓名 |
| phone | String | 是 | 手机号 |
| role | Integer | 否 | 角色（1-普通管理员 2-市场主管，默认1） |

### 响应数据

**成功响应**：
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "managerId": 1,
    "managerName": "张三",
    "phone": "13800138000",
    "role": 1,
    "avatar": "uploadImage/avatar_123456.jpg",
    "marketId": 2,
    "marketName": "京贸物联批发市场"
  }
}
```

**失败响应**：
```json
{
  "code": 500,
  "msg": "该微信用户已注册为市场管理员，请直接登录"
}
```

### 错误码说明

| 错误码 | 说明 |
|--------|------|
| -1 | 用户已存在，请直接登录 |
| 500 | 注册失败（含具体错误信息） |

### 调用示例（微信小程序）

```javascript
// 1. 先调用微信登录获取code
wx.login({
  success: (res) => {
    const code = res.code;
    
    // 2. 选择头像
    wx.chooseImage({
      count: 1,
      success: (imgRes) => {
        const tempFilePath = imgRes.tempFilePaths[0];
        
        // 3. 上传注册
        wx.uploadFile({
          url: 'http://your-domain.com/api/marketmanager/register',
          filePath: tempFilePath,
          name: 'file',
          formData: {
            'code': code,
            'marketId': 2,
            'managerName': '张三',
            'phone': '13800138000',
            'role': 1
          },
          success: (uploadRes) => {
            const data = JSON.parse(uploadRes.data);
            if (data.code === 0) {
              console.log('注册成功', data.data);
              // 保存登录信息到本地存储
              wx.setStorageSync('managerId', data.data.managerId);
              wx.setStorageSync('managerInfo', data.data);
            } else {
              wx.showToast({
                title: data.msg,
                icon: 'none'
              });
            }
          }
        });
      }
    });
  }
});
```

---

## 2. 市场管理员登录

### 接口说明
市场管理员通过微信小程序登录

### 请求信息
- **URL**: `/api/marketmanager/login`
- **Method**: `POST`
- **Content-Type**: `application/x-www-form-urlencoded`

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| code | String | 是 | 微信小程序授权码（wx.login获取） |

### 响应数据

**成功响应**：
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "managerId": 1,
    "managerName": "张三",
    "phone": "13800138000",
    "role": 1,
    "avatar": "uploadImage/avatar_123456.jpg",
    "status": 1,
    "marketId": 2,
    "marketName": "京贸物联批发市场"
  }
}
```

**失败响应**：
```json
{
  "code": 500,
  "msg": "您还未注册为市场管理员，请先注册"
}
```

### 调用示例（微信小程序）

```javascript
wx.login({
  success: (res) => {
    wx.request({
      url: 'http://your-domain.com/api/marketmanager/login',
      method: 'POST',
      data: {
        code: res.code
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code === 0) {
          console.log('登录成功', res.data.data);
          // 保存登录信息
          wx.setStorageSync('managerId', res.data.data.managerId);
          wx.setStorageSync('managerInfo', res.data.data);
          // 跳转到主页
          wx.switchTab({
            url: '/pages/index/index'
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          });
        }
      }
    });
  }
});
```

---

## 3. 查询管理员信息

### 接口说明
根据管理员ID查询详细信息

### 请求信息
- **URL**: `/api/marketmanager/info`
- **Method**: `GET`

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| managerId | Integer | 是 | 管理员ID |

### 响应数据

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "managerId": 1,
    "managerName": "张三",
    "phone": "13800138000",
    "role": 1,
    "avatar": "uploadImage/avatar_123456.jpg",
    "status": 1,
    "subscribeStatus": 1,
    "marketId": 2,
    "marketName": "京贸物联批发市场",
    "createTime": "2025-10-17 10:30:00",
    "lastLoginTime": "2025-10-17 14:20:00"
  }
}
```

---

## 4. 查询市场下的所有管理员

### 接口说明
查询指定市场的所有管理员列表

### 请求信息
- **URL**: `/api/marketmanager/listByMarket`
- **Method**: `GET`

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| marketId | Integer | 是 | 市场ID |

### 响应数据

```json
{
  "code": 0,
  "msg": "success",
  "list": [
    {
      "nxMmId": 1,
      "nxMmMarketId": 2,
      "nxMmName": "张三",
      "nxMmPhone": "13800138000",
      "nxMmRole": 2,
      "nxMmStatus": 1,
      "nxMmWxAvatar": "uploadImage/avatar_123456.jpg",
      "nxMmCreateTime": "2025-10-17 10:30:00",
      "nxMmLastLoginTime": "2025-10-17 14:20:00"
    },
    {
      "nxMmId": 2,
      "nxMmMarketId": 2,
      "nxMmName": "李四",
      "nxMmPhone": "13800138001",
      "nxMmRole": 1,
      "nxMmStatus": 1,
      "nxMmWxAvatar": "uploadImage/avatar_789012.jpg",
      "nxMmCreateTime": "2025-10-17 11:00:00",
      "nxMmLastLoginTime": "2025-10-17 13:45:00"
    }
  ],
  "total": 2
}
```

---

## 5. 更新管理员信息（文字信息）

### 接口说明
更新管理员的姓名、手机号等文字信息（不含头像）

### 请求信息
- **URL**: `/api/marketmanager/updateInfo`
- **Method**: `POST`
- **Content-Type**: `application/x-www-form-urlencoded`

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| managerId | Integer | 是 | 管理员ID |
| managerName | String | 否 | 管理员姓名 |
| phone | String | 否 | 手机号 |

**注意**：`managerName` 和 `phone` 至少提供一个

### 响应数据

**成功响应**：
```json
{
  "code": 0,
  "msg": "更新成功"
}
```

**失败响应**：
```json
{
  "code": 500,
  "msg": "该手机号已被其他管理员使用"
}
```

### 调用示例（微信小程序）

```javascript
wx.request({
  url: 'http://your-domain.com/api/marketmanager/updateInfo',
  method: 'POST',
  data: {
    managerId: wx.getStorageSync('managerId'),
    managerName: '张三丰',
    phone: '13800138888'
  },
  header: {
    'content-type': 'application/x-www-form-urlencoded'
  },
  success: (res) => {
    if (res.data.code === 0) {
      wx.showToast({
        title: '更新成功',
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      });
    }
  }
});
```

---

## 6. 更新管理员头像

### 接口说明
更新管理员的头像图片

### 请求信息
- **URL**: `/api/marketmanager/updateAvatar`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| file | File | 是 | 新头像图片文件 |
| managerId | Integer | 是 | 管理员ID |

### 响应数据

**成功响应**：
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "avatar": "uploadImage/avatar_new_123456.jpg"
  }
}
```

**失败响应**：
```json
{
  "code": 500,
  "msg": "管理员不存在"
}
```

### 调用示例（微信小程序）

```javascript
// 1. 选择新头像
wx.chooseImage({
  count: 1,
  sizeType: ['compressed'],
  sourceType: ['album', 'camera'],
  success: (res) => {
    const tempFilePath = res.tempFilePaths[0];
    
    // 2. 上传更新
    wx.uploadFile({
      url: 'http://your-domain.com/api/marketmanager/updateAvatar',
      filePath: tempFilePath,
      name: 'file',
      formData: {
        'managerId': wx.getStorageSync('managerId')
      },
      success: (uploadRes) => {
        const data = JSON.parse(uploadRes.data);
        if (data.code === 0) {
          console.log('新头像路径：', data.data.avatar);
          wx.showToast({
            title: '头像更新成功',
            icon: 'success'
          });
          // 更新本地存储的头像路径
          let managerInfo = wx.getStorageSync('managerInfo');
          managerInfo.avatar = data.data.avatar;
          wx.setStorageSync('managerInfo', managerInfo);
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none'
          });
        }
      }
    });
  }
});
```

---

## 数据字典

### 角色类型（nxMmRole）

| 值 | 说明 |
|----|------|
| 1 | 普通管理员 |
| 2 | 市场主管 |

### 状态（nxMmStatus）

| 值 | 说明 |
|----|------|
| -1 | 待开通（注册后待审核） |
| 0 | 已禁用 |
| 1 | 已启用（正常使用） |

---

## 7. 审核/开通管理员账号

### 接口说明
市场主管或超级管理员审核新注册的管理员账号

### 请求信息
- **URL**: `/api/marketmanager/approve`
- **Method**: `POST`
- **Content-Type**: `application/x-www-form-urlencoded`

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| managerId | Integer | 是 | 管理员ID |
| approveStatus | Integer | 是 | 审核状态（1-通过并开通 0-拒绝/禁用） |

### 响应数据

**成功响应**：
```json
{
  "code": 0,
  "msg": "操作成功",
  "managerId": 5,
  "newStatus": 1
}
```

**失败响应**：
```json
{
  "code": 500,
  "msg": "管理员不存在"
}
```

### 调用示例（微信小程序）

```javascript
// 审核通过并开通
wx.request({
  url: 'http://your-domain.com/api/marketmanager/approve',
  method: 'POST',
  data: {
    managerId: 5,
    approveStatus: 1  // 1=通过并开通, 0=拒绝/禁用
  },
  header: {
    'content-type': 'application/x-www-form-urlencoded'
  },
  success: (res) => {
    if (res.data.code === 0) {
      wx.showToast({
        title: '账号已开通',
        icon: 'success'
      });
      // 刷新管理员列表
      this.loadManagerList();
    } else {
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      });
    }
  }
});
```

---

## 注意事项

1. **图片上传限制**：
   - 支持格式：jpg、jpeg、png、gif
   - 文件大小：不超过5MB
   - 建议尺寸：正方形，200x200像素以上

2. **微信授权**：
   - `code` 有效期为5分钟，且只能使用一次
   - 需要在微信小程序后台配置服务器域名

3. **角色权限**：
   - 普通管理员(1)：可以查看数据、管理设备、处理换纸
   - 市场主管(2)：拥有所有权限，包括管理其他管理员、审核新账号

4. **账号状态流转**：
   - 新注册的账号默认为**待开通**状态(status=-1)
   - 待开通的账号**无法登录**，会提示"您的账号待审核，请联系市场管理员开通"
   - 审核通过后状态变为**已启用**(status=1)，可以正常登录
   - 被禁用的账号(status=0)无法登录，会提示"账号已被禁用"

5. **手机号唯一性**：
   - 每个手机号只能注册一次
   - 建议在前端做手机号格式验证

6. **市场关联**：
   - 管理员必须关联到一个有效的市场
   - 注册时需要提供正确的marketId

