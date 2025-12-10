# 加纸作废功能 - API文档

## 📋 功能概述

针式打印机使用连续纸，更换新纸时旧纸无法继续使用。本次更新调整加纸业务，支持：
1. **正常加纸/更换新纸**：直接设置新纸数量，旧纸作废
2. **手动校准**：只能减少纸张数量，记录校准作废

---

## 🔄 业务逻辑变更

### **旧逻辑（已废弃）**
```
正常加纸：当前余量 + 新增数量 = 加纸后余量
例：100张 + 500张 = 600张
```

### **新逻辑**

#### **1. 正常加纸/更换新纸**
```
操作：直接设置新纸数量
旧纸：全部作废
例：当前100张 → 更换1000张 → 旧纸作废100张，新纸1000张
```

#### **2. 手动校准**
```
限制：只能减少（paperCount <= 当前余量）
作废：差值作为校准作废
例：当前1000张 → 校准为950张 → 校准作废50张
```

---

## 🔌 API接口

### **1. 正常加纸/更换新纸**

#### **接口地址**
```
POST /api/machine/device/refill
```

#### **请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `deviceId` | Integer | 是 | 设备ID |
| `newPaperCount` | Integer | 是 | 新纸数量（直接设置，不累加） |
| `operatorId` | Integer | 是 | 操作人ID |
| `operatorName` | String | 是 | 操作人姓名 |
| `remark` | String | 否 | 备注 |

#### **请求示例**
```json
{
    "deviceId": 14,
    "newPaperCount": 1000,
    "operatorId": 1,
    "operatorName": "张三",
    "remark": "更换新纸"
}
```

#### **成功响应**
```json
{
    "code": 0,
    "msg": "加纸成功",
    "paperCount": 1000,
    "wasteCount": 90,
    "message": "已更换新纸1000张，旧纸作废90张"
}
```

#### **业务说明**
- 获取当前纸张余量（如90张）
- 直接设置为新纸数量（1000张）
- 记录旧纸作废数量（90张）
- 清除所有未处理的提醒记录

---

### **2. 手动校准**

#### **接口地址**
```
POST /api/machine/device/calibrate
```

#### **请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `deviceId` | Integer | 是 | 设备ID |
| `paperCount` | Integer | 是 | 校准后的纸张数量（必须 <= 当前数量） |
| `operatorId` | Integer | 是 | 操作人ID |
| `operatorName` | String | 是 | 操作人姓名 |
| `remark` | String | 否 | 备注 |

#### **请求示例**
```json
{
    "deviceId": 14,
    "paperCount": 950,
    "operatorId": 1,
    "operatorName": "李四",
    "remark": "盘点校准"
}
```

#### **成功响应**
```json
{
    "code": 0,
    "msg": "校准成功",
    "paperCount": 950,
    "wasteCount": 50,
    "message": "校准完成，当前余量950张，校准作废50张"
}
```

#### **错误响应（校准值过大）**
```json
{
    "code": 500,
    "msg": "校准值（1100张）不能大于当前余量（1000张）"
}
```

#### **业务说明**
- 获取当前纸张余量（如1000张）
- 校验：校准值必须 <= 当前余量
- 计算作废数量：1000 - 950 = 50张
- 设置为校准后数量（950张）
- 记录校准作废数量（50张）
- 清除所有未处理的提醒记录

---

## 📊 数据库变更

### **新增字段**
```sql
ALTER TABLE nx_machine_paper_refill_record 
ADD COLUMN nx_prr_waste_count INT DEFAULT 0 COMMENT '作废数量（张）：正常加纸=旧纸作废，手动校准=校准作废' 
AFTER nx_prr_after_count;
```

### **加纸记录表字段说明**
| 字段名 | 类型 | 说明 | 正常加纸示例 | 手动校准示例 |
|--------|------|------|-------------|-------------|
| `nx_prr_before_count` | INT | 操作前数量 | 90 | 1000 |
| `nx_prr_add_count` | INT | 增加数量 | 1000（新纸） | -50（负数） |
| `nx_prr_after_count` | INT | 操作后数量 | 1000 | 950 |
| `nx_prr_waste_count` | INT | 作废数量 | 90（旧纸作废） | 50（校准作废） |
| `nx_prr_refill_type` | TINYINT | 类型 | 1 | 3 |
| `nx_prr_remark` | VARCHAR | 备注 | "更换新纸（旧纸作废90张）" | "盘点校准（校准作废50张）" |

---

## 📈 统计查询

### **1. 按设备统计作废数量**
```sql
SELECT 
    nx_prr_device_id AS '设备ID',
    SUM(nx_prr_waste_count) AS '总作废数量',
    SUM(CASE WHEN nx_prr_refill_type = 1 THEN nx_prr_waste_count ELSE 0 END) AS '更换作废',
    SUM(CASE WHEN nx_prr_refill_type = 3 THEN nx_prr_waste_count ELSE 0 END) AS '校准作废',
    COUNT(*) AS '操作次数'
FROM nx_machine_paper_refill_record
WHERE nx_prr_device_id = 14
GROUP BY nx_prr_device_id;
```

### **2. 按类型统计作废数量**
```sql
SELECT 
    CASE nx_prr_refill_type
        WHEN 1 THEN '正常加纸/更换'
        WHEN 3 THEN '手动校准'
    END AS '操作类型',
    COUNT(*) AS '操作次数',
    SUM(nx_prr_waste_count) AS '总作废数量',
    AVG(nx_prr_waste_count) AS '平均作废数量'
FROM nx_machine_paper_refill_record
WHERE nx_prr_device_id = 14
GROUP BY nx_prr_refill_type;
```

---

## 🔧 前端调用示例

### **Vue.js 示例**

```javascript
// 1. 正常加纸/更换新纸
async refillPaper() {
  try {
    const res = await this.$http.post('/api/machine/device/refill', {
      deviceId: this.deviceId,
      newPaperCount: 1000,
      operatorId: this.currentUser.id,
      operatorName: this.currentUser.name,
      remark: '更换新纸'
    });
    
    if (res.data.code === 0) {
      this.$message.success(res.data.message);
      console.log('新纸数量:', res.data.paperCount);
      console.log('旧纸作废:', res.data.wasteCount);
    }
  } catch (error) {
    this.$message.error('加纸失败');
  }
}

// 2. 手动校准
async calibratePaper() {
  try {
    const res = await this.$http.post('/api/machine/device/calibrate', {
      deviceId: this.deviceId,
      paperCount: 950,
      operatorId: this.currentUser.id,
      operatorName: this.currentUser.name,
      remark: '盘点校准'
    });
    
    if (res.data.code === 0) {
      this.$message.success(res.data.message);
      console.log('校准后数量:', res.data.paperCount);
      console.log('校准作废:', res.data.wasteCount);
    } else {
      // 校验失败，如：校准值过大
      this.$message.error(res.data.msg);
    }
  } catch (error) {
    this.$message.error('校准失败');
  }
}
```

### **微信小程序示例**

```javascript
// 1. 正常加纸/更换新纸
refillPaper() {
  wx.request({
    url: 'http://192.168.0.103:8080/nongxinle_master_war_exploded/api/machine/device/refill',
    method: 'POST',
    data: {
      deviceId: 14,
      newPaperCount: 1000,
      operatorId: 1,
      operatorName: '张三',
      remark: '更换新纸'
    },
    success: (res) => {
      if (res.data.code === 0) {
        wx.showToast({
          title: res.data.message,
          icon: 'success'
        });
        console.log('新纸数量:', res.data.paperCount);
        console.log('旧纸作废:', res.data.wasteCount);
      }
    }
  });
}

// 2. 手动校准
calibratePaper() {
  wx.request({
    url: 'http://192.168.0.103:8080/nongxinle_master_war_exploded/api/machine/device/calibrate',
    method: 'POST',
    data: {
      deviceId: 14,
      paperCount: 950,
      operatorId: 1,
      operatorName: '李四',
      remark: '盘点校准'
    },
    success: (res) => {
      if (res.data.code === 0) {
        wx.showToast({
          title: res.data.message,
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
}
```

---

## ⚠️ 注意事项

1. **参数名变更**：正常加纸接口的参数从 `addCount` 改为 `newPaperCount`
2. **业务逻辑变更**：正常加纸不再累加，而是直接设置新值
3. **校准限制**：手动校准只能减少，不能增加纸张数量
4. **作废记录**：所有操作都会自动记录作废数量
5. **提醒清除**：加纸或校准后，会自动清除该设备的所有未处理提醒

---

## 📝 更新日志

**版本：v2.0**  
**日期：2025-10-16**

### 变更内容
1. ✅ 数据库新增 `nx_prr_waste_count` 字段
2. ✅ 正常加纸改为"更换新纸"逻辑，旧纸作废
3. ✅ 手动校准添加校验，只能减少
4. ✅ 所有操作自动记录作废数量
5. ✅ Service层新增 `refillPaperReplace` 和 `calibratePaper` 方法
6. ✅ Controller层更新接口参数和返回值

### 兼容性说明
- ❌ 旧的 `addCount` 参数不再支持，请使用 `newPaperCount`
- ❌ 不再支持累加加纸，如需累加请先查询当前数量后计算总和
- ✅ 旧的加纸记录数据不受影响，`nx_prr_waste_count` 默认为0

---

## 🆘 常见问题

### Q1: 为什么正常加纸不能累加了？
**A:** 针式打印机使用连续纸，更换新纸时旧纸无法继续使用，必须作废。因此改为直接设置新纸数量，旧纸全部作废。

### Q2: 校准时为什么只能减少，不能增加？
**A:** 校准的目的是修正系统数量偏高的情况（如卡纸、误报）。如需增加纸张，请使用"正常加纸"接口。

### Q3: 如何查看历史作废记录？
**A:** 使用以下SQL查询：
```sql
SELECT * FROM nx_machine_paper_refill_record 
WHERE nx_prr_device_id = 14 
ORDER BY nx_prr_create_time DESC;
```

### Q4: 作废的纸张能否恢复？
**A:** 不能。作废数量仅用于统计，无法恢复到设备余量。

---

## 📞 技术支持

如有问题，请联系开发团队。

