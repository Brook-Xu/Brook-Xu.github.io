# 接口

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