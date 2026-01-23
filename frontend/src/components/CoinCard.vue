<template>
  <div 
    class="bg-slate-900 border border-slate-800 rounded-xl p-5 cursor-pointer transition-all hover:border-slate-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
    @click="$emit('click', coin)"
  >
    <div class="flex items-center gap-3 mb-4">
      <img :src="coin.image" :alt="coin.name" class="w-12 h-12 rounded-full" />
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-white truncate">{{ coin.name }}</h3>
        <span class="text-slate-400 text-sm">{{ coin.symbol.toUpperCase() }}</span>
      </div>
      <span class="text-slate-500 text-sm font-medium">#{{ coin.market_cap_rank }}</span>
    </div>
    
    <div class="flex items-baseline gap-3 mb-4">
      <span class="text-2xl font-bold text-white">${{ formatPrice(coin.current_price) }}</span>
      <span 
        class="text-sm font-semibold px-2 py-1 rounded-md"
        :class="coin.price_change_percentage_24h >= 0 ? 'bg-emerald-400/20 text-emerald-400' : 'bg-red-400/20 text-red-400'"
      >
        {{ coin.price_change_percentage_24h >= 0 ? '+' : '' }}{{ coin.price_change_percentage_24h?.toFixed(2) }}%
      </span>
    </div>
    
    <div class="grid grid-cols-2 gap-3">
      <div>
        <span class="block text-xs text-slate-500 mb-1">Market Cap</span>
        <span class="text-sm font-semibold text-slate-300">${{ formatNumber(coin.market_cap) }}</span>
      </div>
      <div>
        <span class="block text-xs text-slate-500 mb-1">Volume 24h</span>
        <span class="text-sm font-semibold text-slate-300">${{ formatNumber(coin.total_volume) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CoinCard',
  props: {
    coin: {
      type: Object,
      required: true
    }
  },
  emits: ['click'],
  methods: {
    formatPrice(price) {
      if (!price) return '0.00'
      if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      return price.toPrecision(4)
    },
    formatNumber(num) {
      if (!num) return '0'
      if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'
      if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
      if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
      return num.toLocaleString()
    }
  }
}
</script>
