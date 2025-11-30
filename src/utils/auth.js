// 认证工具函数

/**
 * 获取存储的token
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * 设置token
 */
export function setToken(token) {
  localStorage.setItem('token', token);
}

/**
 * 移除token
 */
export function removeToken() {
  localStorage.removeItem('token');
}

/**
 * 检查是否已登录
 */
export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  
  // 简单检查token格式（JWT通常有三部分，用.分隔）
  const parts = token.split('.');
  if (parts.length !== 3) {
    removeToken();
    return false;
  }
  
  // 可以进一步验证token是否过期（需要解析JWT payload）
  try {
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      // Token已过期
      removeToken();
      return false;
    }
    return true;
  } catch (error) {
    // 解析失败，可能是无效token
    removeToken();
    return false;
  }
}

/**
 * 从token中获取用户信息
 */
export function getUserFromToken() {
  const token = getToken();
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return {
      id: payload.sub,
      email: payload.email
    };
  } catch (error) {
    return null;
  }
}

