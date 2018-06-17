// The methods no need to promisify
const noPromiseMethods = [
  // 媒体
  'stopRecord',
  'getRecorderManager',
  'pauseVoice',
  'stopVoice',
  'pauseBackgroundAudio',
  'stopBackgroundAudio',
  'getBackgroundAudioManager',
  'createAudioContext',
  'createInnerAudioContext',
  'createVideoContext',
  'createCameraContext',

  // 位置
  'createMapContext',

  // 设备
  'canIUse',
  'startAccelerometer',
  'stopAccelerometer',
  'startCompass',
  'stopCompass',
  'onBLECharacteristicValueChange',
  'onBLEConnectionStateChange',

  // 界面
  'hideToast',
  'hideLoading',
  'showNavigationBarLoading',
  'hideNavigationBarLoading',
  'navigateBack',
  'createAnimation',
  'pageScrollTo',
  'createSelectorQuery',
  'createCanvasContext',
  'createContext',
  'drawCanvas',
  'hideKeyboard',
  'stopPullDownRefresh',

  // 拓展接口
  'arrayBufferToBase64',
  'base64ToArrayBuffer'
];

const noPromiseMap = {} 
noPromiseMethods.forEach(method => {
  noPromiseMap[method] = 1
})

function after(fn, afterFn) {
  return function(...args) {
    const res = fn.apply(this, args)
    if (res === false) {
      return afterFn.apply(this, args)
    }
    return res
  }
}

function chain(fns){
  return fns.reduce((pre, next) => {
    return after(pre, next)
  })
}

function nope() {
  throw new Error('weapp-promisify interceptor return false')
}

function promisify(fn, caller, getChains = () => {}) {
  return function (opt) {
    return new Promise((resolve, reject) => {
      const chains = getChains()
      typeof chains === 'function' && chains(opt)

      fn.call(caller, {
        ...opt,
        success(...args) {
          resolve(...args)
        },
        fail(...args) {
          reject(...args)
        }
      })
    })
  }
}

export default class WeappPromisify {
  constructor(wx) {
    Object.keys(wx).forEach(key => {
      if (!noPromiseMap[key] && key.substr(0, 2) !== 'on' && key.substr(-4) !== 'Sync') {
        this[key] = promisify(wx[key], wx, () => this._chains)
      }
    })

    this._interceptors = []
    this._chains = () => {}
  }

  use(fn) {
    this._interceptors.push(fn)
    this._chains = chain([ ...this._interceptors, nope ])
  }
}