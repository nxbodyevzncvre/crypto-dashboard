<template>
  <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full min-w-300">
        <thead>
          <tr class="border-b border-slate-800">
            <th class="px-4 py-3 text-left text-xs text-slate-400">#</th>
            <th class="px-4 py-3 text-left text-xs text-slate-400">Coin</th>
            <th class="px-4 py-3 text-right text-xs text-slate-400">Price</th>
            <th class="px-4 py-3 text-right text-xs text-slate-400">1h %</th>
            <th class="px-4 py-3 text-right text-xs text-slate-400">24h %</th>
            <th class="px-4 py-3 text-right text-xs text-slate-400">7d %</th>
            <th class="px-4 py-3 text-right text-xs text-slate-400">Market Cap</th>
            <th class="px-4 py-3 text-right text-xs text-slate-400">Volume 24h</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(coin, index) in coins"
            :key="coin.id"
            @click="$emit('select', coin)"
            class="border-b border-slate-800/50 hover:bg-slate-800/50 cursor-pointer"
          >
            <td class="px-4 py-4 text-slate-400 text-sm">
              {{ index + 1 }}
            </td>

            <td class="px-4 py-4">
              <div class="flex items-center gap-3">
                <img :src="coin.image" class="w-8 h-8 rounded-full" />
                <div>
                  <p class="font-semibold text-white">{{ coin.name }}</p>
                  <p class="text-xs text-slate-400">
                    {{ coin.symbol.toUpperCase() }}
                  </p>
                </div>
              </div>
            </td>

            <td class="px-4 py-4 text-right text-white font-semibold">
              ${{ formatPrice(coin.current_price) }}
            </td>

            <td class="px-4 py-4 text-right">
              <span :class="getChangeClass(coin.percent_change_1h)">
                {{ formatChange(coin.percent_change_1h) }}
              </span>
            </td>

            <td class="px-4 py-4 text-right">
              <span :class="getChangeClass(coin.percent_change_24h)">
                {{ formatChange(coin.percent_change_24h) }}
              </span>
            </td>

            <td class="px-4 py-4 text-right">
              <span :class="getChangeClass(coin.percent_change_7d)">
                {{ formatChange(coin.percent_change_7d) }}
              </span>
            </td>

            <td class="px-4 py-4 text-right text-slate-300">
              ${{ formatNumber(coin.market_cap) }}
            </td>

            <td class="px-4 py-4 text-right text-slate-300">
              ${{ formatNumber(coin.volume24) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>




<script>
export default {
  name: 'CoinTable',
  props: {
    coins: {
      type: Array,
      required: true
    }
  },
  emits: ['select'],    
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
    },
    formatChange(value) {
      if (value === null || value === undefined) return '-'
      const sign = value >= 0 ? '+' : ''
      return `${sign}${value.toFixed(2)}%`
    },
    getChangeClass(value) {
      if (value === null || value === undefined) return 'text-slate-400'
      return value >= 0 ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'
    }
  }
}
</script>
