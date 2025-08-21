const crypto = require('crypto');

function encrypt(text, appName) {
  switch (appName) {
    case 'sha256':
    case 'SHA256':
    case '哈希':
    case '哈希256':
      return crypto.createHash('sha256').update(text).digest('hex');
    case 'aes':
    case 'AES':
    case '对称':
    case '对称加密':
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

module.exports = { encrypt };
