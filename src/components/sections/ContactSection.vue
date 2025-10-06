<template>
  <div class="section-content">
    <h2>{{ $t('navigation.contactUs') }}</h2>
    <div class="contact-content">
      <div class="contact-grid">
        <div class="contact-info" data-aos="fade-up" data-aos-delay="100">
          <h3>{{ $t('home.contactInfo.title') }}</h3>
          <div class="contact-item">
            <div class="contact-icon">📧</div>
            <div class="contact-details">
              <h4>{{ $t('home.contactInfo.email') }}</h4>
              <p>contact@starnet-digital.com</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">📱</div>
            <div class="contact-details">
              <h4>{{ $t('home.contactInfo.phone') }}</h4>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">📍</div>
            <div class="contact-details">
              <h4>{{ $t('home.contactInfo.address') }}</h4>
              <p>{{ $t('home.contactInfo.addressText') }}</p>
            </div>
          </div>
        </div>
        <div class="contact-form" data-aos="fade-up" data-aos-delay="200">
          <h3>{{ $t('home.contactForm.title') }}</h3>
          <form @submit.prevent="submitContactForm">
            <div class="form-group">
              <input type="text" v-model="contactForm.name" :placeholder="$t('home.contactForm.name')" required>
            </div>
            <div class="form-group">
              <input type="email" v-model="contactForm.email" :placeholder="$t('home.contactForm.email')" required>
            </div>
            <div class="form-group">
              <textarea v-model="contactForm.message" :placeholder="$t('home.contactForm.message')" rows="5" required></textarea>
            </div>
            <button type="submit" class="submit-btn">{{ $t('home.contactForm.submit') }}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactSection',
  data() {
    return {
      contactForm: {
        name: '',
        email: '',
        message: ''
      }
    };
  },
  methods: {
    submitContactForm() {
      // 这里可以添加表单验证和提交逻辑
      console.log('Contact form submitted:', this.contactForm);
      // 重置表单
      this.contactForm = {
        name: '',
        email: '',
        message: ''
      };
      // 显示成功消息
      alert(this.$t('home.contactForm.successMessage'));
    }
  }
};
</script>

<style scoped>
.section-content h2 {
  font-size: 2.5rem;
  color: #42b983;
  margin-bottom: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
}

.contact-info h3,
.contact-form h3 {
  color: #42b983;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.contact-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  width: 40px;
  text-align: center;
}

.contact-details h4 {
  color: #42b983;
  margin-bottom: 0.5rem;
}

.contact-details p {
  color: #ccc;
  margin: 0;
}

.contact-form {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(66, 185, 131, 0.2);
  width: 100%;
  box-sizing: border-box;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #999;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 10px rgba(66, 185, 131, 0.3);
}

.submit-btn {
  background: linear-gradient(45deg, #42b983, #4fc3f7);
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(66, 185, 131, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-content h2 {
    font-size: 2rem;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .contact-form {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .contact-form {
    padding: 1rem;
  }
}
</style>
