import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 创建Vue应用
const app = createApp(App)

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
