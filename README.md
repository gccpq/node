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

### `POST /encrypt?app=<应用名称>`

请求体为需要加密的数据，可以是任意 JSON。服务会根据 `app` 名称选择对应的算法，映射关系在 `index.js` 中的 `appAlgorithms` 变量里定义。

- `hashApp`：返回 SHA-256 哈希。
- `aesApp`：使用 AES-256-CBC 加密。
- 未配置的应用：返回 `unknown app` 错误。

示例：

```bash
curl -X POST "http://localhost:3000/encrypt?app=hashApp" \
  -H "Content-Type: application/json" \
  -d '{"text":"hello"}'
```

加密实现位于 `encryption.js`，可根据需要修改或扩展。

### `GET /info`

返回发起请求的 IP、地理位置、访问次数等信息。

示例：

```bash
curl "http://localhost:3000/info"
```

静态文件可以通过 `http://localhost:3000/` 访问 `public` 目录下的内容。

