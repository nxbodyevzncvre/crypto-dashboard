<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Dashboard</h1>
        <p class="text-slate-400 mt-1">Overview of the cryptocurrency market</p>
      </div>
      <button 
        @click="refreshData"
        :disabled="loadingCoins || loadingGlobal"
        class="px-4 py-2 bg-amber-400 text-slate-900 font-semibold rounded-lg hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg class="w-4 h-4" :class="{ 'animate-spin': loadingCoins || loadingGlobal }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Refresh
      </button>
    </div>

    <div v-if="globalData"  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Market Cap"
        :value="formatLargeNumber(globalData.total_market_cap?.usd)"
        prefix="$"
        :change="globalData.market_cap_change_percentage_24h_usd"
        iconColor="amber"
      >
        <template #icon>
          <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
            

        </template>
      </StatCard>
      
      <StatCard
        title="24h Volume"
        :value="formatLargeNumber(globalData.total_volume?.usd)"
        prefix="$"
        iconColor="blue"
      >
        <template #icon>
          <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
          </svg>
        </template>
      </StatCard>
      
      <StatCard
        title="BTC Dominance"
        :value="globalData.market_cap_percentage?.btc?.toFixed(1)"
        suffix="%"
        iconColor="amber"
      >
        <template #icon>
          <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.24 10.56c-.31 1.24-2.24.61-2.84.44l.55-2.18c.62.18 2.61.44 2.29 1.74zm-3.11 1.56l-.6 2.41c.74.19 3.03.92 3.37-.44.36-1.42-2.03-1.79-2.77-1.97zm10.57 2.3c-1.34 5.36-6.76 8.62-12.12 7.28S.96 14.94 2.3 9.58 9.06.96 14.42 2.3s8.62 6.76 7.28 12.12zM14.8 8.98c.56-2.24-1.38-3.02-3.24-3.52l.65-2.59L10.71 2.5l-.62 2.49c-.35-.09-.71-.18-1.06-.27l.62-2.5-1.49-.37-.64 2.59c-.29-.07-.57-.14-.84-.2l-2.06-.52-.65 1.65s1.11.26 1.09.27c.61.15.72.56.7.88l-1.69 6.79c-.08.2-.29.51-.76.39.02.03-1.09-.27-1.09-.27l-.74 1.77 1.94.49c.36.09.71.19 1.06.27l-.65 2.61 1.49.37.65-2.59c.36.1.72.19 1.07.27l-.65 2.58 1.49.37.65-2.61c2.71.51 4.75.3 5.61-2.15.69-1.97-.03-3.11-1.46-3.85 1.04-.24 1.82-.92 2.03-2.33z"/>
          </svg>
        </template>
      </StatCard>
      
      <StatCard
        title="Active Cryptocurrencies"
        :value="globalData.active_cryptocurrencies?.toLocaleString()"
        iconColor="emerald"
      >
        <template #icon>
          <svg class="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
          </svg>
        </template>
      </StatCard>
    </div>

    <LoadingSpinner v-if="loadingCoins && !coins.length" fullScreen />

    <div v-if="coins.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 class="text-lg font-semibold text-white mb-4">Top Cryptocurrencies</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CoinCard
              v-for="coin in topCoins"
              :key="coin.id"
              :coin="coin"
              @click="goToCoin"
            />
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 class="text-lg font-semibold text-white mb-4">Top Gainers (24h)</h2>
          <div class="space-y-3">
            <div
              v-for="coin in topGainers"
              :key="coin.id"
              @click="goToCoin(coin)"
              class="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <div class="flex items-center gap-3">
                <img :src="coin.image" :alt="coin.name" class="w-8 h-8 rounded-full" />
                <div>
                  <p class="font-medium text-white">{{ coin.symbol.toUpperCase() }}</p>
                  <p class="text-xs text-slate-400">${{ formatPrice(coin.current_price) }}</p>
                </div>
              </div>
              <span class="text-emerald-400 font-semibold">
                +{{ coin.price_change_percentage_24h?.toFixed(2) }}%
              </span>
            </div>
          </div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 class="text-lg font-semibold text-white mb-4">Top Losers (24h)</h2>
          <div class="space-y-3">
            <div
              v-for="coin in topLosers"
              :key="coin.id"
              @click="goToCoin(coin)"
              class="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <div class="flex items-center gap-3">
                <img :src="coin.image" :alt="coin.name" class="w-8 h-8 rounded-full" />
                <div>
                  <p class="font-medium text-white">{{ coin.symbol.toUpperCase() }}</p>
                  <p class="text-xs text-slate-400">${{ formatPrice(coin.current_price) }}</p>
                </div>
              </div>
              <span class="text-red-400 font-semibold">
                {{ coin.price_change_percentage_24h?.toFixed(2) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState, mapActions } from 'pinia'
import { useCryptoStore } from '@/stores/cryptoStore'

import StatCard from '@/components/StatCard.vue'
import CoinCard from '@/components/CoinCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export default defineComponent({
  name: 'DashboardView',

  components: { StatCard, CoinCard, LoadingSpinner },

  computed: {
    ...mapState(useCryptoStore, [
      'coins',
      'globalData',
      'loadingCoins',
      'loadingGlobal',
      'topGainers',
      'topLosers',
    ]),

    topCoins() {
      return this.coins.slice(0, 6)
    },
  },

  methods: {
    ...mapActions(useCryptoStore, [
      'fetchCoins',
      'fetchGlobalData',
    ]),

    async refreshData() {
      await this.fetchCoins(true)
      await this.fetchGlobalData(true)
    },

    formatLargeNumber(num: number): string {
      if (!num) return '0'
      if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'
      if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
      if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
      return num.toLocaleString()
    },

    formatPrice(price: number): string {
      if (!price) return '0.00'
      if (price >= 1)
        return price.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      return price.toPrecision(4)
    },

    goToCoin(coin: { id: string }) {
      this.$router.push({ name: 'coin-detail', params: { id: coin.id } })
    },
  },

  mounted() {

    this.fetchCoins()
    this.fetchGlobalData()
    
  },
})
</script>
