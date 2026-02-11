// API 服务

// 基础 API URL
const API_BASE_URL = 'http://127.0.0.1:3000/api';

// 缓存配置
const CACHE_CONFIG = {
  enabled: true,
  defaultExpiry: 5 * 60 * 1000, // 默认缓存5分钟
  maxSize: 100 // 最大缓存条目数
};

// 缓存存储
const cache = new Map();

// 生成缓存键
function generateCacheKey(endpoint, options = {}) {
  const { method = 'GET', body } = options;
  if (method !== 'GET') return null; // 只缓存GET请求
  
  const url = `${API_BASE_URL}${endpoint}`;
  const bodyStr = body ? JSON.stringify(body) : '';
  return `${url}_${bodyStr}`;
}

// 获取缓存数据
function getCachedData(key) {
  if (!CACHE_CONFIG.enabled) return null;
  
  const cached = cache.get(key);
  if (!cached) return null;
  
  // 检查缓存是否过期
  if (Date.now() > cached.expiry) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

// 设置缓存数据
function setCachedData(key, data, expiry = CACHE_CONFIG.defaultExpiry) {
  if (!CACHE_CONFIG.enabled || !key) return;
  
  // 如果缓存达到最大容量，删除最旧的条目
  if (cache.size >= CACHE_CONFIG.maxSize) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
  
  cache.set(key, {
    data,
    expiry: Date.now() + expiry
  });
}

// 清除缓存
function clearCache() {
  cache.clear();
}

// 清除特定缓存
function clearCacheKey(key) {
  cache.delete(key);
}

// 通用请求方法
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // 生成缓存键
  const cacheKey = generateCacheKey(endpoint, options);
  
  // 检查缓存
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log('使用缓存数据:', endpoint);
    return cachedData;
  }
  
  // 获取认证token
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, mergedOptions);
    const data = await response.json();
    
    if (!response.ok) {
      // 检查是否是token失效或未授权错误
      if (response.status === 401 || response.status === 403) {
        // 清除本地存储的登录状态和token
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        // 跳转到登录页面
        window.location.hash = 'login';
        // 强制页面刷新
        window.location.reload();
        throw new Error('登录已过期，请重新登录');
      }
      throw new Error(data.error || '请求失败');
    }
    
    // 缓存GET请求的响应
    if (cacheKey) {
      setCachedData(cacheKey, data);
    }
    
    return data;
  } catch (error) {
    console.error('API 请求错误:', error);
    // 抛出更准确的错误信息
    throw error;
  }
}

// 认证相关 API
export const authApi = {
  // 用户注册
  register: async (userData) => {
    // 实际 API 调用
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // 模拟注册成功
    // console.log('注册请求:', userData);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve({ success: true, message: '注册成功' });
    //   }, 1000);
    // });
  },
  
  // 用户登录
  login: async (credentials) => {
    // 实际 API 调用
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // 存储认证token
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
    
    // 模拟登录成功
    // console.log('登录请求:', credentials);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     const mockResponse = {
    //       success: true,
    //       token: 'mock-token-123',
    //       user: {
    //         id: 1,
    //         username: credentials.username,
    //         email: credentials.email,
    //       },
    //     };
    //     // 存储认证token
    //     localStorage.setItem('auth_token', mockResponse.token);
    //     resolve(mockResponse);
    //   }, 1000);
    // });
  },
};



// 聊天相关 API
export const chatApi = {
  // 获取聊天消息
  getMessages: async () => {
    // 实际 API 调用
    return request('/chat/all');
  },
  
  // 发送消息
  sendMessage: async (messageData) => {
    // 实际 API 调用
    return request('/chat/send', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
  
  // 点赞帖子
  likePost: async (postId) => {
    // 实际 API 调用
    return request('/chat/like', {
      method: 'POST',
      body: JSON.stringify({ postId }),
    });
  },
  
  // 取消点赞帖子
  unlikePost: async (postId) => {
    // 实际 API 调用
    return request('/chat/unlike', {
      method: 'POST',
      body: JSON.stringify({ postId }),
    });
  },
  
  // 检查帖子点赞状态
  checkLike: async (postId) => {
    // 实际 API 调用
    return request(`/chat/check-like?postId=${postId}`);
  },
  
  // 分享帖子
  sharePost: async (postId) => {
    // 实际 API 调用
    return request('/share/create', {
      method: 'POST',
      body: JSON.stringify({ postId }),
    });
  },
  
  // 删除帖子
  deletePost: async (postId) => {
    // 实际 API 调用
    return request(`/chat/${postId}`, {
      method: 'DELETE',
    });
  },
  
  // 添加评论
  addComment: async (postId, content) => {
    // 实际 API 调用
    return request('/chat/comment', {
      method: 'POST',
      body: JSON.stringify({ postId, content }),
    });
  },
  
  // 回复评论
  replyToComment: async (postId, commentId, content) => {
    // 实际 API 调用
    return request('/chat/reply', {
      method: 'POST',
      body: JSON.stringify({ postId, commentId, content }),
    });
  },
  
  // 点赞评论
  likeComment: async (commentId) => {
    // 实际 API 调用
    return request('/chat/comment/like', {
      method: 'POST',
      body: JSON.stringify({ commentId }),
    });
  },
  
  // 取消点赞评论
  unlikeComment: async (commentId) => {
    // 实际 API 调用
    return request('/chat/comment/unlike', {
      method: 'POST',
      body: JSON.stringify({ commentId }),
    });
  },
  
  // 点踩评论
  dislikeComment: async (commentId) => {
    // 实际 API 调用
    return request('/chat/comment/dislike', {
      method: 'POST',
      body: JSON.stringify({ commentId }),
    });
  },
  
  // 取消点踩评论
  undislikeComment: async (commentId) => {
    // 实际 API 调用
    return request('/chat/comment/undislike', {
      method: 'POST',
      body: JSON.stringify({ commentId }),
    });
  },
};

// 比赛相关 API
export const matchApi = {
  // 获取比赛列表
  getMatches: async () => {
    // 实际 API 调用
    return request('/match/all');
  },
  
  // 获取即将开始的比赛
  getUpcomingMatches: async () => {
    // 实际 API 调用
    return request('/match/status/upcoming');
  },
  
  // 获取正在进行的比赛
  getOngoingMatches: async () => {
    // 实际 API 调用
    return request('/match/status/ongoing');
  },
  
  // 获取已完成的比赛
  getCompletedMatches: async () => {
    // 实际 API 调用
    return request('/match/status/completed');
  },
  
  // 获取赛季数据（Match.vue 使用）
  getSeasonData: async (seasonId) => {
    // 实际 API 调用
    return request(`/match/season/${seasonId}`);
  },
  

  
  // 获取规则数据（Match.vue 使用）
  getRulesData: async () => {
    // 实际 API 调用
    return request('/match/rules');
  },
  
  // 获取个人比赛数据（Match.vue 使用）
  getPersonalData: async () => {
    // 实际 API 调用
    return request('/match/personal');
  },
  
  // 更新选手名称（Match.vue 使用）
  updatePlayerName: async (teamId, playerId, name) => {
    // 实际 API 调用
    return request('/match/player/update', {
      method: 'PUT',
      body: JSON.stringify({ teamId, playerId, name }),
    });
  },
  
  // 获取选手卡数据（Match.vue 使用）
  getPlayerCardData: async () => {
    // 实际 API 调用
    return request('/match/player-card');
  },
  
  // 保存选手卡数据（Match.vue 使用）
  savePlayerCardData: async (playerCardData) => {
    // 实际 API 调用
    return request('/match/player-card', {
      method: 'POST',
      body: JSON.stringify(playerCardData),
    });
  },
  

};

// 用户相关 API
export const userApi = {
  // 获取用户信息
  getUserInfo: async () => {
    // 实际 API 调用
    return request('/user/info');
  },
  
  // 获取当前用户信息（Profile.vue 使用）
  getCurrentUser: async () => {
    // 实际 API 调用
    return request('/user/info');
  },
  
  // 获取用户统计信息（Profile.vue 使用）
  getStats: async () => {
    // 实际 API 调用
    return request('/user/stats');
  },
  
  // 获取用户帖子（Profile.vue 使用）
  getUserPosts: async () => {
    // 实际 API 调用
    return request('/user/posts');
  },
  
  // 获取用户收到的回复（Profile.vue 使用）
  getUserReplies: async () => {
    // 实际 API 调用
    return request('/user/replies');
  },
  
  // 切换点赞状态（Profile.vue 使用）
  toggleLike: async (postId) => {
    // 实际 API 调用
    return request('/user/like', {
      method: 'POST',
      body: JSON.stringify({ postId }),
    });
  },
  
  // 更新用户资料（Profile.vue 使用）
  updateProfile: async (userData) => {
    // 实际 API 调用
    return request('/user/info', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  // 更新用户深色模式设置
  updateDarkMode: async (darkMode) => {
    // 实际 API 调用
    return request('/user/dark-mode', {
      method: 'PUT',
      body: JSON.stringify({ darkMode }),
    });
  },
  
  // 获取用户列表
  getUserList: async (params) => {
    // 构建查询字符串
    const queryString = new URLSearchParams(params).toString();
    // 实际 API 调用
    return request(`/user/all?${queryString}`);
  },
  

  
  // 获取用户比赛数据（Profile.vue 使用）
  getUserMatches: async () => {
    // 实际 API 调用
    return request('/user/matches');
  },
};

// 分享相关 API
export const shareApi = {
  // 获取帖子列表（Share.vue 使用）
  getPosts: async () => {
    // 实际 API 调用
    return request('/share/all');
  },
  
  // 创建新帖子（Share.vue 使用）
  createPost: async (postData) => {
    // 实际 API 调用
    return request('/share/create', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },
  
  // 点赞帖子（Share.vue 使用）
  likePost: async (postId) => {
    // 实际 API 调用
    return request('/share/like', {
      method: 'POST',
      body: JSON.stringify({ postId }),
    });
  },
};
