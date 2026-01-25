<template>
    <div class="w-full h-130 md:h-155 lg:h-180 rounded-xl overflow-hidden">
        <div :id="containerId" class="w-full h-full"></div>
  </div>
</template>

<script>
export default {
  name: 'TradingViewChart',

  props: {
    symbol: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      widget: null,
      containerId: 'tv_' + Math.random().toString(36).slice(2),
    }
  },

  mounted() {
    this.loadTradingView()
  },

  watch: {
    symbol() {
      this.createWidget()
    },
  },

  methods: {
    loadTradingView() {
      if (window.TradingView) {
        this.createWidget()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/tv.js'
      script.async = true
      script.onload = () => {
        this.createWidget()
      }

      document.head.appendChild(script)
    },

    createWidget() {
      if (!window.TradingView) return

      if (this.widget) {
        this.widget.remove()
        this.widget = null
      }

      const pair = `BINANCE:${this.symbol.toUpperCase()}USDT`

      this.widget = new window.TradingView.widget({
        autosize: true,
        symbol: pair,
        interval: '60',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#0f172a',
        backgroundColor: '#0f172a',
        hide_top_toolbar: false,
        hide_legend: false,
        allow_symbol_change: false,
        save_image: false,
        studies: ['Volume@tv-basicstudies'],
        container_id: this.containerId,
      })
    },
  },

  beforeUnmount() {
    if (this.widget) {
      this.widget.remove()
      this.widget = null
    }
  },
}
</script>
