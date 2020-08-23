const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../conf/constants')
const util = require('util')
const verify = util.promisify(jwt.verify)

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

// 模拟登陆
router.post('/login', async (ctx, next) => {
  const { userName, password } = ctx.request.body
  let userInfo

  if (userName === 'zhangsan' && password === '123') {
    // 登陆成功
    userInfo = {
      userId: 1,
      userName: 'zhangsan',
      nickName: '张三',
      gender: 1
    }
  }


  if (!userInfo) {
    ctx.body = {
      errno: -1,
      msg: '登陆失败'
    }
    return
  }

  // 加密userInfo
  const token = jwt.sign(userInfo, SECRET, {
    expiresIn: '1h'
  })

  ctx.body = {
    errno: 0,
    data: token
  }
})

// 获取用户信息
router.get('/getUserInfo', async (ctx, next) => {
  const token = ctx.header.authorization
  try {
    const payload = await verify(token.split(' ')[1], SECRET)
    ctx.body = {
      errno: 0,
      userInfo: payload
    }
  } catch (ex) {
    ctx.body = {
      errno: -1,
      userInfo: 'verify token failed'
    }
  }
})

module.exports = router
