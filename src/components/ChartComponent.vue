<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'ChartComponent',
  props: {
    data: {
      type: Object,
      required: true
    },
    total: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    this.initChart()
    this.setupResizeObserver()
  },
  watch: {
    data: {
      handler() {
        this.updateChart()
      },
      deep: true
    },
    total() {
      this.updateChart()
    }
  },
  methods: {
    initChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d')

      const colors = [
        '#4ADE80', 
        '#EF4444', 
        '#F59E0B', 
        '#6B7280', 

      ]

      const chartData = {
        ...this.data,
        datasets: this.data.datasets.map(dataset => ({
          ...dataset,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 2
        }))
      }

      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `${context.label}: ${context.parsed}`
              }
            },
            centerText: { total: this.total }
          }
        },
        plugins: [this.centerTextPlugin()]
      })
    },
    updateChart() {
      if (this.chart) {
        const colors = [
          '#6EE7B7', 
          '#F87171', 
          '#F59E0B', 
          '#6B7280', 
        ]

        const updatedData = {
          ...this.data,
          datasets: this.data.datasets.map(dataset => ({
            ...dataset,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 2
          }))
        }

        this.chart.data = updatedData
        this.chart.options.plugins.centerText.total = this.total
        this.chart.update()
      }
    },
    centerTextPlugin() {
      return {
        id: 'centerText',
        beforeDraw: (chart) => {
          const { ctx, chartArea: { width, height } } = chart
          ctx.save()

          ctx.font = 'bold 10px sans-serif'
          ctx.fillStyle = '#6b7280'
          ctx.textAlign = 'center'
          ctx.fillText('Barcha xodimlar', width / 2, height / 2 - 5)

          ctx.font = 'bold 20px sans-serif'
          ctx.fillStyle = '#111827'
          ctx.fillText(`${chart.options.plugins.centerText.total}`, width / 2, height / 2 + 20)

          ctx.restore()
        }
      }
    },
    setupResizeObserver() {
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => {
          if (this.chart) this.chart.resize()
        })
        this.resizeObserver.observe(this.$refs.chartCanvas.parentElement)
      }
    }
  },
  beforeUnmount() {
    if (this.resizeObserver) this.resizeObserver.disconnect()
    if (this.chart) this.chart.destroy()
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 250px;
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
@media (max-width: 768px) {
  .chart-container {
    height: 200px;
    padding: 15px;
  }
}
@media (max-width: 480px) {
  .chart-container {
    height: 160px;
    padding: 10px;
  }
}
</style>