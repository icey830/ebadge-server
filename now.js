{
 "version": 2,
 "name": "ebadge-server",
   "build": {
    "env": {
      "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD": "true"
    }
  },
 "alias": "ebadge-server.elvns.now.sh",
 "builds": [
    {
      "src": "server.js",
      "use": "@now/node",
      "config": { "maxLambdaSize": "40mb" }
    }
  ],
  routes": [
    {
      "src": "/"
    },
    { "src": "/favicon.ico", "status": 404 }
  ]
}
