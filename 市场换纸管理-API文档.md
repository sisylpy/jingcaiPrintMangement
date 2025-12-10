# 市场换纸管理 API 文档

## 概述

市场换纸管理模块提供了两个核心接口：
1. **市场设备换纸统计**：按设备聚合统计某市场下所有设备的换纸情况
2. **设备换纸记录明细**：查询某个设备的所有换纸记录详情

## 接口清单

### 1. 查询市场设备换纸统计

查询某市场下所有有换纸记录的设备及其统计数据（按设备分组聚合）。

**接口路径**
```
GET /api/machine/refill/listMarketRecords
```

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| marketId | Integer | 是 | 市场ID |
| startDate | String | 否 | 开始日期，格式：yyyy-MM-dd |
| stopDate | String | 否 | 结束日期，格式：yyyy-MM-dd |
| offset | Integer | 否 | 分页偏移量，默认0 |
| limit | Integer | 否 | 每页数量，默认20 |

**请求示例**
```bash
# 查询市场1的所有设备换纸统计
GET /api/machine/refill/listMarketRecords?marketId=1

# 查询市场1在指定日期范围内的设备换纸统计
GET /api/machine/refill/listMarketRecords?marketId=1&startDate=2025-10-01&stopDate=2025-10-23

# 分页查询
GET /api/machine/refill/listMarketRecords?marketId=1&offset=0&limit=10
```

**返回数据**

```json
{
  "code": 0,
  "msg": "success",
  "list": [
    {
      "deviceId": 3,                          // 设备ID
      "deviceName": "打印机A",                 // 设备名称
      "deviceNo": "PRN001",                   // 设备编号
      "currentPaperCount": 500,               // 当前余纸数量
      "paperType": 1,                         // 纸张类型（1=整张，2=半张，3=三分之一张）
      "paperTypeName": "整张",                // 纸张类型名称
      "refillCount": 15,                      // 换纸次数
      "totalRefill": 1500,                    // 加纸总数（类型1：正常换纸）
      "refillWaste": 150,                     // 换纸作废数
      "calibrateWaste": 50,                   // 校准作废数（类型3：手动校准）
      "totalWaste": 200,                      // 总作废数
      "lastRefillTime": "2025-10-23 10:00:00" // 最后一次换纸时间
    },
    {
      "deviceId": 5,
      "deviceName": "打印机B",
      "deviceNo": "PRN002",
      "currentPaperCount": 300,
      "paperType": 2,
      "paperTypeName": "半张",
      "refillCount": 8,
      "totalRefill": 800,
      "refillWaste": 80,
      "calibrateWaste": 20,
      "totalWaste": 100,
      "lastRefillTime": "2025-10-22 15:30:00"
    }
  ],
  "total": 10,  // 设备总数
  "summary": {  // 整个市场的统计汇总
    "totalRefill": 5000,       // 市场总加纸数
    "totalWaste": 500,         // 市场总作废数
    "refillWaste": 350,        // 市场换纸作废数
    "calibrateWaste": 150      // 市场校准作废数
  }
}
```

**字段说明**

- **list**: 设备列表（按最后换纸时间降序排列）
  - `deviceId`: 设备ID
  - `deviceName`: 设备名称
  - `deviceNo`: 设备编号
  - `currentPaperCount`: 设备当前余纸数量
  - `paperType`: 纸张类型（1=整张，2=半张，3=三分之一张）
  - `paperTypeName`: 纸张类型名称
  - `refillCount`: 在统计时间范围内的换纸次数（包含正常换纸和手动校准）
  - `totalRefill`: 加纸总数（仅统计类型1：正常换纸）
  - `refillWaste`: 换纸作废数（正常换纸时旧纸作废）
  - `calibrateWaste`: 校准作废数（手动校准时的作废数）
  - `totalWaste`: 总作废数 = refillWaste + calibrateWaste
  - `lastRefillTime`: 最后一次换纸时间

- **total**: 有换纸记录的设备总数（用于分页）

- **summary**: 整个市场的统计汇总
  - `totalRefill`: 市场所有设备的加纸总数
  - `totalWaste`: 市场所有设备的总作废数
  - `refillWaste`: 市场所有设备的换纸作废数
  - `calibrateWaste`: 市场所有设备的校准作废数

---

### 2. 查询设备换纸记录明细

查询某个设备的所有换纸记录详情（按时间降序）。

**接口路径**
```
GET /api/machine/refill/listDeviceRecords
```

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| deviceId | Integer | 是 | 设备ID |
| startDate | String | 否 | 开始日期，格式：yyyy-MM-dd |
| stopDate | String | 否 | 结束日期，格式：yyyy-MM-dd |
| offset | Integer | 否 | 分页偏移量，默认0 |
| limit | Integer | 否 | 每页数量，默认20 |

**请求示例**
```bash
# 查询设备3的所有换纸记录
GET /api/machine/refill/listDeviceRecords?deviceId=3

# 查询设备3在指定日期范围内的换纸记录
GET /api/machine/refill/listDeviceRecords?deviceId=3&startDate=2025-10-01&stopDate=2025-10-23

# 分页查询
GET /api/machine/refill/listDeviceRecords?deviceId=3&offset=0&limit=10
```

**返回数据**

```json
{
  "code": 0,
  "msg": "success",
  "list": [
    {
      "recordId": 101,                        // 记录ID
      "deviceId": 3,                          // 设备ID
      "deviceName": "打印机A",                 // 设备名称
      "deviceNo": "PRN001",                   // 设备编号
      "refillType": 1,                        // 换纸类型（1=正常换纸，3=手动校准）
      "refillTypeName": "正常换纸",           // 换纸类型名称
      "paperType": 1,                         // 纸张类型（1=整张，2=半张，3=三分之一张）
      "paperTypeName": "整张",                // 纸张类型名称
      "addCount": 100,                        // 加纸数量
      "wasteCount": 10,                       // 作废数量
      "paperCount": 500,                      // 换纸后余量
      "remark": "正常加纸（旧纸作废10张）",   // 备注
      "operatorId": 5,                        // 操作人ID
      "operatorName": "张三",                 // 操作人姓名
      "operatorPhone": "13800138000",         // 操作人手机号
      "createTime": "2025-10-23 10:00:00"     // 操作时间
    },
    {
      "recordId": 98,
      "deviceId": 3,
      "deviceName": "打印机A",
      "deviceNo": "PRN001",
      "refillType": 3,
      "refillTypeName": "手动校准",
      "paperType": 1,
      "paperTypeName": "整张",
      "addCount": -5,                         // 负数表示减少
      "wasteCount": 5,
      "paperCount": 410,
      "remark": "手动校准（校准作废5张）",
      "operatorId": 5,
      "operatorName": "张三",
      "operatorPhone": "13800138000",
      "createTime": "2025-10-22 15:30:00"
    }
  ],
  "total": 50,  // 换纸记录总数
  "summary": {  // 该设备的统计汇总
    "totalRefill": 1500,       // 设备总加纸数
    "totalWaste": 200,         // 设备总作废数
    "refillWaste": 150,        // 设备换纸作废数
    "calibrateWaste": 50       // 设备校准作废数
  }
}
```

**字段说明**

- **list**: 换纸记录列表（按操作时间降序排列）
  - `recordId`: 记录ID
  - `deviceId`: 设备ID
  - `deviceName`: 设备名称
  - `deviceNo`: 设备编号
  - `refillType`: 换纸类型（1=正常换纸，3=手动校准）
  - `refillTypeName`: 换纸类型名称
  - `paperType`: 纸张类型（1=整张，2=半张，3=三分之一张）
  - `paperTypeName`: 纸张类型名称
  - `addCount`: 加纸数量（正常换纸为正数，手动校准可能为负数）
  - `wasteCount`: 作废数量
  - `paperCount`: 换纸后的纸张余量
  - `remark`: 备注说明
  - `operatorId`: 操作人ID
  - `operatorName`: 操作人姓名
  - `operatorPhone`: 操作人手机号
  - `createTime`: 操作时间

- **total**: 换纸记录总数（用于分页）

- **summary**: 该设备在统计时间范围内的汇总数据
  - `totalRefill`: 设备加纸总数（仅统计类型1：正常换纸）
  - `totalWaste`: 设备总作废数
  - `refillWaste`: 设备换纸作废数
  - `calibrateWaste`: 设备校准作废数

---

## 使用场景

### 场景1：市场管理员查看市场整体换纸情况

市场管理员登录后，需要查看本市场所有设备的换纸情况：

1. 调用 `/listMarketRecords?marketId=1` 获取设备列表
2. 查看 `summary` 了解市场整体加纸和作废情况
3. 查看 `list` 了解每个设备的换纸统计
4. 根据 `totalWaste` 和 `totalRefill` 计算纸张浪费率

```javascript
// 示例代码
fetch('/api/machine/refill/listMarketRecords?marketId=1')
  .then(res => res.json())
  .then(data => {
    const { list, summary } = data;
    
    // 显示市场整体统计
    console.log('市场加纸总数:', summary.totalRefill);
    console.log('市场作废总数:', summary.totalWaste);
    console.log('浪费率:', (summary.totalWaste / summary.totalRefill * 100).toFixed(2) + '%');
    
    // 显示设备列表
    list.forEach(device => {
      console.log(`${device.deviceName}: 加纸${device.totalRefill}张, 作废${device.totalWaste}张`);
    });
  });
```

### 场景2：查看某个设备的换纸历史

点击某个设备，查看该设备的详细换纸记录：

1. 调用 `/listDeviceRecords?deviceId=3` 获取换纸记录
2. 查看 `summary` 了解设备整体情况
3. 查看 `list` 了解每次换纸的详细信息（操作人、时间、数量等）

```javascript
// 示例代码
fetch('/api/machine/refill/listDeviceRecords?deviceId=3')
  .then(res => res.json())
  .then(data => {
    const { list, summary } = data;
    
    // 显示设备统计
    console.log('设备加纸总数:', summary.totalRefill);
    console.log('设备作废总数:', summary.totalWaste);
    
    // 显示换纸记录
    list.forEach(record => {
      console.log(`${record.createTime} - ${record.refillTypeName}: ${record.operatorName} 操作, 加纸${record.addCount}张, 作废${record.wasteCount}张`);
    });
  });
```

### 场景3：按日期范围统计

查询某市场在指定时间范围内的换纸情况（例如本月统计）：

```javascript
// 示例：查询本月数据
const startDate = '2025-10-01';
const stopDate = '2025-10-31';

fetch(`/api/machine/refill/listMarketRecords?marketId=1&startDate=${startDate}&stopDate=${stopDate}`)
  .then(res => res.json())
  .then(data => {
    console.log('本月统计:', data.summary);
  });
```

---

## 数据说明

### 换纸类型

| 类型值 | 类型名称 | 说明 |
|--------|----------|------|
| 1 | 正常换纸 | 更换新纸，旧纸作废，`addCount` 为新纸数量，`wasteCount` 为旧纸数量 |
| 3 | 手动校准 | 纸张数量校准，只能减少不能增加，`addCount` 为负数，`wasteCount` 为校准作废数 |

### 纸张类型

| 类型值 | 类型名称 | 说明 |
|--------|----------|------|
| 1 | 整张 | 标准A4整张 |
| 2 | 半张 | A4半张 |
| 3 | 三分之一张 | A4三分之一张 |

### 统计逻辑

1. **加纸总数（totalRefill）**：仅统计类型1（正常换纸）的 `addCount` 总和
2. **换纸作废数（refillWaste）**：仅统计类型1（正常换纸）的 `wasteCount` 总和
3. **校准作废数（calibrateWaste）**：仅统计类型3（手动校准）的 `wasteCount` 总和
4. **总作废数（totalWaste）**：refillWaste + calibrateWaste

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 500 | 服务器内部错误 |

**错误响应示例**
```json
{
  "code": 500,
  "msg": "查询失败：数据库连接异常"
}
```

---

## 注意事项

1. **日期格式**：startDate 和 stopDate 必须使用 `yyyy-MM-dd` 格式（如：2025-10-23）
2. **分页**：建议使用分页查询，避免一次查询过多数据
3. **日期范围**：stopDate 包含当天的所有记录（使用 `<=` 比较）
4. **设备筛选**：市场接口只返回有换纸记录的设备，没有换纸记录的设备不会显示
5. **统计汇总**：
   - 市场接口的 `summary` 是当前页所有设备的汇总（不是全部设备）
   - 如需全部统计，请使用不分页的查询或累加所有分页结果
6. **排序规则**：
   - 市场接口：按最后换纸时间降序（最近换纸的设备排在前面）
   - 设备接口：按换纸时间降序（最近的记录排在前面）

---

## 更新日志

### v1.0.0 (2025-10-23)
- 初始版本
- 提供市场设备换纸统计接口
- 提供设备换纸记录明细接口

