// 认证API服务
// 配置后端API基础URL
// webpack DefinePlugin 会在构建时将 process.env.VUE_APP_API_BASE_URL 替换为实际值
// 如果未定义，使用默认值
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api/auth';

/**
 * 发送API请求
 */
async function request(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * 注册请求 - 发送验证码
 */
export async function registerRequest(email, password) {
  return request('/register/request', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

/**
 * 验证注册码
 */
export async function registerVerify(email, code) {
  return request('/register/verify', {
    method: 'POST',
    body: JSON.stringify({ email, code })
  });
}

/**
 * 用户登录
 */
export async function login(email, password) {
  const data = await request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  // 保存token到localStorage
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  
  return data;
}

/**
 * 用户登出
 */
export async function logout() {
  try {
    await request('/logout', {
      method: 'POST'
    });
  } catch (error) {
    // 即使API调用失败，也清除本地token
    console.error('Logout API error:', error);
  } finally {
    // 清除本地token
    localStorage.removeItem('token');
  }
}

/**
 * 忘记密码 - 请求重置验证码
 */
export async function forgotPassword(email) {
  return request('/password/forgot', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

/**
 * 重置密码
 */
export async function resetPassword(email, code, newPassword) {
  return request('/password/reset', {
    method: 'POST',
    body: JSON.stringify({ email, code, newPassword })
  });
}

/**
 * 修改密码（需要登录）
 */
export async function changePassword(oldPassword, newPassword) {
  return request('/password', {
    method: 'PUT',
    body: JSON.stringify({ oldPassword, newPassword })
  });
}

