<template>
  <div class="section-content">
    <h2 class="gradient-title">{{ $t('navigation.contactUs') }}</h2>
    <div class="contact-content">
      <div class="contact-grid">
        <div class="contact-info">
          <div class="contact-item">
            <div class="contact-icon">💬</div>
            <div class="contact-details">
              <h4>Telegram</h4>
              <p>starnetcapitalDan</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">📧</div>
            <div class="contact-details">
              <h4>Email</h4>
              <p>Xing@starnetdigital.cc</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">🔗</div>
            <div class="contact-details">
              <h4>LinkedIn</h4>
              <p><a class="external-link" href="https://www.linkedin.com/company/105309831/" target="_blank" rel="noopener noreferrer">https://www.linkedin.com/company/105309831/</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactSection',
  
};
</script>

<style scoped>
.section-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px 20px;
}

/* 渐变色标题 */
.gradient-title {
  font-size: 2.5rem;
  background: linear-gradient(90deg, #42b983, #4fc3f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.section-content h2 {
  font-size: 2.5rem;
  color: #42b983;
  margin-bottom: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
}

.contact-info h3 {
  color: #42b983;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.contact-info {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-start;
  gap: 0;
  width: 100%;
  flex-wrap: nowrap;
}

.contact-item {
  display: flex;
  align-items: center;
  margin: 0;
  flex: 1 1 0;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-right: none;
  padding: 1.25rem 1.5rem;
  padding-bottom: 2.5rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.03);
  min-height: 100px;
}

.contact-item:last-child {
  border-right: 1px solid rgba(255, 255, 255, 0.18);
}

.contact-item:first-child {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.contact-item:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
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

.external-link {
  color: #4fc3f7;
  text-decoration: none;
  border-bottom: 1px dashed rgba(79, 195, 247, 0.6);
  transition: color 0.2s ease, border-color 0.2s ease;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.external-link:hover {
  color: #66d9a3;
  border-bottom-color: #66d9a3;
}

.external-link::after {
  content: '↗';
  margin-left: 6px;
  font-size: 0.9em;
  opacity: 0.8;
}

/* removed form styles */

/* 响应式设计 */
@media (max-width: 768px) {
  .gradient-title {
    font-size: 2rem;
  }
  
  .section-content h2 {
    font-size: 2rem;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 480px) {
}
</style>
