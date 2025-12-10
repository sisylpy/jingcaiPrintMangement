# 市场充值换纸管理 API 文档

## 概述

本文档描述了市场充值管理和换纸管理的API接口，用于统计市场配送商的充值情况和设备的纸张消耗情况。

## 一、市场充值管理

### 1.1 查询市场充值统计

**接口地址：** `GET /api/nxdistributerpay/marketRechargeStats`

**功能描述：** 按日期统计某市场的充值金额和点数

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| marketId | Integer | 是 | 市场ID |
| startDate | String | 否 | 开始日期，格式：yyyy-MM-dd |
| stopDate | String | 否 | 结束日期，格式：yyyy-MM-dd |

**请求示例：**
```
GET /api/nxdistributerpay/marketRechargeStats?marketId=2&startDate=2025-01-15&stopDate=2025-01-16
```

**响应示例：**
```json
{
    "code": 0,
    "totalAmount": 650.00,
    "totalPoints": 65000,
    "rechargeCount": 4,
    "distributerCount": 1
}
```

**响应字段说明：**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| totalAmount | Double | 总充值金额（元） |
| totalPoints | Integer | 总充值点数 |
| rechargeCount | Integer | 充值次数 |
| distributerCount | Integer | 配送商数量 |

### 1.2 查询市场配送商列表

**接口地址：** `GET /api/nxdistributerpay/marketDistributers`

**功能描述：** 查询市场配送商列表（含剩余点数）

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| marketId | Integer | 是 | 市场ID |

**请求示例：**
```
GET /api/nxdistributerpay/marketDistributers?marketId=2
```

**响应示例：**
```json
{
    "code": 0,
    "list": [
        {
            "nxDistributerId": 1,
            "nxDistributerName": "配送商1",
            "nxDistributerBuyQuantity": 85000,
            "nxDistributerSysMarketId": 2
        }
    ]
}
```

## 二、市场换纸管理

### 2.1 查询市场换纸记录列表

**接口地址：** `GET /api/machine/refill/statsMarket`

**功能描述：** 查询某市场的换纸记录列表，包括：
1. 正常加纸/更换（类型1）
2. 手动校准（类型3）

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| marketId | Integer | 是 | 市场ID |
| startDate | String | 否 | 开始日期，格式：yyyy-MM-dd |
| stopDate | String | 否 | 结束日期，格式：yyyy-MM-dd |
| offset | Integer | 否 | 分页偏移量 |
| limit | Integer | 否 | 每页数量，默认20 |

**请求示例：**
```
GET /api/machine/refill/statsMarket?marketId=2&startDate=2025-01-15&stopDate=2025-01-16&offset=0&limit=20
```

**响应示例：**
```json
{
    "code": 0,
    "list": [
        {
            "recordId": 1,
            "deviceId": 14,
            "deviceName": "市场2-1号打印机",
            "deviceNo": "PD202410150010",
            "refillType": 1,
            "refillTypeName": "正常换纸",
            "addCount": 1000,
            "wasteCount": 50,
            "paperCount": 950,
            "remark": "正常更换纸张",
            "operatorId": 1,
            "operatorName": "张三",
            "operatorPhone": "13800138000",
            "createTime": "2025-01-16 10:30:00"
        },
        {
            "recordId": 2,
            "deviceId": 14,
            "deviceName": "市场2-1号打印机",
            "deviceNo": "PD202410150010",
            "refillType": 3,
            "refillTypeName": "手动校准",
            "addCount": 0,
            "wasteCount": 20,
            "paperCount": 930,
            "remark": "手动校准纸张数量",
            "operatorId": 1,
            "operatorName": "张三",
            "operatorPhone": "13800138000",
            "createTime": "2025-01-16 09:15:00"
        }
    ],
    "total": 2,
    "summary": {
        "totalRefill": 1000,
        "totalWaste": 70,
        "refillWaste": 50,
        "calibrateWaste": 20
    }
}
```

**响应字段说明：**

**换纸记录字段（list）：**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| recordId | Integer | 换纸记录ID |
| deviceId | Integer | 设备ID |
| deviceName | String | 设备名称 |
| deviceNo | String | 设备编号 |
| refillType | Integer | 换纸类型（1=正常换纸，3=手动校准） |
| refillTypeName | String | 换纸类型名称 |
| addCount | Integer | 加纸数量 |
| wasteCount | Integer | 作废数量 |
| paperCount | Integer | 换纸后剩余数量 |
| remark | String | 备注 |
| operatorId | Integer | 换纸人ID |
| operatorName | String | 换纸人姓名 |
| operatorPhone | String | 换纸人手机号 |
| createTime | String | 换纸时间 |

**汇总统计字段（summary）：**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| totalRefill | Integer | 总加纸量（只统计类型1） |
| totalWaste | Integer | 总作废量 |
| refillWaste | Integer | 更换作废量（类型1） |
| calibrateWaste | Integer | 校准作废量（类型3） |

**其他字段：**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| total | Integer | 记录总数 |

## 三、数据说明

### 3.1 充值记录说明
- **充值类型**：只统计 `nx_ndp_type = 1`（购买点数）的记录
- **充值状态**：只统计 `nx_ndp_status = 0`（支付成功）的记录
- **日期过滤**：基于 `nx_ndp_pay_time` 字段进行日期过滤

### 3.2 换纸记录说明
- **换纸类型1**：正常加纸/更换（`nx_prr_refill_type = 1`）
- **换纸类型3**：手动校准（`nx_prr_refill_type = 3`）
- **日期过滤**：基于 `nx_prr_create_time` 字段进行日期过滤

### 3.3 打印记录说明
- **打印状态**：只统计 `nx_pr_print_status = 1`（打印成功）的记录
- **日期过滤**：基于 `nx_pr_print_time` 字段进行日期过滤

## 四、测试数据

### 4.1 充值统计测试
```sql
-- 执行测试脚本
source 测试市场充值统计接口.sql
```

### 4.2 换纸统计测试
```sql
-- 执行测试脚本
source 测试市场换纸统计接口.sql
```

## 五、错误处理

### 5.1 常见错误码
- `code: 0` - 成功
- `code: 500` - 服务器内部错误

### 5.2 错误响应示例
```json
{
    "code": 500,
    "msg": "统计失败：数据库连接异常"
}
```

## 六、注意事项

1. **日期格式**：所有日期参数必须使用 `yyyy-MM-dd` 格式
2. **市场隔离**：管理员只能查询自己负责的市场数据
3. **数据权限**：确保调用方有相应的市场访问权限
4. **性能优化**：大量数据查询时建议使用日期范围限制
