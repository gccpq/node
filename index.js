const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const visits = {};

function encrypt(text, appName) {
  switch (appName) {
    case 'sha256':
      return crypto.createHash('sha256').update(text).digest('hex');
    case 'aes':
      const key = crypto.createHash('sha256').update('secret').digest();
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(text, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      return iv.toString('base64') + ':' + encrypted;
    default:
      return Buffer.from(text).toString('base64');
  }
}

app.post('/encrypt', (req, res) => {
  const { text } = req.body;
  const appName = req.query.app;
  if (!text || !appName) {
    return res.status(400).json({ error: 'missing text or app' });
  }
  const result = encrypt(text, appName);
  res.json({ encrypted: result });
});

app.get('/info', async (req, res) => {
  const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip || '').replace('::ffff:', '');
  const now = new Date();
  visits[ip] = (visits[ip] || 0) + 1;
  let location = {};
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    location = await response.json();
  } catch (e) {
    location = { error: 'lookup failed' };
  }
  res.json({ ip, location, count: visits[ip], time: now.toISOString() });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
