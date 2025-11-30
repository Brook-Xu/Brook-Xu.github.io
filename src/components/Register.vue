<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="register-title">{{ $t('auth.register.title') }}</h2>
      
      <!-- 第一步：填写信息 -->
      <div v-if="step === 1" class="register-step">
        <p class="step-indicator">{{ $t('auth.register.step1') }}</p>
        
        <form @submit.prevent="handleRequestCode" class="register-form">
          <div class="form-group">
            <label for="email">{{ $t('auth.register.email') }}</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              :placeholder="$t('auth.register.email')"
              required
              class="form-input"
              :class="{ 'error': errors.email }"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="password">{{ $t('auth.register.password') }}</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              :placeholder="$t('auth.register.password')"
              required
              class="form-input"
              :class="{ 'error': errors.password }"
            />
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <div class="form-group">
            <label for="confirmPassword">{{ $t('auth.register.confirmPassword') }}</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              :placeholder="$t('auth.register.confirmPassword')"
              required
              class="form-input"
              :class="{ 'error': errors.confirmPassword }"
            />
            <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          </div>

          <div v-if="errorMessage" class="error-alert">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="success-alert">
            {{ successMessage }}
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading">{{ $t('common.loading') }}</span>
            <span v-else>{{ $t('auth.register.requestCode') }}</span>
          </button>
        </form>
      </div>

      <!-- 第二步：验证邮箱 -->
      <div v-if="step === 2" class="register-step">
        <p class="step-indicator">{{ $t('auth.register.step2') }}</p>
        <p class="step-hint">{{ $t('auth.register.codeSent') }}</p>
        
        <form @submit.prevent="handleVerify" class="register-form">
          <div class="form-group">
            <label for="code">{{ $t('auth.register.verificationCode') }}</label>
            <input
              id="code"
              v-model="form.code"
              type="text"
              :placeholder="$t('auth.register.verificationCode')"
              required
              maxlength="6"
              class="form-input code-input"
              :class="{ 'error': errors.code }"
            />
            <span v-if="errors.code" class="error-message">{{ errors.code }}</span>
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
              <span v-else>{{ $t('auth.register.verify') }}</span>
            </button>
          </div>
        </form>
      </div>

      <div class="register-footer">
        <a href="#" @click.prevent="goToLogin" class="link">
          {{ $t('auth.register.backToLogin') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { registerRequest, registerVerify } from '../services/authApi';

export default {
  name: 'Register',
  data() {
    return {
      step: 1,
      form: {
        email: '',
        password: '',
        confirmPassword: '',
        code: ''
      },
      errors: {},
      errorMessage: '',
      successMessage: '',
      loading: false
    };
  },
  methods: {
    validateStep1() {
      this.errors = {};
      
      if (!this.form.email) {
        this.errors.email = this.$t('auth.register.emailRequired');
        return false;
      }
      
      // 简单的邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.form.email)) {
        this.errors.email = this.$t('auth.register.invalidEmail');
        return false;
      }
      
      if (!this.form.password) {
        this.errors.password = this.$t('auth.register.passwordRequired');
        return false;
      }
      
      if (this.form.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters';
        return false;
      }
      
      if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = this.$t('auth.register.passwordMismatch');
        return false;
      }
      
      return true;
    },
    
    async handleRequestCode() {
      this.errorMessage = '';
      this.successMessage = '';
      
      if (!this.validateStep1()) {
        return;
      }
      
      this.loading = true;
      
      try {
        await registerRequest(this.form.email, this.form.password);
        this.successMessage = this.$t('auth.register.codeSent');
        this.step = 2;
      } catch (error) {
        console.error('Register request error:', error);
        const errorMsg = error.message || this.$t('auth.register.error');
        
        if (errorMsg.includes('already registered') || errorMsg.includes('already exists')) {
          this.errorMessage = this.$t('auth.register.emailExists');
        } else {
          this.errorMessage = errorMsg;
        }
      } finally {
        this.loading = false;
      }
    },
    
    async handleVerify() {
      this.errors = {};
      this.errorMessage = '';
      this.successMessage = '';
      
      if (!this.form.code) {
        this.errors.code = this.$t('auth.register.codeRequired');
        return;
      }
      
      if (this.form.code.length !== 6) {
        this.errors.code = 'Verification code must be 6 digits';
        return;
      }
      
      this.loading = true;
      
      try {
        await registerVerify(this.form.email, this.form.code);
        this.successMessage = this.$t('auth.register.success');
        
        // 延迟跳转到登录页面
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      } catch (error) {
        console.error('Register verify error:', error);
        const errorMsg = error.message || this.$t('auth.register.error');
        
        if (errorMsg.includes('expired') || errorMsg.includes('not found') || errorMsg.includes('invalid')) {
          this.errorMessage = this.$t('auth.register.codeExpired');
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
.register-container {
  min-height: calc(100vh - 50px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%);
  margin-top: 50px;
}

.register-card {
  background: rgba(27, 38, 59, 0.9);
  border: 1px solid rgba(255, 192, 0, 0.3);
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.register-title {
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

.register-form {
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

.register-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.register-footer .link {
  color: #FFC000;
  text-decoration: none;
  transition: color 0.3s ease;
}

.register-footer .link:hover {
  color: #FFD700;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .register-container {
    padding: 1rem;
  }

  .register-card {
    padding: 2rem 1.5rem;
  }

  .register-title {
    font-size: 1.75rem;
  }
}
</style>

