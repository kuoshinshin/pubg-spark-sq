<script setup>
import { ref, onMounted } from 'vue'

// 报名表单数据
const formData = ref({
  name: '',
  phone: '',
  peopleCount: 1
})

// 报名状态
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const errorMessage = ref('')

// 报名列表数据
const registrationList = ref([])

// 往期活动数据
const pastEvents = ref([
  {
    id: 1,
    title: '星火计划首次线下聚会',
    date: '2024-01-15',
    location: '上海某餐厅',
    description: '第一次线下聚会，大家一起吃饭、聊天、开黑，度过了愉快的一天',
    attendees: 12,
    image: 'https://picsum.photos/seed/event1/800/450'
  },
  {
    id: 2,
    title: '春节线上开黑活动',
    date: '2024-02-10',
    location: '线上',
    description: '春节期间，我们组织了线上开黑活动，大家一起玩游戏，互送祝福',
    attendees: 20,
    image: 'https://picsum.photos/seed/event2/800/450'
  },
  {
    id: 3,
    title: '春季户外团建',
    date: '2024-03-20',
    location: '杭州西湖',
    description: '春天来了，我们组织了西湖徒步活动，欣赏美景，增进感情',
    attendees: 15,
    image: 'https://picsum.photos/seed/event3/800/450'
  }
])

// 表单验证
const validateForm = () => {
  if (!formData.value.name.trim()) {
    errorMessage.value = '请输入姓名'
    return false
  }
  if (!formData.value.phone.trim()) {
    errorMessage.value = '请输入电话'
    return false
  }
  if (!/^1[3-9]\d{9}$/.test(formData.value.phone)) {
    errorMessage.value = '请输入正确的手机号'
    return false
  }
  if (formData.value.peopleCount < 1 || formData.value.peopleCount > 10) {
    errorMessage.value = '参与人数应在1-10之间'
    return false
  }
  errorMessage.value = ''
  return true
}

// 提交报名
const submitForm = () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  // 模拟提交延迟
  setTimeout(() => {
    // 添加到报名列表
    registrationList.value.push({
      id: Date.now(),
      ...formData.value,
      timestamp: new Date().toLocaleString()
    })
    
    // 重置表单
    formData.value = {
      name: '',
      phone: '',
      peopleCount: 1
    }
    
    submitSuccess.value = true
    isSubmitting.value = false
    
    // 5秒后自动隐藏成功提示
    setTimeout(() => {
      submitSuccess.value = false
    }, 5000)
  }, 1000)
}

// 组件挂载
onMounted(() => {
  // 初始化数据
  // 这里可以从本地存储或API加载数据
  const savedRegistrations = localStorage.getItem('eventRegistrations')
  if (savedRegistrations) {
    registrationList.value = JSON.parse(savedRegistrations)
  }
})

// 监听报名列表变化，保存到本地存储
const saveRegistrations = () => {
  localStorage.setItem('eventRegistrations', JSON.stringify(registrationList.value))
}
// 监听列表变化
registrationList.value = new Proxy(registrationList.value, {
  set(target, key, value) {
    target[key] = value
    saveRegistrations()
    return true
  }
})
</script>

<template>
  <div class="event-container">
    <div class="container">
      <!-- 页面标题 -->
      <div class="event-header">
        <h1>活动安排</h1>
        <p>参与我们的线下活动，与队友面对面交流，增进感情</p>
      </div>

      <!-- 报名表单 -->
      <section class="registration-section">
        <div class="section-card">
          <h2>最新活动报名</h2>
          <p class="section-subtitle">我们将不定时举办线下聚餐或出行活动，欢迎报名参加</p>
          
          <!-- 成功提示 -->
          <div v-if="submitSuccess" class="success-message">
            <span>报名成功！</span>
          </div>
          
          <!-- 错误提示 -->
          <div v-if="errorMessage" class="error-message">
            <span>{{ errorMessage }}</span>
          </div>
          
          <form @submit.prevent="submitForm" class="registration-form">
            <div class="form-group">
              <label for="name">姓名</label>
              <input 
                type="text" 
                id="name" 
                v-model="formData.name" 
                placeholder="请输入您的姓名"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="phone">电话</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="formData.phone" 
                placeholder="请输入您的手机号"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="peopleCount">参与人数</label>
              <input 
                type="number" 
                id="peopleCount" 
                v-model="formData.peopleCount" 
                min="1" 
                max="10"
                required
              />
            </div>
            
            <button 
              type="submit" 
              class="submit-button"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? '提交中...' : '立即报名' }}
            </button>
          </form>
        </div>
      </section>

      <!-- 报名信息列表 -->
      <section class="registrations-list-section">
        <div class="section-card">
          <h2>报名信息</h2>
          <p class="section-subtitle">当前已有 {{ registrationList.length }} 人报名</p>
          
          <div v-if="registrationList.length === 0" class="empty-state">
            <p>暂无报名信息</p>
          </div>
          
          <ul v-else class="registrations-list">
            <li v-for="registration in registrationList" :key="registration.id" class="registration-item">
              <div class="registration-info">
                <div class="registration-name">{{ registration.name }}</div>
                <div class="registration-details">
                  <span>电话: {{ registration.phone }}</span>
                  <span>人数: {{ registration.peopleCount }}人</span>
                  <span>报名时间: {{ registration.timestamp }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- 往期活动 -->
      <section class="past-events-section">
        <h2>往期活动</h2>
        <div class="past-events-grid">
          <div v-for="event in pastEvents" :key="event.id" class="past-event-card">
            <div class="event-image">
              <img :src="event.image" :alt="event.title" />
            </div>
            <div class="event-content">
              <h3>{{ event.title }}</h3>
              <div class="event-meta">
                <span class="event-date">{{ event.date }}</span>
                <span class="event-location">{{ event.location }}</span>
                <span class="event-attendees">{{ event.attendees }}人参与</span>
              </div>
              <p class="event-description">{{ event.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.event-container {
  min-height: 100vh;
  padding: 8rem 0 4rem;
  background: linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%);
}

.event-header {
  text-align: center;
  margin-bottom: 4rem;
}

.event-header h1 {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1d1d1f;
}

.event-header p {
  font-size: 1.125rem;
  color: #86868b;
  max-width: 600px;
  margin: 0 auto;
}

.section-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-bottom: 3rem;
}

.registration-section h2,
.registrations-list-section h2,
.past-events-section h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1d1d1f;
}

.section-subtitle {
  font-size: 1rem;
  color: #86868b;
  margin-bottom: 2rem;
}

/* 成功和错误提示 */
.success-message {
  background-color: #4cd964;
  color: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  animation: fadeIn 0.3s ease;
}

.error-message {
  background-color: #ff3b30;
  color: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  animation: fadeIn 0.3s ease;
}

/* 报名表单 */
.registration-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1d1d1f;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 1px solid #d2d2d7;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #0071e3;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #0071e3;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.submit-button:hover:not(:disabled) {
  background-color: #0077ed;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3);
}

.submit-button:disabled {
  background-color: #c7c7cc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 报名信息列表 */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #86868b;
  background-color: #f5f5f7;
  border-radius: 8px;
}

.registrations-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.registration-item {
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s ease;
}

.registration-item:last-child {
  border-bottom: none;
}

.registration-item:hover {
  background-color: #f9f9f9;
  border-radius: 8px;
}

.registration-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 0.5rem;
}

.registration-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: #86868b;
}

/* 往期活动 */
.past-events-section {
  margin-top: 4rem;
}

.past-events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.past-event-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.past-event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.event-image {
  height: 200px;
  overflow: hidden;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.past-event-card:hover .event-image img {
  transform: scale(1.05);
}

.event-content {
  padding: 1.5rem;
}

.event-content h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1d1d1f;
}

.event-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: #86868b;
}

.event-date,
.event-location,
.event-attendees {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.event-description {
  font-size: 0.875rem;
  color: #1d1d1f;
  line-height: 1.5;
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .event-container {
    padding: 6rem 0 2rem;
  }
  
  .event-header h1 {
    font-size: 2rem;
  }
  
  .section-card {
    padding: 1.5rem;
  }
  
  .registration-details {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .past-events-grid {
    grid-template-columns: 1fr;
  }
  
  .event-image {
    height: 180px;
  }
}
</style>