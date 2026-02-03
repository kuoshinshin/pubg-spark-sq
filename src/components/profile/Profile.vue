<script setup>
import { ref } from 'vue'

// 模拟用户数据
const userData = ref({
  id: 1,
  username: 'PUBG_Player',
  email: 'player@example.com',
  avatar: 'https://picsum.photos/seed/user1/200/200',
  gameStats: {
    matches: 120,
    wins: 15,
    kills: 320,
    kdRatio: 2.8,
    bestRank: 'Top 1'
  },
  preferences: {
    notifications: true,
    darkMode: false,
    language: 'zh-CN'
  }
})

// 模拟用户发布的帖子
const myPosts = ref([
  {
    id: 2,
    content: '分享一个超级苟的点位，决赛圈必备！',
    media: 'https://picsum.photos/seed/pubg2/800/450',
    timestamp: '昨天',
    likes: 18,
    comments: 0,
    isMine: true
  },
  {
    id: 4,
    content: '今天的比赛真精彩，大家都发挥得很好！',
    timestamp: '3天前',
    likes: 32,
    comments: 5,
    isMine: true
  }
])

// 模拟收到的回复
const myReplies = ref([
  {
    id: 1,
    postId: 1,
    postContent: '今天吃鸡啦！决赛圈1v3，完美操作！',
    user: {
      id: 2,
      name: '队友1',
      avatar: 'https://picsum.photos/seed/user2/200/200'
    },
    content: '厉害啊！',
    timestamp: '1小时前'
  },
  {
    id: 3,
    postId: 3,
    postContent: '有人一起四排吗？今晚8点',
    user: {
      id: 4,
      name: '队友3',
      avatar: 'https://picsum.photos/seed/user4/200/200'
    },
    content: '好啊，我也来！',
    timestamp: '昨天'
  }
])

const isEditing = ref(false)
const editedUserData = ref({ ...userData.value })

const handleSave = () => {
  userData.value = { ...editedUserData.value }
  isEditing.value = false
  alert('个人资料更新成功！')
}

const handleCancel = () => {
  editedUserData.value = { ...userData.value }
  isEditing.value = false
}

// 切换点赞状态
const toggleLike = (postId) => {
  const post = myPosts.value.find(p => p.id === postId)
  if (post) {
    post.isLiked = !post.isLiked
    post.likes += post.isLiked ? 1 : -1
  }
}
</script>

<template>
  <div class="profile-container">
    <div class="container">
      <h2>个人中心</h2>
      
      <div class="profile-content">
        <!-- 个人信息 -->
        <div class="profile-section">
          <h3>个人信息</h3>
          <div class="profile-info">
            <div class="avatar">
              <img :src="userData.avatar" alt="用户头像" />
              <div class="avatar-edit">
                <span>更换头像</span>
              </div>
            </div>
            
            <div class="user-details" v-if="!isEditing">
              <h2>{{ userData.username }}</h2>
              <p class="user-email">{{ userData.email }}</p>
              <button class="edit-button" @click="isEditing = true">编辑资料</button>
            </div>
            
            <div class="user-edit" v-else>
              <div class="form-group">
                <label for="username">用户名</label>
                <input 
                  type="text" 
                  id="username" 
                  v-model="editedUserData.username" 
                  required
                />
              </div>
              <div class="form-group">
                <label for="email">邮箱</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="editedUserData.email" 
                  required
                />
              </div>
              <div class="edit-buttons">
                <button @click="handleCancel" class="secondary">取消</button>
                <button @click="handleSave">保存</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 游戏统计 -->
        <div class="profile-section">
          <h3>游戏统计</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value">{{ userData.gameStats.matches }}</span>
              <span class="stat-label">总场次</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ userData.gameStats.wins }}</span>
              <span class="stat-label">获胜场次</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ userData.gameStats.kills }}</span>
              <span class="stat-label">总击杀</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ userData.gameStats.kdRatio }}</span>
              <span class="stat-label">KD比率</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ userData.gameStats.bestRank }}</span>
              <span class="stat-label">最佳排名</span>
            </div>
          </div>
        </div>
        
        <!-- 我的帖子 -->
        <div class="profile-section">
          <h3>我的帖子</h3>
          <div class="my-posts-list">
            <div v-if="myPosts.length === 0" class="empty-state">
              <p>你还没有发布过帖子</p>
            </div>
            <div 
              v-for="post in myPosts" 
              :key="post.id" 
              class="post-card"
            >
              <div class="post-content">
                <p>{{ post.content }}</p>
                <img v-if="post.media" :src="post.media" :alt="post.content" class="post-media" />
              </div>
              <div class="post-meta">
                <span class="post-time">{{ post.timestamp }}</span>
                <div class="post-stats">
                  <span class="stat-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 19L9 16L14 13V19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M21 10.5C21 16.299 16.299 21 10.5 21C7.46243 21 4.86646 19.8157 3 17.4C3 17.4 5 16 5 12C5 8 3 6.6 3 6.6C3 6.6 4.86646 4.18429 7.90393 4.18429C9.64229 4.18429 11.3807 4.81571 12.75 6.15789C14.1193 4.81571 15.8577 4.18429 17.6 4.18429C20.6365 4.18429 21 6.6 21 6.6C21 6.6 19 8 19 12C19 16 21 17.4 21 17.4C21 17.4 22.9642 18.9849 23 18.9678C23 18.9507 21 16.299 21 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ post.likes }}
                  </span>
                  <span class="stat-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 6H3C2.46957 6 1.96086 6.21071 1.58579 6.58579C1.21071 6.96086 1 7.46957 1 8V16C1 16.5304 1.21071 17.0391 1.58579 17.4142C1.96086 17.7893 2.46957 18 3 18H21C21.5304 18 22.0391 17.7893 22.4142 17.4142C22.7893 17.0391 23 16.5304 23 16V8C23 7.46957 22.7893 6.96086 22.4142 6.58579C22.0391 6.21071 21.5304 6 21 6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8 10L12 14L16 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ post.comments }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 收到的回复 -->
        <div class="profile-section">
          <h3>收到的回复</h3>
          <div class="my-replies-list">
            <div v-if="myReplies.length === 0" class="empty-state">
              <p>暂无回复</p>
            </div>
            <div 
              v-for="reply in myReplies" 
              :key="reply.id" 
              class="reply-card"
            >
              <div class="reply-header">
                <div class="reply-user">
                  <img :src="reply.user.avatar" :alt="reply.user.name" class="user-avatar" />
                  <span class="user-name">{{ reply.user.name }}</span>
                </div>
                <span class="reply-time">{{ reply.timestamp }}</span>
              </div>
              <div class="reply-content">
                <p class="post-preview">{{ reply.postContent }}</p>
                <p class="reply-text">{{ reply.content }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 设置选项 -->
        <div class="profile-section">
          <h3>设置</h3>
          <div class="settings-list">
            <div class="setting-item">
              <span class="setting-label">通知</span>
              <input 
                type="checkbox" 
                v-model="userData.preferences.notifications"
              />
            </div>
            <div class="setting-item">
              <span class="setting-label">深色模式</span>
              <input 
                type="checkbox" 
                v-model="userData.preferences.darkMode"
              />
            </div>
            <div class="setting-item">
              <span class="setting-label">语言</span>
              <select v-model="userData.preferences.language">
                <option value="zh-CN">简体中文</option>
                <option value="en-US">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 8rem 0 4rem;
  min-height: 100vh;
}

.profile-container h2 {
  text-align: center;
  margin-bottom: 4rem;
}

.profile-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: #f5f5f7;
  border-radius: 12px;
}

.profile-section h3 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.avatar {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  padding: 0.5rem;
  text-align: center;
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar:hover .avatar-edit {
  opacity: 1;
}

.user-details {
  flex: 1;
}

.user-details h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
}

.user-email {
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
  color: #86868b;
}

.edit-button {
  padding: 0.75rem 1.5rem;
  background-color: #0071e3;
  color: #ffffff;
  border: none;
  border-radius: 980px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-button:hover {
  background-color: #0077ed;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3);
}

.user-edit {
  flex: 1;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1d1d1f;
}

.form-group input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
}

.form-group input:focus {
  outline: none;
  border-color: #0071e3;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
  background-color: #ffffff;
}

.edit-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
}

.edit-buttons button {
  padding: 0.875rem 1.75rem;
  border-radius: 980px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-buttons button:not(.secondary) {
  background-color: #0071e3;
  color: #ffffff;
  border: none;
}

.edit-buttons button:not(.secondary):hover {
  background-color: #0077ed;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3);
}

.edit-buttons .secondary {
  background-color: #f5f5f7;
  color: #1d1d1f;
  border: 1px solid #d2d2d7;
}

.edit-buttons .secondary:hover {
  background-color: #ebebeb;
  transform: translateY(-1px);
}

/* 游戏统计 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #86868b;
}

/* 设置选项 */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.setting-label {
  font-size: 1rem;
  color: #1d1d1f;
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
}

/* 我的帖子样式 */
.my-posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.post-content {
  margin-bottom: 1rem;
}

.post-content p {
  margin: 0 0 1rem 0;
  line-height: 1.5;
  color: #1d1d1f;
}

.post-media {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
  max-height: 300px;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.post-time {
  font-size: 0.875rem;
  color: #86868b;
}

.post-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #86868b;
}

/* 收到的回复样式 */
.my-replies-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.reply-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.reply-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.reply-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1d1d1f;
}

.reply-time {
  font-size: 0.75rem;
  color: #86868b;
}

.reply-content {
  margin-top: 0.5rem;
}

.post-preview {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: #86868b;
  line-height: 1.4;
}

.reply-text {
  margin: 0;
  font-size: 0.9375rem;
  color: #1d1d1f;
  line-height: 1.4;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  color: #86868b;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .setting-item input[type="checkbox"] {
    align-self: flex-end;
  }
  
  .setting-item select {
    width: 100%;
    margin-top: 0.5rem;
  }
  
  .post-card,
  .reply-card {
    padding: 1.25rem;
  }
  
  .post-stats {
    gap: 1rem;
  }
  
  .stat-item {
    font-size: 0.75rem;
  }
}

</style>