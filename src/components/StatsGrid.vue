<template>
  <div class="stats-grid">
    <div 
      v-for="stat in stats" 
      :key="stat.id"
      :class="['stat-card', `stat-${stat.color}`]"
      @click="handleStatClick(stat)"  
      style="cursor:pointer;"
    >
      <div class="stat-number">{{ stat.count }}</div>
      <div class="stat-title">{{ stat.title }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsGrid',
  props: {
    stats: { type: Array, default: () => [] }
  },
  methods: {
    handleStatClick(stat) {
      this.$emit('stat-click', stat)
    }
  }
}
</script>


  <style scoped>
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 20px;
    margin-bottom: 28px;
  }
  
  .stat-card {
    position: relative;
    padding: 24px 12px 20px 12px;
    border-radius: 16px;
    text-align: center;
    backdrop-filter: blur(6px);
    background: linear-gradient(135deg, rgba(255,255,255,0.85) 70%, rgba(244,245,250,0.95) 100%);
    box-shadow: 0 4px 24px rgba(91,105,135,0.07), 0 2px 6px rgba(40,60,100,0.06);
    border: 1px solid rgba(180,200,255,0.09);
    cursor: pointer;
    transition:
      transform 0.17s cubic-bezier(.45,.05,.55,.95),
      box-shadow 0.22s cubic-bezier(.45,.05,.55,.95),
      background 0.16s;
    overflow: hidden;
  }
  .stat-card::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0.12;
    background: linear-gradient(120deg, #fff 0%, #e2e8f0 100%);
  }
  
  .stat-card:hover {
    transform: translateY(-7px) scale(1.03);
    box-shadow: 0 8px 32px rgba(80,100,150,0.14), 0 4px 16px rgba(52,90,170,0.10);
    background: linear-gradient(120deg, #f1f5fd 70%, #e9ecef 100%);
  }
  
  .stat-number {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 6px;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 12px rgba(50,70,110,0.09);
    line-height: 1;
  }
  
  .stat-title {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 3px;
    opacity: 0.82;
    line-height: 1.1;
  }
  
  .stat-green {
    color: #036122;
    background: linear-gradient(120deg, rgba(7, 184, 36, 0.14) 80%, rgba(236,253,245,0.55));
    box-shadow: 0 2px 12px rgba(16,185,129,0.08);
    border: 1px solid #b8f3d5;
  }
  .stat-red {
    color: #dc2626;
    background: linear-gradient(120deg, rgba(239, 68, 68, 0.13) 55%, rgba(254,242,242,0.58));
    box-shadow: 0 2px 12px rgba(239,68,68,0.08);
    border: 1px solid #fbcaca;
  }
  .stat-yellow {
    color: #af5f04;
    background: linear-gradient(120deg, rgba(245, 158, 11, 0.12) 60%, rgba(255,251,235,0.56));
    box-shadow: 0 2px 12px rgba(245,158,11,0.07);
    border: 1px solid #ffe4a3;
  }
  .stat-gray {
    color: #6b7280;
    background: linear-gradient(120deg, rgba(107,114,128,0.12) 65%, rgba(243,244,246,0.56));
    box-shadow: 0 2px 12px rgba(107,114,128,0.07);
    border: 1px solid #e5e7eb;
  }
  
  @media (max-width: 600px) {
    .stats-grid {
      grid-template-columns: 1fr 1fr;
      gap: 13px;
    }
    .stat-card {
      padding: 14px 7px 14px 7px;
      font-size: 12px;
    }
    .stat-number {
      font-size: 23px;
    }
    .stat-title {
      font-size: 10px;
      letter-spacing: 0.6px;
    }
  }
  
  @media (max-width: 400px) {
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 10px;
    }
  }
  
  </style>
  