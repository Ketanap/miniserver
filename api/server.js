// See https://github.com/typicode/json-server#module
const jsonServer = require('json-server')

const server = jsonServer.create()
const auth = require('json-server-auth')
// Uncomment to allow write operations
// const fs = require('fs')
// const path = require('path')
// const filePath = path.join('db.json')
// const data = fs.readFileSync(filePath, "utf-8");
// const db = JSON.parse(data);
// const router = jsonServer.router(db)

// Comment out to allow write operations
const router = jsonServer.router('db.json')
server.db = router.db
const middlewares = jsonServer.defaults()
const rules = auth.rewriter({
    // Permission rules

    posts: 660,
    // Other rules
})
  
  // You must apply the middlewares in the following order
server.use(rules)
//server.use(middlewares)
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'authorization');
    res.header('Access-Control-Request-Headers', 'authorization');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Request-Methods', 'GET');
    if (req.path == '/api/auth/login') {
      next();
    } else {
      if (isAuthorized(req)) { // add your authorization logic here
        next() // continue to JSON Server router
      } else {
        res.sendStatus(401)
      }
    }
  })
server.use(auth)

// Add this before server.use(router)
/*server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id'
}))*/

server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server
