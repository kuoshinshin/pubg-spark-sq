import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'

// 创建Vue应用
const app = createApp(App)

// 使用ElementPlus
app.use(ElementPlus)

// 注册图片懒加载指令
app.directive('lazy', {
  mounted(el, binding) {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 图片进入视口，加载图片
          el.src = binding.value
          el.classList.add('loaded')
          // 停止观察
          observer.unobserve(el)
        }
      })
    }, options)

    // 开始观察
    observer.observe(el)
  }
})

// 注册全局性能优化方法
app.config.globalProperties.$optimize = {
  // 防抖函数
  debounce(fn, delay) {
    let timer = null
    return function() {
      const context = this
      const args = arguments
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, delay)
    }
  },
  
  // 节流函数
  throttle(fn, delay) {
    let lastTime = 0
    return function() {
      const currentTime = Date.now()
      if (currentTime - lastTime > delay) {
        fn.apply(this, arguments)
        lastTime = currentTime
      }
    }
  }
}

// 挂载应用
app.mount('#app')

// PWA相关功能 - 暂时禁用，因为缺少service-worker.js文件
// if ('serviceWorker' in navigator) {
//   // 确保在文档完全加载且状态稳定后注册
//   if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', () => {
//       setTimeout(() => {
//         navigator.serviceWorker.register('/service-worker.js')
//           .then((registration) => {
//             console.log('Service Worker 注册成功:', registration.scope)
//           })
//           .catch((error) => {
//             console.error('Service Worker 注册失败:', error)
//           })
//       }, 1000)
//     })
//   } else {
//     setTimeout(() => {
//       navigator.serviceWorker.register('/service-worker.js')
//         .then((registration) => {
//           console.log('Service Worker 注册成功:', registration.scope)
//         })
//         .catch((error) => {
//           console.error('Service Worker 注册失败:', error)
//         })
//     }, 1000)
//   }
// }

// 处理添加到主屏幕事件
let deferredPrompt = null

window.addEventListener('beforeinstallprompt', (e) => {
  // 阻止Chrome 67及更早版本自动显示安装提示
  e.preventDefault()
  // 保存事件以便稍后触发
  deferredPrompt = e
  // 显示自定义的安装提示
  console.log('可以添加到主屏幕')
})

// 暴露安装应用的方法
window.installApp = () => {
  if (deferredPrompt) {
    // 显示安装提示
    deferredPrompt.prompt()
    // 等待用户响应
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('用户接受了安装提示')
      } else {
        console.log('用户拒绝了安装提示')
      }
      // 清除保存的事件
      deferredPrompt = null
    })
  }
}

// 性能监控
if (process.env.NODE_ENV === 'production') {
  // 监控首屏加载时间
  window.addEventListener('load', () => {
    const loadTime = performance.now()
    console.log(`首屏加载时间: ${loadTime.toFixed(2)}ms`)
  })
  
  // 监控资源加载
  window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
      console.warn('图片加载失败:', e.target.src)
    }
  }, true)
}
