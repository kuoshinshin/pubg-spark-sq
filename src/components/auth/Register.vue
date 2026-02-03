<script setup>
import { ref } from 'vue'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert('两次输入的密码不一致！')
    return
  }
  
  isLoading.value = true
  // 模拟注册请求
  setTimeout(() => {
    console.log('注册请求:', { username: username.value, email: email.value, password: password.value })
    isLoading.value = false
    // 注册成功后的处理
    alert('注册成功！请登录')
  }, 1000)
}
</script>

<template>
  <div class="register-container">
    <div class="register-form">
      <h2>注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required 
            placeholder="请输入用户名"
          />
        </div>
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
        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required 
            placeholder="请再次输入密码"
          />
        </div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? '注册中...' : '注册' }}
        </button>
      </form>
      <div class="form-footer">
        <p>已有账号？<a href="#login">立即登录</a></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%);
}

.register-form {
  width: 100%;
  max-width: 400px;
  padding: 3rem 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.register-form h2 {
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1d1d1f;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d2d2d7;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #0071e3;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
}

button {
  width: 100%;
  margin-top: 1rem;
}

.form-footer {
  margin-top: 2rem;
  font-size: 0.875rem;
  color: #86868b;
}

.form-footer a {
  color: #0071e3;
  font-weight: 500;
}

@media (max-width: 768px) {
  .register-form {
    padding: 2rem 1.5rem;
  }
}
</style>