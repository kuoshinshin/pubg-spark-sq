<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Login from './components/auth/Login.vue'
import Chat from './components/chat/Chat.vue'
import Profile from './components/profile/Profile.vue'
import Match from './components/match/Match.vue'
import Event from './components/event/Event.vue'

// 登录状态管理
const isLoggedIn = ref(false)
const userData = ref(null)

// 页面状态管理
const currentPage = ref('home')

// 轮播功能
const currentSlide = ref(0)
const slideInterval = ref(null)
const isHovering = ref(false)

// 轮播数据
const slides = ref([
  {
    id: 1,
    type: 'text',
    title: 'PUBG Spark Squad',
    subtitle: 'for 星火計劃',
    content: '在这里，我们可以互相交流、分享游戏心得，一起享受PUBG的乐趣',
    buttons: [
      { text: '立即加入', action: 'join' },
      { text: '了解更多', action: 'learn', secondary: true }
    ]
  },
  {
    id: 2,
    type: 'promotion',
    title: '星火比赛',
    subtitle: '展现你的实力',
    content: '每个季度，我们将举办比赛，赢取荣誉',
    buttons: [
      { text: '查看赛程', action: 'schedule' },
      { text: '报名参加', action: 'register', secondary: true }
    ]
  },
  {
    id: 3,
    type: 'event',
    title: '线下聚会',
    subtitle: '与队友面对面交流',
    content: '不定期我们将举办线下聚会，一起吃饭、开黑，增进队友感情',
    buttons: [
      { text: '查看详情', action: 'details' },
      { text: '我要参加', action: 'attend', secondary: true }
    ]
  }
])

// 模拟已注册用户列表（实际应该从后台获取）
const registeredUsers = [
  { email: 'player1@example.com', password: 'password123' },
  { email: 'player2@example.com', password: 'password123' },
  { email: 'player3@example.com', password: 'password123' }
]

// 登录处理
const handleLogin = (email, password) => {
  // 验证用户是否在注册列表中
  const user = registeredUsers.find(u => u.email === email && u.password === password)
  if (user) {
    isLoggedIn.value = true
    // 为用户生成唯一的头像种子，基于邮箱
    const avatarSeed = email.split('@')[0]
    userData.value = {
      email,
      username: avatarSeed,
      avatar: `https://picsum.photos/seed/${avatarSeed}/200/200`
    }
    // 保存登录状态到本地存储
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userData', JSON.stringify(userData.value))
    return true
  }
  return false
}

// 退出登录
const handleLogout = () => {
  isLoggedIn.value = false
  userData.value = null
  // 清除本地存储
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('userData')
}

// 轮播控制
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
}

const goToSlide = (index) => {
  currentSlide.value = index
}

// 自动轮播
const startAutoSlide = () => {
  if (!isHovering.value) {
    slideInterval.value = setInterval(nextSlide, 5000)
  }
}

const stopAutoSlide = () => {
  if (slideInterval.value) {
    clearInterval(slideInterval.value)
    slideInterval.value = null
  }
}

// 鼠标悬停处理
const handleMouseEnter = () => {
  isHovering.value = true
  stopAutoSlide()
}

const handleMouseLeave = () => {
  isHovering.value = false
  startAutoSlide()
}

// 触摸手势支持
const touchStartX = ref(0)
const touchEndX = ref(0)

const handleTouchStart = (e) => {
  touchStartX.value = e.changedTouches[0].screenX
}

const handleTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  const swipeThreshold = 50
  if (touchEndX.value < touchStartX.value - swipeThreshold) {
    // 向左滑动，下一张
    nextSlide()
  } else if (touchEndX.value > touchStartX.value + swipeThreshold) {
    // 向右滑动，上一张
    prevSlide()
  }
}

// 处理页面切换
const handlePageChange = (page) => {
  currentPage.value = page
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

// 生命周期钩子
onMounted(() => {
  const savedLoginState = localStorage.getItem('isLoggedIn')
  const savedUserData = localStorage.getItem('userData')
  if (savedLoginState === 'true' && savedUserData) {
    isLoggedIn.value = true
    userData.value = JSON.parse(savedUserData)
  }
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>

<template>
  <div class="app">
    <!-- 登录页面 -->
    <Login v-if="!isLoggedIn" :on-login="handleLogin" />
    
    <!-- 主内容 -->
    <div v-else>
      <!-- 导航栏 -->
      <header class="navbar">
        <div class="container">
          <div class="navbar-content">
            <div class="logo">
              <h1>PUBG Spark Squad</h1>
            </div>
            <nav class="nav-links">
              <a href="#" @click.prevent="handlePageChange('home')" :class="{ 'active': currentPage === 'home' }">首页</a>
              <a href="#" @click.prevent="handlePageChange('chat')" :class="{ 'active': currentPage === 'chat' }">交流</a>
              <a href="#" @click.prevent="handlePageChange('match')" :class="{ 'active': currentPage === 'match' }">比赛</a>
              <a href="#" @click.prevent="handlePageChange('event')" :class="{ 'active': currentPage === 'event' }">活动</a>
              <a href="#" @click.prevent="handlePageChange('profile')" :class="{ 'active': currentPage === 'profile' }">个人</a>
              <button class="logout-button" @click="handleLogout">退出登录</button>
            </nav>
          </div>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="page-content">
        <!-- 首页 -->
        <div v-if="currentPage === 'home'">
          <!-- 轮播区域 -->
          <section class="hero-carousel" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
            <div class="carousel-container">
              <!-- 轮播内容 -->
              <div class="carousel-slides">
                <div 
                  v-for="(slide, index) in slides" 
                  :key="slide.id"
                  class="carousel-slide"
                  :class="{ 'active': currentSlide === index, 'prev': currentSlide === (index + 1) % slides.length, 'next': currentSlide === (index - 1 + slides.length) % slides.length }"
                >
                  <div class="container">
                    <h1>{{ slide.title }}</h1>
                    <h2>{{ slide.subtitle }}</h2>
                    <p>{{ slide.content }}</p>
                    <div class="hero-buttons">
                      <button 
                        v-for="(button, btnIndex) in slide.buttons" 
                        :key="btnIndex"
                        :class="{ 'secondary': button.secondary }"
                        @click="handleSlideButtonClick(button.action)"
                      >
                        {{ button.text }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 轮播控制 -->
              <div class="carousel-controls">
                <div class="carousel-indicators">
                  <button 
                    v-for="(slide, index) in slides" 
                    :key="slide.id"
                    class="carousel-indicator"
                    :class="{ 'active': currentSlide === index }"
                    @click="goToSlide(index)"
                    :aria-label="`切换到幻灯片 ${index + 1}`"
                  ></button>
                </div>
              </div>
            </div>
          </section>

          <!-- 功能区域 -->
          <section class="features">
            <div class="container">
              <h2>我们的功能</h2>
              <div class="features-grid">
              <!-- 交流功能 -->
              <div class="feature-card">
                <h3>实时交流</h3>
                <p>与队友实时聊天，讨论战术，分享游戏体验</p>
                <a href="#" @click.prevent="handlePageChange('chat')" class="feature-link">开始聊天</a>
              </div>
              
              <!-- 比赛功能 -->
              <div class="feature-card">
                <h3>比赛信息</h3>
                <p>查看团队比赛安排，赛事结果和排名，参与队内比赛</p>
                <a href="#" @click.prevent="handlePageChange('match')" class="feature-link">查看比赛</a>
              </div>
              
              <!-- 活动功能 -->
              <div class="feature-card">
                <h3>活动安排</h3>
                <p>了解团队活动计划，报名参加线下聚会和线上活动</p>
                <a href="#" @click.prevent="handlePageChange('event')" class="feature-link">查看活动</a>
              </div>
              
              <!-- 个人中心 -->
              <div class="feature-card">
                <h3>个人中心</h3>
                <p>管理你的个人资料，查看游戏统计，设置偏好</p>
                <a href="#" @click.prevent="handlePageChange('profile')" class="feature-link">进入中心</a>
              </div>
            </div>
            </div>
          </section>
        </div>

        <!-- 交流页面 -->
        <div v-else-if="currentPage === 'chat'">
          <section class="page-section">
            <div class="container">
              <h1>交流中心</h1>
              <Chat />
            </div>
          </section>
        </div>

        <!-- 比赛页面 -->
        <div v-else-if="currentPage === 'match'">
          <Match />
        </div>

        <!-- 活动页面 -->
        <div v-else-if="currentPage === 'event'">
          <Event />
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
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
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

/* 轮播区域 */
.hero-carousel {
  position: relative;
  padding: 12rem 0 10rem;
  text-align: center;
  background: linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%);
  overflow: hidden;
}

.carousel-container {
  position: relative;
}

.carousel-slides {
  position: relative;
  height: 400px; /* 设置固定高度，确保切换时布局稳定 */
  overflow: hidden;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  visibility: hidden;
  transform: translateX(100%);
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide.active {
  position: absolute;
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
}

.carousel-slide.prev {
  transform: translateX(-100%);
  opacity: 0;
}

.carousel-slide.next {
  transform: translateX(100%);
  opacity: 0;
}

.carousel-slide h1 {
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: fadeIn 0.8s ease forwards 0.2s;
}

.carousel-slide h2 {
  margin-bottom: 2.5rem;
  color: #86868b;
  opacity: 0;
  animation: fadeIn 0.8s ease forwards 0.4s;
}

.carousel-slide p {
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0;
  animation: fadeIn 0.8s ease forwards 0.6s;
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 按钮样式改进 */
.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  opacity: 0;
  animation: fadeIn 0.8s ease forwards 0.8s;
}

.hero-buttons button {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 980px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.01em;
  min-width: 140px;
}

.hero-buttons button:not(.secondary) {
  background-color: #1d1d1f;
  color: #ffffff;
}

.hero-buttons button:not(.secondary):hover {
  background-color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.hero-buttons .secondary {
  background-color: #ffffff;
  color: #1d1d1f;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.hero-buttons .secondary:hover {
  background-color: #f9f9f9;
  border-color: #d0d0d0;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* 轮播控制改进 */
.carousel-controls {
  position: relative;
  margin-top: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  opacity: 0;
  animation: fadeIn 0.8s ease forwards 1s;
}

.carousel-indicators {
  display: flex;
  gap: 1rem;
}

.carousel-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #e0e0e0; /* 未选中时显示灰色 */
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  padding: 0;
  box-sizing: border-box;
}

.carousel-indicator:hover {
  background-color: #d0d0d0;
  transform: scale(1.1);
}

.carousel-indicator.active {
  background-color: #1d1d1f; /* 选中时显示黑色 */
  transform: scale(1.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-carousel {
    padding: 10rem 0 8rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .hero-buttons button {
    width: 100%;
    max-width: 240px;
  }
  
  .carousel-controls {
    margin-top: 3rem;
  }
  
  .carousel-indicators {
    gap: 0.75rem;
  }
  
  .carousel-indicator {
    width: 8px;
    height: 8px;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .hero-buttons button:hover {
    transform: none;
    box-shadow: none;
  }
  
  .carousel-indicator:hover {
    transform: none;
  }
}

/* 页面内容 */
.page-content {
  flex: 1;
}

.page-section {
  padding: 8rem 0;
  text-align: center;
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
  
  .hero {
    padding: 8rem 0 6rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
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
