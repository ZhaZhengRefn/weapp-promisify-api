# weapp-promisify

## usage

- Before:
```js
wx.setStorage({
  key: "key",
  data: "value",
  success: function() {
    console.log('>>>save success.')
  },
  fail: function() {
    console.log('>>>save fail.')
  },
})
```

- After:
```js
const Promisify = require('weapp-promisify')

const weapp = new Promisify(wx)

weapp.setStorage({
  key: "key",
  data: "value",  
})
.then(() => {
  console.log('>>>save success.')
})
.catch(() => {
  console.log('>>>save error.')
})
//>>>save success.
```

## option
- interceptor
```js
const Promisify = require('weapp-promisify')

const weapp = new Promisify(wx)

weapp.use(function(opt) {
  if (opt.key === 'key') {
    return false
  }
  return true
})

weapp.setStorage({
  key: "key",
  data: "value",  
})
.then(() => {
  console.log('>>>save success.')
})
.catch((e) => {
  console.log('>>>save error.', e)
})
//>>>save error. weapp-promisify interceptor return false
```