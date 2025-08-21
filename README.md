# 使用说明

这是一个基于 Express 的示例服务，提供加密和访问信息功能。

## 安装

```bash
npm install
```

## 启动

```bash
node index.js
```

默认会在 `3000` 端口启动，可以通过设置环境变量 `PORT` 修改。

## API

### `POST /encrypt?app=<算法>`

请求体必须是 `JSON`，包含字段 `text`。`app` 参数决定加密算法：

- `sha256`：返回 SHA-256 哈希。
- `aes`：使用 AES-256-CBC 加密。
- 其他值：返回 Base64 编码。

示例：

```bash
curl -X POST "http://localhost:3000/encrypt?app=sha256" \
  -H "Content-Type: application/json" \
  -d '{"text":"hello"}'
```

### `GET /info`

返回发起请求的 IP、地理位置、访问次数等信息。

示例：

```bash
curl "http://localhost:3000/info"
```

静态文件可以通过 `http://localhost:3000/` 访问 `public` 目录下的内容。

