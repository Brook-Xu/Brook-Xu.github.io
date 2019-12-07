# 接口
`http://lll702.wicp.vip`


## 上传图片
### 请求
`POST /upload`  
`<input type="file" name="img" />`
### 响应
`JSON` 格式
| status | msg          |
| ------ | ------------ |
| 200    | 图片名       |
| -100   | 图片上传失败 |
| -999   | 系统错误     |

## 获取图片
### 请求
`GET /show/{filename}`  

filename: 图片名

### 响应
成功：返回图片，`Content-Type = image/png`  
失败：404

## 图片评分
### 请求
`POST /score`
```
FormData 
{
    filename : 图片名
    person: "专业人士" | "非专业人士"
    score    : 分数
}
```

### 响应
成功：200  
失败：500 