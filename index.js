const express = require('express');
const { encrypt } = require('./encryption');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const visits = {};

app.post('/encrypt', (req, res) => {
  const appName = req.query.app;
  const data = req.body;
  if (!data || !appName) {
    return res.status(400).json({ error: 'missing body or app' });
  }
  let text;
  if (typeof data === 'string') {
    text = data;
  } else if (data.text !== undefined) {
    text = data.text;
  } else {
    text = JSON.stringify(data);
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
