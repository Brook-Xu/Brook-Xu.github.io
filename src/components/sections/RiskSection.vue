<template>
  <div class="section-content">
    <h2 class="gradient-title">{{ $t('navigation.riskManagement') }}</h2>
    <div class="risk-content">
      <div class="risk-grid">
        <div class="risk-item">
          <h3>{{ $t('home.risk1.title') }}</h3>
          <ul class="risk-bullets">
            <li>{{ $t('home.risk1.point1') }}</li>
            <li>{{ $t('home.risk1.point2') }}</li>
          </ul>
        </div>
        <div class="risk-item">
          <h3>{{ $t('home.risk2.title') }}</h3>
          <ul class="risk-bullets">
            <li>{{ $t('home.risk2.point1') }}</li>
            <li>{{ $t('home.risk2.point2') }}</li>
            <li>{{ $t('home.risk2.point3') }}</li>
          </ul>
        </div>
        <div class="risk-item">
          <h3>{{ $t('home.risk3.title') }}</h3>
          <ul class="risk-bullets">
            <li>{{ $t('home.risk3.point1') }}</li>
            <li>{{ $t('home.risk3.point2') }}</li>
            <li>{{ $t('home.risk3.point3') }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RiskSection'
};
</script>

<style scoped>
.section-content {
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

/* 渐变色标题 */
.gradient-title {
  font-size: 2.5rem;
  color: #FFC000;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.section-content h2 {
  font-size: 2.5rem;
  color: #FFC000;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.risk-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  margin-top: 1rem;
  width: 100%;
  max-width: 1400px;
  box-sizing: border-box;
}

.risk-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 192, 0, 0.2);
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  overflow-wrap: break-word;
  /* 确保元素在没有AOS动画时也可见 */
  opacity: 1 !important;
  visibility: visible !important;
  /* 确保所有模块高度一致 */
  display: flex;
  flex-direction: column;
  height: 100%;
  text-align: left;
}

.risk-item:hover {
  transform: translateY(-5px);
  border-color: #FFC000;
  box-shadow: 0 10px 30px rgba(255, 192, 0, 0.2);
}

.risk-item h3 {
  color: #FFC000;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  margin-top: 0;
  text-align: left;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.risk-item p {
  color: #ccc;
  line-height: 1.6;
  text-align: left;
  flex-grow: 1;
  margin: 0;
}

.risk-bullets {
  color: #ccc;
  line-height: 1.6;
  text-align: left;
  flex-grow: 1;
  margin: 0;
  padding-left: 1rem;
  list-style: none;
  font-size: 1.1rem;
}

.risk-bullets li {
  position: relative;
  margin-bottom: 0.5rem;
  padding-left: 1rem;
}

.risk-bullets li::before {
  content: "·";
  position: absolute;
  left: 0;
  color: #ccc;
  font-weight: bold;
  font-size: 1.2em;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .risk-grid {
    max-width: 1200px;
    gap: 2rem;
  }
}

@media (max-width: 1200px) {
  .risk-grid {
    max-width: 1000px;
    gap: 1.8rem;
  }
}

@media (max-width: 1024px) {
  .risk-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 800px;
    gap: 1.5rem;
  }
  
  .risk-item h3 {
    white-space: normal;
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .gradient-title {
    font-size: 2rem;
  }
  
  .section-content h2 {
    font-size: 2rem;
  }
  
  .risk-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .risk-item {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .risk-item {
    padding: 1rem;
  }
}
</style>
