<script setup>
import { ref } from 'vue'

// 接收登录回调函数
const props = defineProps({
  onLogin: {
    type: Function,
    required: true
  }
})

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = () => {
  errorMessage.value = ''
  isLoading.value = true
  
  // 模拟登录请求延迟
  setTimeout(() => {
    // 调用父组件传递的登录函数
    const loginSuccess = props.onLogin(email.value, password.value)
    isLoading.value = false
    
    if (loginSuccess) {
      // 登录成功
      console.log('登录成功:', { email: email.value })
    } else {
      // 登录失败
      errorMessage.value = '邮箱或密码错误，请联系管理员获取账号'
      console.log('登录失败:', { email: email.value })
    }
  }, 1000)
}
</script>

<template>
  <div class="login-container">
    <div class="login-form">
      <!-- 系统标题 -->
      <div class="system-title">
        <h1>PUBG Spark Squad</h1>
        <p class="system-subtitle">星火計劃交流平台</p>
      </div>
      
      <h2>登录</h2>
      <p class="login-subtitle">请使用管理员提供的账号登录</p>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">邮箱</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="请输入邮箱地址"
          />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="请输入密码"
          />
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <button type="submit" :disabled="isLoading" class="login-button">
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>
      <div class="form-footer">
        <p>没有账号？请联系管理员添加</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #fafafa;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 4rem 2.5rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

/* 系统标题 */
.system-title {
  margin-bottom: 3rem;
}

.system-title h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.system-subtitle {
  font-size: 1rem;
  color: #86868b;
  font-weight: 400;
  letter-spacing: 0.01em;
}

.login-form h2 {
  margin-bottom: 0.75rem;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: -0.01em;
}

.login-subtitle {
  margin-bottom: 2.5rem;
  font-size: 0.9rem;
  color: #86868b;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 1.75rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1d1d1f;
  letter-spacing: 0.01em;
}

.form-group input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 400;
  color: #1d1d1f;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #1d1d1f;
  box-shadow: 0 0 0 3px rgba(29, 29, 31, 0.08);
  background-color: #ffffff;
}

.error-message {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #fef2f2;
  color: #dc2626;
  border-radius: 12px;
  font-size: 0.875rem;
  text-align: left;
  line-height: 1.5;
}

/* 登录按钮 - 黑白配色极简设计 */
.login-button {
  width: 100%;
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #1d1d1f;
  border: 1px solid #1d1d1f;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.01em;
}

.login-button:hover:not(:disabled) {
  background-color: #000000;
  border-color: #000000;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.login-button:disabled {
  background-color: #f5f5f5;
  color: #86868b;
  border-color: #e0e0e0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.form-footer {
  margin-top: 3rem;
  font-size: 0.875rem;
  color: #86868b;
  line-height: 1.5;
}

.form-footer a {
  color: #1d1d1f;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.form-footer a:hover {
  color: #000000;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    padding: 1.5rem;
  }
  
  .login-form {
    padding: 3rem 2rem;
  }
  
  .system-title h1 {
    font-size: 2rem;
  }
  
  .login-form h2 {
    font-size: 1.5rem;
  }
  
  .form-group input {
    padding: 0.875rem 1rem;
  }
  
  .login-button {
    padding: 0.875rem 1.25rem;
  }
}

@media (max-width: 480px) {
  .login-form {
    padding: 2.5rem 1.5rem;
  }
  
  .system-title h1 {
    font-size: 1.75rem;
  }
  
  .system-subtitle {
    font-size: 0.875rem;
  }
}
</style>