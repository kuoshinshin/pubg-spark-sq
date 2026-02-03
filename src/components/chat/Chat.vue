<script setup>
import { ref, onMounted } from 'vue'

// 模拟用户数据
const currentUser = ref({
  id: 1,
  name: '我',
  avatar: 'https://picsum.photos/seed/user1/200/200'
})

// 模拟帖子数据
const posts = ref([
  {
    id: 1,
    user: {
      id: 2,
      name: '队友1',
      avatar: 'https://picsum.photos/seed/user2/200/200'
    },
    content: '今天吃鸡啦！决赛圈1v3，完美操作！',
    media: 'https://picsum.photos/seed/chicken/800/450',
    timestamp: '2小时前',
    likes: 24,
    comments: [
      {
        id: 1,
        user: {
          id: 3,
          name: '队友2',
          avatar: 'https://picsum.photos/seed/user3/200/200'
        },
        content: '厉害啊！',
        timestamp: '1小时前'
      }
    ],
    isLiked: false,
    isMine: false
  },
  {
    id: 2,
    user: currentUser.value,
    content: '分享一个超级苟的点位，决赛圈必备！',
    media: 'https://picsum.photos/seed/pubg2/800/450',
    timestamp: '昨天',
    likes: 18,
    comments: [],
    isLiked: true,
    isMine: true
  },
  {
    id: 3,
    user: {
      id: 4,
      name: '队友3',
      avatar: 'https://picsum.photos/seed/user4/200/200'
    },
    content: '有人一起四排吗？今晚8点',
    timestamp: '昨天',
    likes: 12,
    comments: [
      {
        id: 2,
        user: currentUser.value,
        content: '我来！',
        timestamp: '昨天'
      }
    ],
    isLiked: false,
    isMine: false
  }
])

// 发布帖子相关
const showPostModal = ref(false)
const postContent = ref('')
const postMedia = ref('')
const isPosting = ref(false)

// 评论相关
const commentInputs = ref({})

// 打开发布帖子模态框
const openPostModal = () => {
  showPostModal.value = true
}

// 关闭发布帖子模态框
const closePostModal = () => {
  showPostModal.value = false
  postContent.value = ''
  postMedia.value = ''
}

// 发布帖子
const publishPost = () => {
  if (!postContent.value.trim()) return
  
  isPosting.value = true
  
  setTimeout(() => {
    const newPost = {
      id: Date.now(),
      user: currentUser.value,
      content: postContent.value.trim(),
      media: postMedia.value,
      timestamp: '刚刚',
      likes: 0,
      comments: [],
      isLiked: false,
      isMine: true
    }
    
    posts.value.unshift(newPost)
    closePostModal()
    isPosting.value = false
  }, 1000)
}

// 切换点赞状态
const toggleLike = (postId) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.isLiked = !post.isLiked
    post.likes += post.isLiked ? 1 : -1
  }
}

// 发表评论
const addComment = (postId) => {
  const post = posts.value.find(p => p.id === postId)
  const commentContent = commentInputs.value[postId]
  
  if (post && commentContent && commentContent.trim()) {
    const newComment = {
      id: Date.now(),
      user: currentUser.value,
      content: commentContent.trim(),
      timestamp: '刚刚'
    }
    
    post.comments.push(newComment)
    commentInputs.value[postId] = ''
  }
}

// 转发帖子（复制链接）
const sharePost = (postId) => {
  const url = `${window.location.origin}${window.location.pathname}#post-${postId}`
  navigator.clipboard.writeText(url).then(() => {
    alert('链接已复制到剪贴板！')
  })
}

// 组件挂载
onMounted(() => {
  // 初始化评论输入框
  posts.value.forEach(post => {
    commentInputs.value[post.id] = ''
  })
})
</script>

<template>
  <div class="feed-container">
    <div class="container">
      <!-- 页面头部 -->
      <div class="feed-header">
        <h1>游戏动态</h1>
        <p>分享你的游戏精彩瞬间</p>
      </div>
      
      <!-- 发布按钮 -->
      <div class="post-button-container">
        <button class="post-button" @click="openPostModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          发布动态
        </button>
      </div>
      
      <!-- 帖子列表 -->
      <div class="posts-list">
        <div 
          v-for="post in posts" 
          :key="post.id" 
          class="post-card"
        >
          <!-- 帖子头部 -->
          <div class="post-header">
            <div class="post-user">
              <img :src="post.user.avatar" :alt="post.user.name" class="user-avatar" />
              <div class="user-info">
                <h3>{{ post.user.name }}</h3>
                <span class="post-time">{{ post.timestamp }}</span>
              </div>
            </div>
          </div>
          
          <!-- 帖子内容 -->
          <div class="post-content">
            <p>{{ post.content }}</p>
            <img v-if="post.media" :src="post.media" :alt="post.content" class="post-media" />
          </div>
          
          <!-- 帖子操作 -->
          <div class="post-actions">
            <button 
              class="action-button" 
              :class="{ 'active': post.isLiked }"
              @click="toggleLike(post.id)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 19L9 16L14 13V19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 10.5C21 16.299 16.299 21 10.5 21C7.46243 21 4.86646 19.8157 3 17.4C3 17.4 5 16 5 12C5 8 3 6.6 3 6.6C3 6.6 4.86646 4.18429 7.90393 4.18429C9.64229 4.18429 11.3807 4.81571 12.75 6.15789C14.1193 4.81571 15.8577 4.18429 17.6 4.18429C20.6365 4.18429 21 6.6 21 6.6C21 6.6 19 8 19 12C19 16 21 17.4 21 17.4C21 17.4 22.9642 18.9849 23 18.9678C23 18.9507 21 16.299 21 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ post.likes }}</span>
            </button>
            
            <button class="action-button" @click="sharePost(post.id)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12H20M20 12L12 4M20 12L12 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>分享</span>
            </button>
          </div>
          
          <!-- 评论区 -->
          <div class="comments-section">
            <!-- 评论列表 -->
            <div class="comments-list">
              <div 
                v-for="comment in post.comments" 
                :key="comment.id" 
                class="comment-item"
              >
                <img :src="comment.user.avatar" :alt="comment.user.name" class="comment-avatar" />
                <div class="comment-body">
                  <div class="comment-header">
                    <span class="comment-user">{{ comment.user.name }}</span>
                    <span class="comment-time">{{ comment.timestamp }}</span>
                  </div>
                  <p class="comment-content">{{ comment.content }}</p>
                </div>
              </div>
            </div>
            
            <!-- 评论输入 -->
            <div class="comment-input">
              <input 
                type="text"
                :v-model="commentInputs[post.id]"
                :placeholder="'评论...'"
                @keyup.enter="addComment(post.id)"
              />
              <button 
                @click="addComment(post.id)"
                :disabled="!commentInputs[post.id] || !commentInputs[post.id].trim()"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 发布帖子模态框 -->
      <div v-if="showPostModal" class="modal-overlay" @click.self="closePostModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>发布动态</h2>
            <button class="close-button" @click="closePostModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <textarea 
              v-model="postContent"
              placeholder="分享你的游戏精彩瞬间..."
              rows="4"
            ></textarea>
            <input 
              type="text"
              v-model="postMedia"
              placeholder="输入图片URL（可选）"
            />
          </div>
          
          <div class="modal-footer">
            <button class="cancel-button" @click="closePostModal">
              取消
            </button>
            <button 
              class="publish-button" 
              @click="publishPost"
              :disabled="!postContent.trim() || isPosting"
            >
              {{ isPosting ? '发布中...' : '发布' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feed-container {
  min-height: 100vh;
  padding: 8rem 0 4rem;
  background: linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%);
}

.feed-header {
  text-align: center;
  margin-bottom: 3rem;
}

.feed-header h1 {
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
  font-weight: 600;
  color: #1d1d1f;
}

.feed-header p {
  margin: 0;
  color: #86868b;
  font-size: 1.125rem;
}

/* 发布按钮 */
.post-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
}

.post-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background-color: #0071e3;
  color: #ffffff;
  border: none;
  border-radius: 980px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.post-button:hover {
  background-color: #0077ed;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3);
}

/* 帖子列表 */
.posts-list {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 帖子卡片 */
.post-card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* 帖子头部 */
.post-header {
  margin-bottom: 1.5rem;
}

.post-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1d1d1f;
}

.post-time {
  font-size: 0.875rem;
  color: #86868b;
}

/* 帖子内容 */
.post-content {
  margin-bottom: 1.5rem;
}

.post-content p {
  margin: 0 0 1rem 0;
  line-height: 1.5;
  color: #1d1d1f;
}

.post-media {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  max-height: 400px;
}

/* 帖子操作 */
.post-actions {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
  transition: all 0.3s ease;
  padding: 0.5rem 0;
}

.action-button:hover {
  color: #0071e3;
  transform: scale(1.05);
}

.action-button.active {
  color: #ff3b30;
}

/* 评论区 */
.comments-section {
  margin-top: 1rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.comment-item {
  display: flex;
  gap: 0.75rem;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-body {
  flex: 1;
  background-color: #f5f5f7;
  border-radius: 16px;
  padding: 1rem;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.comment-user {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1d1d1f;
}

.comment-time {
  font-size: 0.75rem;
  color: #86868b;
}

.comment-content {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
  color: #1d1d1f;
}

/* 评论输入 */
.comment-input {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.comment-input input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d2d2d7;
  border-radius: 980px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.comment-input input:focus {
  outline: none;
  border-color: #0071e3;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
}

.comment-input button {
  padding: 0.75rem 1.5rem;
  background-color: #0071e3;
  color: #ffffff;
  border: none;
  border-radius: 980px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.comment-input button:hover:not(:disabled) {
  background-color: #0077ed;
}

.comment-input button:disabled {
  background-color: #d2d2d7;
  cursor: not-allowed;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
}

.close-button {
  background: none;
  border: none;
  color: #86868b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-button:hover {
  background-color: #f5f5f7;
  color: #1d1d1f;
}

.modal-body {
  margin-bottom: 2rem;
}

.modal-body textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: none;
  margin-bottom: 1rem;
  min-height: 120px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.modal-body textarea:focus {
  outline: none;
  border-color: #0071e3;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
}

.modal-body input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.modal-body input:focus {
  outline: none;
  border-color: #0071e3;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background-color: #f5f5f7;
  color: #1d1d1f;
  border: none;
  border-radius: 980px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cancel-button:hover {
  background-color: #e8e8ed;
}

.publish-button {
  padding: 0.75rem 1.5rem;
  background-color: #0071e3;
  color: #ffffff;
  border: none;
  border-radius: 980px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.publish-button:hover:not(:disabled) {
  background-color: #0077ed;
}

.publish-button:disabled {
  background-color: #d2d2d7;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .feed-container {
    padding: 6rem 0 2rem;
  }
  
  .feed-header h1 {
    font-size: 2rem;
  }
  
  .posts-list {
    padding: 0 1rem;
  }
  
  .post-card {
    padding: 1.25rem;
  }
  
  .post-button {
    padding: 0.875rem 1.5rem;
    font-size: 0.875rem;
  }
  
  .post-actions {
    gap: 1.5rem;
  }
  
  .modal-content {
    width: 95%;
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .modal-header h2 {
    font-size: 1.25rem;
  }
}
</style>