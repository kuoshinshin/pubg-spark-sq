<script setup>
import { ref } from 'vue'

// 模拟分享帖子数据
const posts = ref([
  {
    id: 1,
    title: '今天的吃鸡之旅',
    content: '今天和队友一起开黑，连续吃了两把鸡，感觉状态非常好！特别是最后一把，我用98K远距离爆头，简直帅呆了。',
    image: 'https://picsum.photos/seed/pubg3/800/450',
    author: '队友1',
    avatar: 'https://picsum.photos/seed/user2/200/200',
    timestamp: '今天 18:30',
    likes: 12,
    comments: 3
  },
  {
    id: 2,
    title: '新赛季开始了',
    content: '新赛季开始了，大家都什么段位了？我目前铂金，目标是这个赛季上钻石！',
    image: 'https://picsum.photos/seed/pubg4/800/450',
    author: '队友2',
    avatar: 'https://picsum.photos/seed/user3/200/200',
    timestamp: '昨天 20:15',
    likes: 8,
    comments: 5
  },
  {
    id: 3,
    title: '分享一个有趣的bug',
    content: '今天遇到了一个非常有趣的bug，我竟然可以在天上飞！虽然知道这是bug，但还是玩得很开心，哈哈。',
    image: 'https://picsum.photos/seed/pubg5/800/450',
    author: '队友3',
    avatar: 'https://picsum.photos/seed/user4/200/200',
    timestamp: '2天前',
    likes: 15,
    comments: 8
  }
])

// 发布帖子的表单数据
const newPost = ref({
  title: '',
  content: '',
  image: ''
})

const isPosting = ref(false)
const showPostForm = ref(false)

// 发布新帖子
const handlePost = () => {
  if (!newPost.value.title.trim() || !newPost.value.content.trim()) {
    alert('标题和内容不能为空！')
    return
  }
  
  isPosting.value = true
  
  // 模拟发布请求
  setTimeout(() => {
    const post = {
      id: Date.now(),
      title: newPost.value.title.trim(),
      content: newPost.value.content.trim(),
      image: newPost.value.image || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=PUBG%20generic%20post%20minimal%20design&image_size=landscape_16_9',
      author: '我',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=PUBG%20player%20avatar%20minimal%20design&image_size=square',
      timestamp: '刚刚',
      likes: 0,
      comments: 0
    }
    
    posts.value.unshift(post)
    
    // 重置表单
    newPost.value = {
      title: '',
      content: '',
      image: ''
    }
    
    showPostForm.value = false
    isPosting.value = false
    
    alert('帖子发布成功！')
  }, 1000)
}

// 切换发布表单显示
const togglePostForm = () => {
  showPostForm.value = !showPostForm.value
}

// 点赞帖子
const handleLike = (postId) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.likes++
  }
}
</script>

<template>
  <div class="share-container">
    <div class="container">
      <div class="share-header">
        <h2>游戏分享</h2>
        <p>分享你的游戏瞬间和心得</p>
        <button class="post-button" @click="togglePostForm">
          {{ showPostForm ? '取消' : '发布帖子' }}
        </button>
      </div>
      
      <!-- 发布帖子表单 -->
      <div v-if="showPostForm" class="post-form">
        <h3>发布新帖子</h3>
        <form @submit.prevent="handlePost">
          <div class="form-group">
            <label for="post-title">标题</label>
            <input 
              type="text" 
              id="post-title" 
              v-model="newPost.title" 
              required 
              placeholder="请输入帖子标题"
            />
          </div>
          <div class="form-group">
            <label for="post-content">内容</label>
            <textarea 
              id="post-content" 
              v-model="newPost.content" 
              required 
              placeholder="请输入帖子内容"
              rows="4"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="post-image">图片URL（可选）</label>
            <input 
              type="text" 
              id="post-image" 
              v-model="newPost.image" 
              placeholder="请输入图片URL"
            />
          </div>
          <div class="form-actions">
            <button type="submit" :disabled="isPosting">
              {{ isPosting ? '发布中...' : '发布' }}
            </button>
            <button type="button" class="secondary" @click="togglePostForm" :disabled="isPosting">
              取消
            </button>
          </div>
        </form>
      </div>
      
      <!-- 帖子列表 -->
      <div class="posts-list">
        <div 
          v-for="post in posts" 
          :key="post.id" 
          class="post-item"
        >
          <div class="post-header">
            <div class="post-author">
              <img :src="post.avatar" :alt="post.author" class="author-avatar" />
              <div class="author-info">
                <span class="author-name">{{ post.author }}</span>
                <span class="post-time">{{ post.timestamp }}</span>
              </div>
            </div>
          </div>
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-content">{{ post.content }}</p>
          <div class="post-image" v-if="post.image">
            <img :src="post.image" :alt="post.title" />
          </div>
          <div class="post-actions">
            <button class="action-button" @click="handleLike(post.id)">
              <span class="action-icon">👍</span>
              <span class="action-text">{{ post.likes }}</span>
            </button>
            <button class="action-button">
              <span class="action-icon">💬</span>
              <span class="action-text">{{ post.comments }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.share-container {
  min-height: 100vh;
  padding: 8rem 0 4rem;
  background: linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%);
}

.share-header {
  text-align: center;
  margin-bottom: 3rem;
}

.share-header h2 {
  margin-bottom: 0.5rem;
}

.share-header p {
  margin-bottom: 2rem;
}

.post-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

/* 发布帖子表单 */
.post-form {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
}

.post-form h3 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1d1d1f;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d2d2d7;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0071e3;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.form-actions button {
  flex: 1;
  padding: 0.75rem;
}

.form-actions .secondary {
  background-color: #f5f5f7;
  color: #1d1d1f;
  border: 1px solid #d2d2d7;
}

.form-actions .secondary:hover {
  background-color: #ebebeb;
}

/* 帖子列表 */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.post-item {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.post-header {
  margin-bottom: 1.5rem;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #f5f5f7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.author-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1d1d1f;
}

.post-time {
  font-size: 0.75rem;
  color: #86868b;
}

.post-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1d1d1f;
}

.post-content {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: #86868b;
}

.post-image {
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-image img {
  width: 100%;
  height: auto;
  display: block;
}

.post-actions {
  display: flex;
  gap: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #86868b;
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0;
}

.action-button:hover {
  color: #0071e3;
  background: none;
}

.action-icon {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .share-header {
    text-align: center;
  }
  
  .share-header h2 {
    font-size: 2rem;
  }
  
  .post-form {
    padding: 1.5rem;
  }
  
  .post-item {
    padding: 1.5rem;
  }
  
  .post-title {
    font-size: 1.25rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .post-actions {
    justify-content: space-between;
  }
}
</style>