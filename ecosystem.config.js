
module.exports = {
  apps: [
    {
      name: "preorder-app",
      script: "src/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
}
