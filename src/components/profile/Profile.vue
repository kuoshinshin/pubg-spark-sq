<script setup>
import { ref, onMounted } from 'vue'
import { userApi, shareApi } from '../../services/api'

// 用户数据
const userData = ref(null)

// 用户发布的帖子
const myPosts = ref(null)



// 用户的比赛数据
const myMatches = ref(null)

// 卡片顺序数组
const cardOrder = ref([
  'settings',
  'posts',
  'replies',
  'matches'
])

// 加载状态
const isLoading = ref(true)
const errorMessage = ref('')

const isEditing = ref(false)
const editedUserData = ref(null)

// 获取用户信息
const fetchUserData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    console.log('开始获取用户信息...')
    // 直接调用 request 方法，添加更多日志
    const response = await fetch('http://127.0.0.1:3000/api/user/info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log('获取用户信息响应状态:', response.status)
    console.log('获取用户信息响应头:', response.headers)
    
    const data = await response.json()
    console.log('获取用户信息响应数据:', data)
    
    if (!response.ok) {
      throw new Error(data.error || '获取用户信息失败')
    }
    
    // 确保 data 是一个对象
    if (typeof data === 'object' && data !== null) {
      // 设置用户数据
      userData.value = {
        ...data,
        preferences: {
          notifications: true,
          darkMode: data.dark_mode || false,
          language: 'zh-CN'
        }
      }
      editedUserData.value = { ...userData.value }
      console.log('更新后的 userData:', userData.value)
    } else {
      console.error('获取用户信息失败: 响应不是有效的对象', data)
      errorMessage.value = '获取用户信息失败: 响应格式错误'
      // 设置默认数据
      setDefaultUserData()
    }
  } catch (error) {
    errorMessage.value = error.message || '获取用户信息失败'
    console.error('获取用户信息失败:', error)
    console.error('错误堆栈:', error.stack)
    // 设置默认数据
    setDefaultUserData()
  } finally {
    isLoading.value = false
    console.log('获取用户信息完成，loading:', isLoading.value)
  }
}

// 设置默认用户数据
const setDefaultUserData = () => {
  userData.value = {
    id: '1',
    username: '默认用户',
    email: 'user@example.com',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=PUBG%20player%20avatar%2C%20minimalist%20design%2C%20cartoon%20style%2C%20professional%20gaming%20avatar&image_size=square',
    preferences: {
      notifications: true,
      darkMode: false,
      language: 'zh-CN'
    }
  }
  editedUserData.value = { ...userData.value }
}



// 获取用户帖子
const fetchUserPosts = async () => {
  try {
    if (!userData.value) {
      console.error('获取用户帖子失败: 用户数据未初始化')
      myPosts.value = []
      return
    }
    console.log('开始获取用户帖子，用户ID:', userData.value.id)
    // 从圈子帖子中获取数据
    const allPosts = await shareApi.getPosts()
    console.log('获取到的所有帖子:', allPosts)
    // 过滤出当前用户的帖子
    // 注意：后端返回的是user_id字段，不是user.id
    // 确保类型一致，使用Number()转换
    const userId = Number(userData.value.id)
    myPosts.value = allPosts.filter(post => Number(post.user_id) === userId)
    console.log('过滤后的用户帖子:', myPosts.value)
  } catch (error) {
    console.error('获取用户帖子失败:', error)
    myPosts.value = []
  }
}


// 获取用户的比赛数据
const fetchUserMatches = async () => {
  try {
    const response = await userApi.getUserMatches()
    myMatches.value = {
      stats: response.stats || {
        totalMatches: 0,
        totalKills: 0,
        totalWins: 0,
        kdRatio: 0,
        bestRank: 0
      },
      history: response.history || []
    }
  } catch (error) {
    console.error('获取用户比赛数据失败:', error)
    myMatches.value = {
      stats: {
        totalMatches: 0,
        totalKills: 0,
        totalWins: 0,
        kdRatio: 0,
        bestRank: 0
      },
      history: []
    }
  }
}

// 保存用户资料
const handleSave = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await userApi.updateProfile(editedUserData.value)
    // 后端返回的是 { message: '更新成功', user: userInfo } 格式
    if (response.user) {
      userData.value = {
        ...userData.value,
        ...response.user,
        preferences: userData.value.preferences,
        gameStats: userData.value.gameStats
      }
    }
    isEditing.value = false
    alert('个人资料更新成功！')
  } catch (error) {
    errorMessage.value = error.message || '更新个人资料失败'
    console.error('更新个人资料失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 取消编辑
const handleCancel = () => {
  editedUserData.value = { ...userData.value }
  isEditing.value = false
}

// 切换点赞状态
const toggleLike = async (postId) => {
  try {
    const post = myPosts.value.find(p => p.id === postId)
    if (post) {
      post.isLiked = !post.isLiked
      post.likes += post.isLiked ? 1 : -1
    }
  } catch (error) {
    console.error('点赞失败:', error)
  }
}

// 切换深色模式
const toggleDarkMode = () => {
  const currentDarkMode = userData.preferences.darkMode
  const newDarkMode = !currentDarkMode
  
  userData.preferences.darkMode = newDarkMode
  
  // 保存到本地存储
  localStorage.setItem('darkMode', newDarkMode)
  
  // 应用深色模式样式
  if (newDarkMode) {
    document.documentElement.classList.add('dark-mode')
  } else {
    document.documentElement.classList.remove('dark-mode')
  }
}

// 处理头像点击
const fileInput = ref(null)

const handleAvatarClick = () => {
  // 触发文件输入框的点击事件
  fileInput.value.click()
}

// 处理头像上传
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    // 创建FormData对象
    const formData = new FormData()
    formData.append('avatar', file)
    
    // 这里应该调用后端API上传头像
    // 暂时使用模拟数据
    console.log('上传头像:', file)
    
    // 模拟上传成功，更新头像URL
    const reader = new FileReader()
    reader.onload = (e) => {
      userData.value.avatar = e.target.result
      editedUserData.value.avatar = e.target.result
    }
    reader.readAsDataURL(file)
    
    alert('头像更新成功！')
  } catch (error) {
    console.error('上传头像失败:', error)
    alert('上传头像失败，请重试')
  } finally {
    // 重置文件输入框
    event.target.value = ''
  }
}



// 日期格式化函数
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  
  const now = new Date()
  const diffTime = now - date
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  // 格式化时间，使用12小时制，上午/下午
  const timeStr = date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
  
  if (diffDays === 0) {
    // 今天，显示时间
    return timeStr
  } else if (diffDays === 1) {
    // 昨天，显示 "昨天 时间"
    return `昨天 ${timeStr}`
  } else {
    // 比昨天更早，显示完整日期和时间
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
}

// 跳转到圈子对应内容
const navigateToCircle = (postId) => {
  // 获取当前页面的基础URL
  const baseUrl = window.location.origin + window.location.pathname
  // 打开新窗口，使用hash参数指定帖子ID，跳转到圈子页面
  // 确保URL包含#post-格式的hash，这样App.vue会正确处理
  window.open(`${baseUrl}#post-${postId}`, '_blank')
}

// 生命周期钩子
onMounted(async () => {
  // 先获取用户信息，确保userData.value.id被正确设置
  await fetchUserData()
  // 然后获取帖子和比赛数据
  fetchUserPosts()
  fetchUserMatches()
})
</script>

<template>
  <div class="profile-container">
    <div class="container">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-container">
        <el-loading :fullscreen="true" text="加载中..." />
      </div>
      
      <!-- 错误提示 -->
      <div v-else-if="errorMessage" class="error-container">
        <el-alert
          :title="errorMessage"
          type="error"
          show-icon
          :closable="false"
        />
      </div>
      
      <!-- 左右布局内容 -->
      <div v-else-if="userData" class="profile-layout">
        <!-- 左侧栏 - 个人信息和设置 -->
        <div class="left-sidebar">
          <!-- 个人信息区域 -->
          <div class="profile-section profile-info-section">
            <el-card shadow="hover" class="profile-info-card">
              <div class="profile-info">
                <div class="avatar" @click="handleAvatarClick">
                  <el-avatar :src="userData.avatar" size="large"></el-avatar>
                  <div class="avatar-edit">
                    <span>更换头像</span>
                  </div>
                  <input
                    type="file"
                    ref="fileInput"
                    class="avatar-upload-input"
                    accept="image/*"
                    @change="handleAvatarUpload"
                    style="display: none;"
                  />
                </div>
                
                <div class="user-details" v-if="!isEditing">
                  <h2>{{ userData.username }}</h2>
                  <p class="user-account">账号: {{ userData.account }}</p>
                  <p class="user-email">{{ userData.email }}</p>
                  <div class="user-actions">
                    <el-button type="primary" @click="isEditing = true">编辑资料</el-button>
                  </div>
                </div>
                
                <div class="user-edit" v-else>
                  <el-form @submit.prevent="handleSave" label-position="top">
                    <el-form-item label="账号">
                      <el-input v-model="editedUserData.account" disabled />
                    </el-form-item>
                    <el-form-item label="昵称" required>
                      <el-input v-model="editedUserData.username" required />
                    </el-form-item>
                    <el-form-item label="邮箱">
                      <el-input v-model="editedUserData.email" type="email" />
                    </el-form-item>
                    <el-form-item>
                      <el-button @click="handleCancel" type="default">取消</el-button>
                      <el-button type="primary" native-type="submit">保存</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-card>
          </div>
          
          <!-- 设置选项卡片 -->
          <div class="profile-section">
            <el-card shadow="hover" class="module-card">
              <div class="card-header">
                <h3>设置</h3>
              </div>
              <div class="settings-list">
                <div class="setting-item">
                  <span class="setting-label">通知</span>
                  <el-switch v-model="userData.preferences.notifications" />
                </div>
                <div class="setting-item">
                  <span class="setting-label">深色模式</span>
                  <el-switch v-model="userData.preferences.darkMode" @change="toggleDarkMode" />
                </div>
                <div class="setting-item">
                  <span class="setting-label">语言</span>
                  <el-select v-model="userData.preferences.language" style="width: 120px">
                    <el-option value="zh-CN">简体中文</el-option>
                    <el-option value="en-US">English</el-option>
                  </el-select>
                </div>
              </div>
            </el-card>
          </div>
        </div>
        
        <!-- 右侧栏 - 其他卡片 -->
        <div class="right-content">

          
          <!-- 我的动态卡片 -->
          <div class="profile-section">
            <el-card shadow="hover" class="module-card">
              <div class="card-header">
                <h3>我的动态</h3>
              </div>
              <div class="my-posts-list">
                <el-empty v-if="!myPosts || myPosts.length === 0" description="你还没有发布过动态" />
                <el-card v-for="post in myPosts" :key="post.id" shadow="hover" class="post-card" @click="navigateToCircle(post.id)">
                  <div class="post-content">
                    <p>{{ post.content }}</p>
                    <el-image v-if="post.media" :src="post.media" :alt="post.content" fit="cover" class="post-media"></el-image>
                  </div>
                  <div class="post-meta">
                    <span class="post-time">{{ formatDate(post.created_at) }}</span>
                    <div class="post-stats">
                      <el-button type="default" disabled size="small">
                        <!-- 红色爱心图标，只要帖子有点赞就显示 -->
                        <svg width="16" height="16" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 901.746939c-13.583673 0-26.122449-4.179592-37.093878-13.061225-8.881633-7.314286-225.697959-175.020408-312.424489-311.379592C133.746939 532.37551 94.040816 471.24898 94.040816 384.522449c0-144.718367 108.146939-262.269388 240.326531-262.269388 67.395918 0 131.657143 30.82449 177.632653 84.636735 45.453061-54.334694 109.191837-84.636735 177.110204-84.636735 132.702041 0 240.326531 117.55102 240.326531 262.269388 0 85.159184-37.093878 143.673469-67.395919 191.216327l-1.044898 1.567346c-86.726531 136.359184-303.542857 304.587755-312.424489 311.379592-10.44898 8.359184-22.987755 13.061224-36.571429 13.061225z" fill="#E5404F"></path></svg>
                        {{ post.likes }}
                      </el-button>
                      <el-button type="default" disabled size="small">
                        <!-- 聊天气泡图标 -->
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        {{ post.comments.length }}
                      </el-button>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-card>
          </div>
          

          <!-- 我的比赛卡片 -->
          <div class="profile-section">
            <el-card shadow="hover" class="module-card">
              <div class="card-header">
                <h3>我的比赛</h3>
              </div>
              <div class="my-matches-list">
                <!-- 比赛统计 -->
                <div class="matches-stats">
                  <div class="stats-grid">
                    <el-card v-for="(stat, index) in [
                      { value: myMatches && myMatches.stats ? myMatches.stats.totalMatches : 0, label: '总场次' },
                      { value: myMatches && myMatches.stats ? myMatches.stats.totalWins : 0, label: '获胜场次' },
                      { value: myMatches && myMatches.stats ? myMatches.stats.totalKills : 0, label: '总击杀' },
                      { value: myMatches && myMatches.stats ? myMatches.stats.kdRatio : 0, label: 'KD比率' },
                      { value: myMatches && myMatches.stats ? myMatches.stats.bestRank : 0, label: '最佳排名' }
                    ]" :key="index" shadow="hover" class="stat-card">
                      <div class="stat-item">
                        <span class="stat-value">{{ stat.value }}</span>
                        <span class="stat-label">{{ stat.label }}</span>
                      </div>
                    </el-card>
                  </div>
                </div>
                <!-- 比赛历史 -->
                <div class="matches-history" v-if="myMatches && myMatches.history && myMatches.history.length > 0">
                  <h4>比赛历史</h4>
                  <div class="matches-grid">
                    <el-card v-for="match in myMatches.history" :key="match.id" shadow="hover" class="match-card">
                      <div class="match-info">
                        <h5>{{ match.title }}</h5>
                        <p class="match-time">{{ match.time }}</p>
                        <p class="match-result" :class="match.result === 'win' ? 'win' : 'lose'">
                          {{ match.result === 'win' ? '胜利' : '失败' }}
                        </p>
                        <p class="match-details">击杀: {{ match.kills }} | 排名: {{ match.rank }}</p>
                      </div>
                    </el-card>
                  </div>
                </div>
                <el-empty v-else description="暂无比赛历史" />
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 苹果风格极简设计 */
.profile-container {
  padding: 8rem 0 3rem;
  min-height: 100vh;
  background-color: #f5f5f7;
  position: relative;
}

.profile-container h2 {
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 2rem;
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: -0.01em;
}

/* 左右布局 */
.profile-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

/* 左侧栏 */
.left-sidebar {
  width: 350px;
  flex-shrink: 0;
}

/* 右侧内容 */
.right-content {
  flex: 1;
  min-width: 0;
}

.profile-section {
  margin-bottom: 2rem;
  padding: 0;
  background-color: transparent;
  border-radius: 0;
}

.profile-section h3 {
  margin-bottom: 1.25rem;
  font-size: 1.25rem;
  font-weight: 500;
  color: #1d1d1f;
  letter-spacing: 0.01em;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 12px;
}



.avatar {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  border-radius: 50%;
  border: 2px solid #f0f0f0;
}

.avatar:hover {
  transform: scale(1.03);
  border-color: #0071e3;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-edit {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  padding: 0.5rem 1rem;
  text-align: center;
  font-size: 0.75rem;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
}

.avatar:hover .avatar-edit {
  opacity: 1;
}

.user-details {
  text-align: center;
  width: 100%;
}

.user-details h2 {
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: -0.01em;
}

.user-account {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  color: #86868b;
  letter-spacing: 0.01em;
}

.user-email {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: #86868b;
  letter-spacing: 0.01em;
}

.user-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  align-items: center;
}

.user-edit {
  width: 100%;
  max-width: 300px;
  text-align: center;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .profile-layout {
    flex-direction: column;
  }
  
  .left-sidebar {
    width: 100%;
  }
  
  .profile-info {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1.25rem;
  }
  
  .avatar {
    width: 70px;
    height: 70px;
  }
  
  .avatar-edit {
    bottom: -20px;
  }
  
  .avatar:hover .avatar-edit {
    bottom: -25px;
  }
  
  .user-details h2 {
    font-size: 1.125rem;
  }
  
  .user-actions {
    justify-content: center;
  }
}

/* 深色模式优化 */
.dark-mode .profile-info {
  background-color: #1a1a1a;
}



.dark-mode .avatar {
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .avatar:hover {
  border-color: #0071e3;
}

.dark-mode .user-details h2 {
  color: #ffffff;
}

.dark-mode .user-account {
  color: #e0e0e0;
}

.dark-mode .user-email {
  color: #e0e0e0;
}

/* 个人信息区域 */
.profile-info-section {
  margin-bottom: 3rem;
}

/* 模块卡片样式 */
.module-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
  color: #1d1d1f;
  letter-spacing: 0.01em;
}

/* 统计网格样式 - 适用于比赛统计 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.stat-card {
  background-color: #ffffff;
  border: none;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-item {
  text-align: center;
  padding: 1.25rem;
  background-color: transparent;
  border-radius: 12px;
  box-shadow: none;
}

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 0.375rem;
  letter-spacing: -0.01em;
}

.stat-label {
  font-size: 0.875rem;
  color: #86868b;
  letter-spacing: 0.01em;
  line-height: 1.4;
}



/* 深色模式卡片样式 */
.dark-mode .card-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .card-header h3 {
  color: #ffffff;
}

/* 深色模式统计样式 */
.dark-mode .stat-card {
  background-color: #1a1a1a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.dark-mode .stat-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark-mode .stat-value {
  color: #ffffff;
}

.dark-mode .stat-label {
  color: #e0e0e0;
}

/* 设置选项 - 苹果风格 */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background-color: transparent;
  border-radius: 0;
  box-shadow: none;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item:hover {
  background-color: #f5f5f7;
}

.setting-label {
  font-size: 1rem;
  color: #1d1d1f;
  letter-spacing: 0.01em;
}

.setting-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: #0071e3;
}

.setting-item select {
  padding: 0.5rem 1rem;
  border: 1px solid #d2d2d7;
  border-radius: 8px;
  font-size: 0.875rem;
  background-color: #f5f5f7;
  color: #1d1d1f;
  letter-spacing: 0.01em;
  transition: border-color 0.2s ease;
}

.setting-item select:focus {
  outline: none;
  border-color: #0071e3;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
}

.el-switch {
  --el-switch-on-color: #0071e3;
  --el-switch-off-color: #d2d2d7;
  --el-switch-on-text-color: #ffffff;
  --el-switch-off-text-color: #ffffff;
  --el-switch-width: 51px;
  --el-switch-height: 27px;
}

.el-select {
  --el-select-border-color: #d2d2d7;
  --el-select-hover-border-color: #0071e3;
  --el-select-focus-border-color: #0071e3;
  --el-select-dropdown-bg-color: #ffffff;
  --el-select-dropdown-border-color: #f0f0f0;
  --el-select-dropdown-item-hover-bg-color: #f5f5f7;
  --el-select-dropdown-item-selected-bg-color: #f0f8ff;
  --el-select-dropdown-item-selected-color: #0071e3;
}

/* 我的动态样式 - 苹果风格 */
.my-posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.post-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.post-content {
  margin-bottom: 1rem;
}

.post-content p {
  margin: 0 0 1rem 0;
  line-height: 1.5;
  color: #1d1d1f;
  font-size: 1rem;
  letter-spacing: 0.01em;
}

.post-media {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  max-height: 300px;
  transition: transform 0.3s ease;
}

.post-media:hover {
  transform: scale(1.01);
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.post-time {
  font-size: 0.875rem;
  color: #86868b;
  letter-spacing: 0.01em;
}

.post-stats {
  display: flex;
  gap: 1.5rem;
}

.el-button--small {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  border-radius: 980px;
  display: flex;
  align-items: center;
}

.el-button--small svg {
  margin-right: 0.5rem;
}



/* 空状态样式 - 苹果风格 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  color: #86868b;
  font-size: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.01em;
  line-height: 1.5;
}

.el-empty {
  --el-empty-color: #86868b;
  --el-empty-font-size: 1rem;
  --el-empty-line-height: 1.5;
}

/* 深色模式 - 苹果风格 */
.dark-mode .profile-container {
  background-color: #121212;
  color: #ffffff;
}

.dark-mode .profile-container h2 {
  color: #ffffff;
}

.dark-mode .profile-section {
  background-color: transparent;
}

.dark-mode .profile-section h3 {
  color: #ffffff;
}

.dark-mode .profile-info {
  background-color: #1a1a1a;
}

.dark-mode .profile-info:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark-mode .user-details h2 {
  color: #ffffff;
}

.dark-mode .user-email {
  color: #e0e0e0;
}

.dark-mode .el-card {
  background-color: #1a1a1a;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.dark-mode .el-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}



.dark-mode .settings-list {
  background-color: #1a1a1a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.dark-mode .setting-item {
  background-color: transparent;
  box-shadow: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dark-mode .setting-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.dark-mode .setting-label {
  color: #ffffff;
}

.dark-mode .post-card {
  background-color: #1a1a1a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.dark-mode .post-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  transform: translateY(-4px);
}

.dark-mode .post-content p {
  color: #ffffff;
}

.dark-mode .post-time {
  color: #e0e0e0;
}

.dark-mode .post-meta {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.dark-mode .reply-card {
  background-color: #1a1a1a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.dark-mode .reply-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark-mode .user-name {
  color: #ffffff;
}

.dark-mode .reply-time {
  color: #e0e0e0;
}

.dark-mode .post-preview {
  color: #e0e0e0;
}

.dark-mode .reply-text {
  color: #ffffff;
}

.dark-mode .empty-state {
  background-color: #1a1a1a;
  color: #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.dark-mode .el-empty {
  --el-empty-color: #e0e0e0;
}

.dark-mode .el-input__wrapper {
  background-color: #1a1a1a;
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .el-input__inner {
  color: #ffffff;
}

.dark-mode .el-button {
  background-color: #0071e3;
  color: #ffffff;
}

.dark-mode .el-button:hover {
  background-color: #0077ed;
}

.dark-mode .el-button--default {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.dark-mode .el-button--default:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.dark-mode .el-switch {
  --el-switch-on-color: #0071e3;
  --el-switch-off-color: #3a3a3a;
}

.dark-mode .el-select {
  --el-select-border-color: rgba(255, 255, 255, 0.1);
  --el-select-hover-border-color: #0071e3;
  --el-select-focus-border-color: #0071e3;
  --el-select-dropdown-bg-color: #1a1a1a;
  --el-select-dropdown-border-color: rgba(255, 255, 255, 0.1);
  --el-select-dropdown-item-hover-bg-color: rgba(255, 255, 255, 0.05);
  --el-select-dropdown-item-selected-bg-color: rgba(0, 113, 227, 0.2);
  --el-select-dropdown-item-selected-color: #0071e3;
}



/* 我的比赛样式 - 苹果风格 */
.my-matches-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.matches-history h4 {
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #1d1d1f;
  letter-spacing: 0.01em;
}

.matches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.match-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.match-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.match-info h5 {
  margin: 0 0 0.75rem 0;
  font-size: 1.125rem;
  font-weight: 500;
  color: #1d1d1f;
  letter-spacing: 0.01em;
}

.match-time {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: #86868b;
  letter-spacing: 0.01em;
}

.match-result {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.match-result.win {
  color: #388e3c;
}

.match-result.lose {
  color: #d32f2f;
}

.match-details {
  margin: 0;
  font-size: 0.875rem;
  color: #86868b;
  letter-spacing: 0.01em;
}



.dark-mode .matches-history h4 {
  color: #ffffff;
}

.dark-mode .match-card {
  background-color: #1a1a1a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.dark-mode .match-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark-mode .match-info h5 {
  color: #ffffff;
}

.dark-mode .match-time {
  color: #e0e0e0;
}

.dark-mode .match-result.win {
  color: #4caf50;
}

.dark-mode .match-result.lose {
  color: #f44336;
}

.dark-mode .match-details {
  color: #e0e0e0;
}

/* 响应式设计 - 苹果风格 */
@media (max-width: 768px) {
  .profile-container {
    padding: 3rem 0 2rem;
  }
  
  .profile-container h2 {
    font-size: 1.75rem;
  }
  
  .profile-info {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 1.75rem;
  }
  
  .avatar {
    width: 90px;
    height: 90px;
  }
  
  .user-details h2 {
    font-size: 1.375rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .stat-item {
    padding: 1rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .setting-item {
    padding: 1.125rem 1.25rem;
  }
  
  .setting-item {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
  
  .setting-item input[type="checkbox"] {
    align-self: center;
  }
  
  .setting-item select {
    width: auto;
    margin-top: 0;
  }
  
  .post-card,
  .reply-card,
  .match-card {
    padding: 1.25rem;
  }
  
  .post-stats {
    gap: 1rem;
  }
  
  .el-button--small {
    padding: 0.4375rem 0.875rem;
    font-size: 0.75rem;
  }
  
  .matches-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .profile-container {
    padding: 2.5rem 0 1.5rem;
  }
  
  .profile-container h2 {
    font-size: 1.5rem;
  }
  
  .profile-info {
    padding: 1.5rem;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
  }
  
  .user-details h2 {
    font-size: 1.25rem;
  }
  
  .user-email {
    font-size: 0.9375rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-item {
    padding: 1rem;
  }
  
  .setting-item {
    padding: 1rem;
  }
  
  .post-card,
  .reply-card,
  .match-card {
    padding: 1.125rem;
  }
}
</style>