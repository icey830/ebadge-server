{
 "version": 2,
 "name": "ebadge-server",
   "build": {
    "env": {
      "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD": "true"
    }
  },
 "alias": "ebadge-server.elvns.now.sh",
 "env": {
  "BASE_URL": "https://badge.elvns.com"
  },
 "builds": [
    {
      "src": "server.js",
      "use": "@now/node",
      "config": { "maxLambdaSize": "40mb" }
    }
  ],
  routes": [
    {
      "src": "/",
      "status": 301,
      "headers": { "Location": "https://elvbadges.elvns.com/" }
    },
    { "src": "/favicon.ico", "status": 404 },
    { "src": "/(.+)", "dest": "/server.js" }
  ]
}
