<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">{{ $t('auth.login.title') }}</h2>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">{{ $t('auth.login.email') }}</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            :placeholder="$t('auth.login.email')"
            required
            class="form-input"
            :class="{ 'error': errors.email }"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">{{ $t('auth.login.password') }}</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            :placeholder="$t('auth.login.password')"
            required
            class="form-input"
            :class="{ 'error': errors.password }"
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <div v-if="errorMessage" class="error-alert">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-alert">
          {{ successMessage }}
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="loading">{{ $t('common.loading') }}</span>
          <span v-else>{{ $t('auth.login.submit') }}</span>
        </button>
      </form>

      <div class="login-footer">
        <a href="#" @click.prevent="goToForgotPassword" class="link">
          {{ $t('auth.login.forgotPassword') }}
        </a>
        <span class="divider">|</span>
        <a href="#" @click.prevent="goToRegister" class="link">
          {{ $t('auth.login.register') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '../services/authApi';
import { setToken } from '../utils/auth';

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      errors: {},
      errorMessage: '',
      successMessage: '',
      loading: false
    };
  },
  methods: {
    async handleLogin() {
      // 重置错误信息
      this.errors = {};
      this.errorMessage = '';
      this.successMessage = '';

      // 验证表单
      if (!this.form.email) {
        this.errors.email = this.$t('auth.login.emailRequired');
        return;
      }
      if (!this.form.password) {
        this.errors.password = this.$t('auth.login.passwordRequired');
        return;
      }

      this.loading = true;

      try {
        const response = await login(this.form.email, this.form.password);
        
        if (response.token) {
          setToken(response.token);
          this.successMessage = this.$t('auth.login.success');
          
          // 延迟跳转，让用户看到成功消息
          setTimeout(() => {
            this.$router.push('/');
          }, 1000);
        }
      } catch (error) {
        console.error('Login error:', error);
        const errorMsg = error.message || this.$t('auth.login.error');
        
        if (errorMsg.includes('not verified')) {
          this.errorMessage = this.$t('auth.login.emailNotVerified');
        } else if (errorMsg.includes('invalid credentials') || errorMsg.includes('Invalid')) {
          this.errorMessage = this.$t('auth.login.invalidCredentials');
        } else {
          this.errorMessage = errorMsg;
        }
      } finally {
        this.loading = false;
      }
    },
    goToRegister() {
      this.$router.push('/register');
    },
    goToForgotPassword() {
      this.$router.push('/forgot-password');
    }
  }
};
</script>

<style scoped>
.login-container {
  min-height: calc(100vh - 50px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%);
  margin-top: 50px;
}

.login-card {
  background: rgba(27, 38, 59, 0.9);
  border: 1px solid rgba(255, 192, 0, 0.3);
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.login-title {
  color: #FFC000;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
}

.login-form {
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
  color: #eee;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 192, 0, 0.3);
  border-radius: 6px;
  background: rgba(13, 27, 42, 0.8);
  color: #eee;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #FFC000;
  box-shadow: 0 0 0 3px rgba(255, 192, 0, 0.1);
}

.form-input.error {
  border-color: #ff4444;
}

.error-message {
  color: #ff4444;
  font-size: 0.85rem;
}

.error-alert {
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid #ff4444;
  color: #ff4444;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

.success-alert {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid #4caf50;
  color: #4caf50;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

.submit-btn {
  padding: 0.875rem 1.5rem;
  background: #FFC000;
  color: #222;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: #FFD700;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 192, 0, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #aaa;
  font-size: 0.9rem;
}

.login-footer .link {
  color: #FFC000;
  text-decoration: none;
  transition: color 0.3s ease;
}

.login-footer .link:hover {
  color: #FFD700;
  text-decoration: underline;
}

.login-footer .divider {
  color: #666;
}

@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }

  .login-card {
    padding: 2rem 1.5rem;
  }

  .login-title {
    font-size: 1.75rem;
  }
}
</style>

