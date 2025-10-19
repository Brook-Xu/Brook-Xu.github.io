<template>
  <div class="crypto-strategies">
    <div class="hero-section">
      <h1 class="main-title">{{ $t('cryptoStrategies.title') }}</h1>
    </div>
    
    <div class="strategies-container">
      <div class="strategies-grid">
        <div class="strategy-card">
          <div class="strategy-number">01</div>
          <h3 class="strategy-title">{{ $t('cryptoStrategies.strategy1.title') }}</h3>
          <div class="strategy-details">
            <div class="detail-item">
              <span class="detail-label">{{ $t('cryptoStrategies.yield2024') }}:</span>
              <span class="detail-value yield">{{ $t('cryptoStrategies.strategy1.yield') }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('cryptoStrategies.maxDrawdown') }}:</span>
              <span class="detail-value">{{ $t('cryptoStrategies.strategy1.maxDrawdown') }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('cryptoStrategies.minInvestment') }}:</span>
              <span class="detail-value">{{ $t('cryptoStrategies.strategy1.minInvestment') }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('cryptoStrategies.fees') }}:</span>
              <span class="detail-value">{{ $t('cryptoStrategies.strategy1.fees') }}</span>
            </div>
          </div>
        </div>

        <div class="strategy-card">
          <div class="strategy-number">02</div>
          <h3 class="strategy-title">{{ $t('cryptoStrategies.strategy2.title') }}</h3>
          <div class="strategy-details">
            <div class="detail-item">
              <span class="detail-label">{{ $t('cryptoStrategies.yield2024') }}:</span>
              <span class="detail-value yield">{{ $t('cryptoStrategies.strategy2.yield') }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('cryptoStrategies.maxDrawdown') }}:</span>
              <span class="detail-value">{{ $t('cryptoStrategies.strategy2.maxDrawdown') }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('cryptoStrategies.minInvestment') }}:</span>
              <span class="detail-value">{{ $t('cryptoStrategies.strategy2.minInvestment') }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('cryptoStrategies.fees') }}:</span>
              <span class="detail-value">{{ $t('cryptoStrategies.strategy2.fees') }}</span>
            </div>
          </div>
        </div>

        <div class="strategy-card">
          <div class="strategy-number">03</div>
          <h3 class="strategy-title">{{ $t('cryptoStrategies.strategy3.title') }}</h3>
          <div class="strategy-details">
            <div class="detail-item">
              <span class="detail-label">{{ $t('cryptoStrategies.yield2024') }}:</span>
              <span class="detail-value yield">{{ $t('cryptoStrategies.strategy3.yield') }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('cryptoStrategies.maxDrawdown') }}:</span>
              <span class="detail-value">{{ $t('cryptoStrategies.strategy3.maxDrawdown') }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('cryptoStrategies.minInvestment') }}:</span>
              <span class="detail-value">{{ $t('cryptoStrategies.strategy3.minInvestment') }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('cryptoStrategies.fees') }}:</span>
              <span class="detail-value">{{ $t('cryptoStrategies.strategy3.fees') }}</span>
            </div>
          </div>
        </div>

        <div class="strategy-card">
          <div class="strategy-number">04</div>
          <h3 class="strategy-title">{{ $t('cryptoStrategies.strategy4.title') }}</h3>
          <div class="strategy-details">
            <div class="detail-item">
              <span class="detail-label">{{ $t('cryptoStrategies.yield2025') }}:</span>
              <span class="detail-value yield">{{ $t('cryptoStrategies.strategy4.yield') }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('cryptoStrategies.maxDrawdown') }}:</span>
              <span class="detail-value">{{ $t('cryptoStrategies.strategy4.maxDrawdown') }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('cryptoStrategies.minInvestment') }}:</span>
              <span class="detail-value">{{ $t('cryptoStrategies.strategy4.minInvestment') }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('cryptoStrategies.fees') }}:</span>
              <span class="detail-value">{{ $t('cryptoStrategies.strategy4.fees') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CryptoStrategies'
};
</script>

<style scoped>
.crypto-strategies {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  color: #ffffff;
  padding: 0;
  font-family: 'Arial', sans-serif;
}

.hero-section {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  padding: 80px 20px 60px;
  text-align: center;
  border-bottom: 2px solid #FFC000;
}

.main-title {
  font-size: 2.2rem;
  color: #FFC000;
  margin: 40px 0 0 0;
  font-weight: 700;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
}

.strategies-container {
  padding: 60px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.strategies-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 40px;
}

.strategy-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 192, 0, 0.2);
  border-radius: 20px;
  padding: 40px 30px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.strategy-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FFC000, #FFD700, #FFC000);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.strategy-card:hover {
  transform: translateY(-10px);
  border-color: #FFC000;
  box-shadow: 0 20px 40px rgba(255, 192, 0, 0.2);
}

.strategy-card:hover::before {
  opacity: 1;
}

.strategy-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #FFC000;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.strategy-title {
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 30px;
  font-weight: 600;
  line-height: 1.3;
}

.strategy-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-label {
  color: #cccccc;
  font-size: 1rem;
  font-weight: 500;
}

.detail-value {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: right;
}

.detail-value.yield {
  color: #00ff88;
  font-weight: 700;
  font-size: 1.2rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .strategies-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  
  .strategy-card {
    padding: 30px 25px;
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 1.8rem;
    margin: 30px 0 0 0;
  }
  
  .hero-section {
    padding: 60px 20px 40px;
  }
  
  .strategies-container {
    padding: 40px 15px;
  }
  
  .strategy-card {
    padding: 25px 20px;
  }
  
  .strategy-title {
    font-size: 1.5rem;
  }
  
  .strategy-number {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.5rem;
    margin: 20px 0 0 0;
  }
  
  .strategy-card {
    padding: 20px 15px;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .detail-value {
    text-align: left;
  }
}
</style>
