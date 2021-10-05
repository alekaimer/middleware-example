const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const AUTH_TOKEN = '123'
const HOST = 'localhost:3001'

const users = [
  { name: 'João', id: '123'},
  { name: 'Maria', id: '456'}
]

const posts = [
  { title: 'My First Post', id: '1'},
  { title: 'My Second Post', id: '2'}
]

//IP BLOCK
app.use((req,res,next) => {
  console.log("req.ip", req.ip)

  if(req.ip === '0.0.0.0'){
    next(new Error('[Error]'))
  }
  else {
    next()
  }
})

async function getUser() {
  return {
    id: 123,
    name: "Test"
  }
}

app.use(async (req, res, next)=>{
  const user = await getUser()

  req.locals = {
    user
  }

  next()
})

app.get('/', async (req, res) => {
  const user = req.locals.user
  res.json({
    status: 'ok',
    data: user
  })
})


//USERS
app.get('/users', (req, res) => {
  res.status(200).send(users)
})

app.get('/users:name', (req, res) => {
  const { name } = req.params 
  const user = users.find(user => user.name === name)
  if (user) res.status(200).send(users)
  else res.status(404).send('[Not found]')
})

app.post('/users', (req, res) => {
  const user = req.body
  users.push(user)
  res.status(201).send('[created]')
})


//POSTS
function validadeAuthToken(req, res, next) {
  console.log('Inside validade Auth Token')
  // console.log(req.headers)
  const { host, authorization } = req.headers

  if (host === HOST) {
    console.log('[localhost:3001 in here!]')
    
    if (authorization && authorization === AUTH_TOKEN) {
      next()
    } else {
      res.status(403).send('[Forbidden]')
    }
  }
}

app.get('/posts', (req, res) => {
  res.status(200).send(posts)
})

app.post('/posts', validadeAuthToken, (req, res) => {
  const post = req.body
  posts.push(post)
  res.status(201).send(post)
})

app.listen(3001, () => {
  console.log('[server] running')
})