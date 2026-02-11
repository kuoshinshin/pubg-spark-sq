<script setup>
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'

// 动态导入组件，实现懒加载
const Login = defineAsyncComponent(() => import('./components/auth/Login.vue'))
const Register = defineAsyncComponent(() => import('./components/auth/Register.vue'))
const Chat = defineAsyncComponent(() => import('./components/chat/Chat.vue'))
const Profile = defineAsyncComponent(() => import('./components/profile/Profile.vue'))
const Match = defineAsyncComponent(() => import('./components/match/Match.vue'))


// 登录状态管理
const isLoggedIn = ref(false)
const userData = ref(null)
const authPage = ref('login') // 'login' 或 'register'

// 深色模式状态
const darkMode = ref(false)

// PWA安装状态
const canInstallPWA = ref(false)
const isInstalling = ref(false)

// 页面状态管理
const currentPage = ref(localStorage.getItem('currentPage') || 'home')

// 登录处理
const handleLogin = (user) => {
  // 登录成功
  isLoggedIn.value = true
  // 使用后端返回的用户信息
  userData.value = {
    username: user.username,
    avatar: user.avatar,
    role: user.role || 'user' // 保存用户角色信息
  }
  // 保存登录状态到本地存储
  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('userData', JSON.stringify(userData.value))
  // 保存 token 到本地存储
  if (user.token) {
    localStorage.setItem('token', user.token)
  }
  return true
}

// 注册处理
const handleRegister = () => {
  // 注册成功后切换到登录页面
  authPage.value = 'login'
}

// 退出登录
const handleLogout = () => {
  isLoggedIn.value = false
  userData.value = null
  // 清除本地存储
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('userData')
  localStorage.removeItem('token')
  // 跳转到登录页面
  window.location.hash = 'login'
  // 强制页面刷新，确保状态更新
  window.location.reload()
}

// 切换深色模式
const toggleDarkMode = async () => {
  const newDarkMode = !darkMode.value
  darkMode.value = newDarkMode
  
  // 保存到本地存储
  localStorage.setItem('darkMode', newDarkMode)
  
  // 应用深色模式样式
  if (newDarkMode) {
    document.documentElement.classList.add('dark-mode')
  } else {
    document.documentElement.classList.remove('dark-mode')
  }
}

// 从本地存储加载深色模式设置
const loadDarkModeFromStorage = () => {
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode !== null) {
    const isDark = savedDarkMode === 'true'
    darkMode.value = isDark
    if (isDark) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }
}

// 处理页面切换
const handlePageChange = (page) => {
  // 跳过 logout 页面，因为它是一个操作，不是一个实际的页面
  if (page !== 'logout') {
    currentPage.value = page
    // 保存当前页面到本地存储
    localStorage.setItem('currentPage', page)
  }
}

// 处理轮播按钮点击
const handleSlideButtonClick = (action) => {
  console.log('轮播按钮点击:', action)
  // 这里可以根据不同的action执行不同的操作
  switch (action) {
    case 'join':
      alert('欢迎加入PUBG Spark Squad！')
      break
    case 'learn':
      alert('了解更多关于PUBG Spark Squad的信息')
      break
    case 'schedule':
      alert('查看比赛赛程')
      break
    case 'register':
      alert('报名参加比赛')
      break
    case 'details':
      alert('查看活动详情')
      break
    case 'attend':
      alert('报名参加线下聚会')
      break
    default:
      break
  }
}

// 处理PWA安装
const handleInstallPWA = () => {
  if (window.installApp) {
    isInstalling.value = true
    window.installApp()
    // 安装完成后重置状态
    setTimeout(() => {
      isInstalling.value = false
    }, 3000)
  }
}

// 监听hash变化，切换登录/注册页面
const handleHashChange = () => {
  const hash = window.location.hash
  if (hash === '#login') {
    authPage.value = 'login'
  } else if (hash === '#register') {
    authPage.value = 'register'
  } else if (hash.startsWith('#post-')) {
    // 处理分享链接，跳转到圈子页面
    currentPage.value = 'chat'
  }
}

// 带路由守卫的hash变化处理函数
const handleHashChangeWithGuard = () => {
  const hash = window.location.hash
  
  // 处理分享链接
  if (hash.startsWith('#post-')) {
    // 检查token
    const token = localStorage.getItem('token')
    if (!token) {
      // 没有token，强制跳转到登录页面
      window.location.hash = 'login'
    } else {
      // 有token，跳转到圈子页面
      currentPage.value = 'chat'
      // 保存当前页面到本地存储
      localStorage.setItem('currentPage', 'chat')
    }
  } else {
    handleHashChange()
    // 检查当前是否在登录/注册页面
    if (hash !== '#login' && hash !== '#register') {
      // 非登录/注册页面，检查token
      const token = localStorage.getItem('token')
      if (!token) {
        // 没有token，强制跳转到登录页面
        window.location.hash = 'login'
      }
    }
  }
}

// 生命周期钩子
onMounted(() => {
  // 检查token和登录状态
  const token = localStorage.getItem('token')
  const savedLoginState = localStorage.getItem('isLoggedIn')
  const savedUserData = localStorage.getItem('userData')
  
  if (token && savedLoginState === 'true' && savedUserData) {
    isLoggedIn.value = true
    userData.value = JSON.parse(savedUserData)
    // 确保用户数据中包含角色信息
    if (!userData.value.role) {
      userData.value.role = 'user'
    }
  } else {
    // 没有token或登录状态，跳转到登录页面
    isLoggedIn.value = false
    userData.value = null
    // 检查是否是分享链接
    const hash = window.location.hash
    if (!hash.startsWith('#post-')) {
      window.location.hash = 'login'
    }
  }
  
  // 加载深色模式设置
  loadDarkModeFromStorage()
  
  // 初始检查hash
  handleHashChangeWithGuard()
  
  // 监听hash变化，实现路由守卫
  window.addEventListener('hashchange', handleHashChangeWithGuard)
  
  // 监听beforeinstallprompt事件
  window.addEventListener('beforeinstallprompt', (e) => {
    // 阻止Chrome 67及更早版本自动显示安装提示
    e.preventDefault()
    // 可以安装PWA
    canInstallPWA.value = true
  })
})

onUnmounted(() => {
  // 移除hash变化监听
  window.removeEventListener('hashchange', handleHashChangeWithGuard)
})
</script>

<template>
  <div class="app">
    <!-- 登录和注册页面 -->
    <div v-if="!isLoggedIn">
      <!-- 登录页面 -->
      <Login v-if="authPage === 'login'" :on-login="handleLogin" />
      <!-- 注册页面 -->
      <Register v-else-if="authPage === 'register'" :on-register="handleRegister" />
    </div>
    
    <!-- 主内容 -->
    <div v-else>
      <!-- 导航栏 -->
      <header class="navbar">
        <div class="container">
          <div class="navbar-content">
            <div class="logo">
              <h1>PUBG Spark Squad</h1>
            </div>
            <el-menu :default-active="currentPage" class="el-menu-demo" mode="horizontal" @select="handlePageChange">
              <el-menu-item index="home">首页</el-menu-item>
              <el-menu-item index="chat">圈子</el-menu-item>
              <el-menu-item index="match">比赛</el-menu-item>

              <el-menu-item index="profile">个人</el-menu-item>
              <el-menu-item index="install" v-if="canInstallPWA">
                <template #title>
                  <el-button type="primary" @click="handleInstallPWA" :loading="isInstalling">
                    {{ isInstalling ? '安装中...' : '安装APP' }}
                  </el-button>
                </template>
              </el-menu-item>
              <el-menu-item index="logout" @click="handleLogout" style="display: flex; align-items: center; justify-content: center; cursor: pointer;">
                <template #title>
                  <div style="width: 100%; text-align: center;">退出登录</div>
                </template>
              </el-menu-item>
            </el-menu>
          </div>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="page-content">
        <!-- 首页 -->
        <div v-if="currentPage === 'home'">
          <!-- 轮播图 -->
          <section class="hero-carousel">
            <div class="container">
              <el-carousel :interval="5000" type="default" height="600px">
                <el-carousel-item>
                  <div class="carousel-slide">
                    <h3>欢迎加入 PUBG Spark Squad</h3>
                    <p>与队友一起征战沙场，共创辉煌</p>
                    <el-button type="primary" @click="handleSlideButtonClick('join')">立即加入</el-button>
                  </div>
                </el-carousel-item>
                <el-carousel-item>
                  <div class="carousel-slide">
                    <h3>了解更多关于我们</h3>
                    <p>探索团队文化，了解我们的使命</p>
                    <el-button type="primary" @click="handleSlideButtonClick('learn')">了解详情</el-button>
                  </div>
                </el-carousel-item>
                <el-carousel-item>
                  <div class="carousel-slide">
                    <h3>查看最新比赛赛程</h3>
                    <p>了解团队近期比赛安排</p>
                    <el-button type="primary" @click="handleSlideButtonClick('schedule')">查看赛程</el-button>
                  </div>
                </el-carousel-item>
                <el-carousel-item>
                  <div class="carousel-slide">
                    <h3>参与我们的活动</h3>
                    <p>报名参加线下聚会和线上活动</p>
                    <el-button type="primary" @click="handleSlideButtonClick('attend')">立即报名</el-button>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </section>
          
          <!-- 功能区域 -->
          <section class="features">
            <div class="container">
              <h2>我们的功能</h2>
              <div class="features-grid">
              <!-- 交流功能 -->
              <el-card class="feature-card" shadow="hover">
                <template #header>
                  <div class="card-header">
                    <h3>实时交流</h3>
                  </div>
                </template>
                <p>与队友实时聊天，讨论战术，分享游戏体验</p>
                <el-button type="primary" @click="handlePageChange('chat')">开始聊天</el-button>
              </el-card>
              
              <!-- 比赛功能 -->
              <el-card class="feature-card" shadow="hover">
                <template #header>
                  <div class="card-header">
                    <h3>比赛信息</h3>
                  </div>
                </template>
                <p>查看团队比赛安排，赛事结果和排名，参与队内比赛</p>
                <el-button type="primary" @click="handlePageChange('match')">查看比赛</el-button>
              </el-card>
              
              <!-- 个人中心 -->
              <el-card class="feature-card" shadow="hover">
                <template #header>
                  <div class="card-header">
                    <h3>个人中心</h3>
                  </div>
                </template>
                <p>管理你的个人资料，查看游戏统计，设置偏好</p>
                <el-button type="primary" @click="handlePageChange('profile')">进入中心</el-button>
              </el-card>
            </div>
            </div>
          </section>
        </div>

        <!-- 交流页面 -->
        <div v-else-if="currentPage === 'chat'">
          <section class="page-section chat-section">
            <div class="container">
              <Chat />
            </div>
          </section>
        </div>

        <!-- 比赛页面 -->
        <div v-else-if="currentPage === 'match'">
          <Match />
        </div>

        

        <!-- 个人页面 -->
        <div v-else-if="currentPage === 'profile'">
          <Profile />
        </div>
      </main>

      <!-- 页脚 -->
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-links">
              <a href="#">关于我们</a>
              <a href="#">隐私政策</a>
              <a href="#">使用条款</a>
            </div>
            <div class="footer-copyright">
              <p>&copy; 2024 PUBG Spark Squad. 保留所有权利。</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 导航栏 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
  /* 适配刘海屏 */
  padding-top: var(--safe-area-inset-top);
  min-height: 60px;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1d1d1f;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: #0071e3;
  text-decoration: none;
}

.nav-links a.active {
  color: #0071e3;
  font-weight: 600;
}

.logout-button {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1d1d1f;
  background: none;
  border: none;
  padding: 0;
  margin-left: 2rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.logout-button:hover {
  color: #0071e3;
  background: none;
}

@media (max-width: 768px) {
  .logout-button {
    margin-left: 0;
    margin-top: 1rem;
  }
}



/* 页面内容 */
.page-content {
  flex: 1;
}

/* 轮播图 */
.hero-carousel {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0 0;
  margin: 80px 0;
}

.carousel-slide {
  text-align: center;
  padding: 4rem 2rem;
  color: #1d1d1f;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: #f5f5f7;
  border-radius: 8px;
}

.hero-carousel .container {
  flex: 1;
  width: 100%;
}

.page-section {
  padding: 8rem 0;
  text-align: center;
}

.chat-section {
  background-color: #ffffff;
}

.page-section h1 {
  margin-bottom: 2rem;
}

/* 功能区域 */
.features {
  padding: 8rem 0;
}

.features h2 {
  text-align: center;
  margin-bottom: 4rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.feature-card {
  text-align: center;
  padding: 3rem 2rem;
  background-color: #f5f5f7;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  margin-bottom: 1rem;
}

.feature-card p {
  margin-bottom: 2rem;
}

.feature-link {
  font-size: 0.875rem;
  font-weight: 500;
}

/* 页脚 */
.footer {
  background-color: #f5f5f7;
  padding: 4rem 0 2rem;
  margin-top: auto;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.footer-links a {
  font-size: 0.875rem;
  color: #86868b;
}

.footer-links a:hover {
  color: #1d1d1f;
}

.footer-copyright {
  text-align: center;
  font-size: 0.75rem;
  color: #86868b;
}

/* 深色模式 */
.dark-mode {
  background-color: #121212;
  color: #ffffff;
}

.dark-mode .navbar {
  background-color: rgba(18, 18, 18, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dark-mode .logo h1 {
  color: #ffffff;
}

.dark-mode .el-menu {
  background-color: transparent;
}

.dark-mode .el-menu-item {
  color: #ffffff;
}

.dark-mode .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .el-menu-item.is-active {
  color: #0071e3;
}

.dark-mode .features {
  background: linear-gradient(135deg, #1a1a1a 0%, #121212 100%);
}

.dark-mode .features h2 {
  color: #ffffff;
}

.dark-mode .feature-card {
  background-color: #1a1a1a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark-mode .feature-card h3 {
  color: #ffffff;
}

.dark-mode .feature-card p {
  color: #e0e0e0;
}

.dark-mode .footer {
  background-color: #1a1a1a;
}

.dark-mode .footer-links a {
  color: #e0e0e0;
}

.dark-mode .footer-links a:hover {
  color: #ffffff;
}

.dark-mode .footer-copyright {
  color: #e0e0e0;
}

.dark-mode .page-section h1 {
  color: #ffffff;
}

.dark-mode .chat-section {
  background-color: #1a1a1a;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .nav-links {
    gap: 1rem;
  }
  
  .features {
    padding: 6rem 0;
  }
  
  .features-grid {
    gap: 2rem;
  }
  
  .footer-links {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
}
</style>
