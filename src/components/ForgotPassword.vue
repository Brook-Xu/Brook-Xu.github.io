<template>
  <div class="forgot-password-container">
    <div class="forgot-password-card">
      <h2 class="forgot-password-title">{{ $t('auth.forgotPassword.title') }}</h2>
      
      <!-- 第一步：请求重置码 -->
      <div v-if="step === 1" class="forgot-password-step">
        <p class="step-indicator">{{ $t('auth.forgotPassword.step1') }}</p>
        
        <form @submit.prevent="handleRequestCode" class="forgot-password-form">
          <div class="form-group">
            <label for="email">{{ $t('auth.forgotPassword.email') }}</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              :placeholder="$t('auth.forgotPassword.email')"
              required
              class="form-input"
              :class="{ 'error': errors.email }"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <div v-if="errorMessage" class="error-alert">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="success-alert">
            {{ successMessage }}
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading">{{ $t('common.loading') }}</span>
            <span v-else>{{ $t('auth.forgotPassword.requestCode') }}</span>
          </button>
        </form>
      </div>

      <!-- 第二步：重置密码 -->
      <div v-if="step === 2" class="forgot-password-step">
        <p class="step-indicator">{{ $t('auth.forgotPassword.step2') }}</p>
        <p class="step-hint">{{ $t('auth.forgotPassword.codeSent') }}</p>
        
        <form @submit.prevent="handleReset" class="forgot-password-form">
          <div class="form-group">
            <label for="code">{{ $t('auth.forgotPassword.code') }}</label>
            <input
              id="code"
              v-model="form.code"
              type="text"
              :placeholder="$t('auth.forgotPassword.code')"
              required
              maxlength="6"
              class="form-input code-input"
              :class="{ 'error': errors.code }"
            />
            <span v-if="errors.code" class="error-message">{{ errors.code }}</span>
          </div>

          <div class="form-group">
            <label for="newPassword">{{ $t('auth.forgotPassword.newPassword') }}</label>
            <input
              id="newPassword"
              v-model="form.newPassword"
              type="password"
              :placeholder="$t('auth.forgotPassword.newPassword')"
              required
              class="form-input"
              :class="{ 'error': errors.newPassword }"
            />
            <span v-if="errors.newPassword" class="error-message">{{ errors.newPassword }}</span>
          </div>

          <div class="form-group">
            <label for="confirmPassword">{{ $t('auth.forgotPassword.confirmPassword') }}</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              :placeholder="$t('auth.forgotPassword.confirmPassword')"
              required
              class="form-input"
              :class="{ 'error': errors.confirmPassword }"
            />
            <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          </div>

          <div v-if="errorMessage" class="error-alert">
            {{ errorMessage }}
          </div>

          <div class="button-group">
            <button type="button" @click="step = 1" class="back-btn">
              {{ $t('common.back') }}
            </button>
            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="loading">{{ $t('common.loading') }}</span>
              <span v-else>{{ $t('auth.forgotPassword.reset') }}</span>
            </button>
          </div>
        </form>
      </div>

      <div class="forgot-password-footer">
        <a href="#" @click.prevent="goToLogin" class="link">
          {{ $t('auth.forgotPassword.backToLogin') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { forgotPassword, resetPassword } from '../services/authApi';

export default {
  name: 'ForgotPassword',
  data() {
    return {
      step: 1,
      form: {
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
      },
      errors: {},
      errorMessage: '',
      successMessage: '',
      loading: false
    };
  },
  methods: {
    async handleRequestCode() {
      this.errors = {};
      this.errorMessage = '';
      this.successMessage = '';
      
      if (!this.form.email) {
        this.errors.email = this.$t('auth.forgotPassword.emailRequired');
        return;
      }
      
      this.loading = true;
      
      try {
        await forgotPassword(this.form.email);
        this.successMessage = this.$t('auth.forgotPassword.codeSent');
        this.step = 2;
      } catch (error) {
        console.error('Forgot password error:', error);
        const errorMsg = error.message || this.$t('auth.forgotPassword.error');
        
        if (errorMsg.includes('not found')) {
          this.errorMessage = this.$t('auth.forgotPassword.emailNotFound');
        } else {
          this.errorMessage = errorMsg;
        }
      } finally {
        this.loading = false;
      }
    },
    
    async handleReset() {
      this.errors = {};
      this.errorMessage = '';
      this.successMessage = '';
      
      if (!this.form.code) {
        this.errors.code = this.$t('auth.forgotPassword.codeRequired');
        return;
      }
      
      if (this.form.code.length !== 6) {
        this.errors.code = 'Verification code must be 6 digits';
        return;
      }
      
      if (!this.form.newPassword) {
        this.errors.newPassword = this.$t('auth.forgotPassword.passwordRequired');
        return;
      }
      
      if (this.form.newPassword.length < 6) {
        this.errors.newPassword = 'Password must be at least 6 characters';
        return;
      }
      
      if (this.form.newPassword !== this.form.confirmPassword) {
        this.errors.confirmPassword = this.$t('auth.forgotPassword.passwordMismatch');
        return;
      }
      
      this.loading = true;
      
      try {
        await resetPassword(this.form.email, this.form.code, this.form.newPassword);
        this.successMessage = this.$t('auth.forgotPassword.success');
        
        // 延迟跳转到登录页面
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      } catch (error) {
        console.error('Reset password error:', error);
        const errorMsg = error.message || this.$t('auth.forgotPassword.error');
        
        if (errorMsg.includes('expired') || errorMsg.includes('not found') || errorMsg.includes('invalid')) {
          this.errorMessage = this.$t('auth.forgotPassword.codeExpired');
        } else {
          this.errorMessage = errorMsg;
        }
      } finally {
        this.loading = false;
      }
    },
    
    goToLogin() {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.forgot-password-container {
  min-height: calc(100vh - 50px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%);
  margin-top: 50px;
}

.forgot-password-card {
  background: rgba(27, 38, 59, 0.9);
  border: 1px solid rgba(255, 192, 0, 0.3);
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.forgot-password-title {
  color: #FFC000;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: 600;
}

.step-indicator {
  color: #FFC000;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.step-hint {
  color: #aaa;
  text-align: center;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.forgot-password-form {
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

.code-input {
  text-align: center;
  font-size: 1.5rem;
  letter-spacing: 0.5rem;
  font-weight: 600;
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

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.submit-btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  background: #FFC000;
  color: #222;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
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

.back-btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  background: transparent;
  color: #FFC000;
  border: 1px solid #FFC000;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 192, 0, 0.1);
}

.forgot-password-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.forgot-password-footer .link {
  color: #FFC000;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password-footer .link:hover {
  color: #FFD700;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .forgot-password-container {
    padding: 1rem;
  }

  .forgot-password-card {
    padding: 2rem 1.5rem;
  }

  .forgot-password-title {
    font-size: 1.75rem;
  }
}
</style>

