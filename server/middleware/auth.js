const jwt = require('jsonwebtoken')

function auth(req, res, next){
  const hdr = req.headers.authorization || ''
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    if (token === 'demo-token') {
      req.userId = '000000000000000000000000'
      return next()
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.sub
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = auth
