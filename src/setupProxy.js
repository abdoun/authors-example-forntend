const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/',
    createProxyMiddleware({
      target: 'http://localhost/authors/public',
      changeOrigin: true,
    }),
  )
}
