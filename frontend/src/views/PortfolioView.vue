<template>
  <div class="space-y-6">

    <h1 class="text-2xl font-bold text-white">Portfolio</h1>

    <div
      v-for="(item, index) in portfolio"
      :key="index"
      class="bg-slate-900 border border-slate-800 rounded-xl p-5 flex justify-between items-center"
    >
      <div class="flex items-center gap-4">
        <img :src="item.image" class="w-10 h-10 rounded-full" />

        <div>
          <p class="text-white font-semibold">
            {{ item.symbol.toUpperCase() }}
          </p>
          <p class="text-slate-400 text-sm">
            {{ item.amount }} × ${{ item.buyPrice }}
          </p>
        </div>
      </div>

      <div class="text-right">
        <p class="text-white font-semibold">
          ${{ currentValue(item).toFixed(2) }}
        </p>

        <p
          class="text-sm font-medium"
          :class="pnl(item) >= 0 ? 'text-emerald-400' : 'text-red-400'"
        >
          {{ pnl(item) >= 0 ? '+' : '' }}{{ pnl(item).toFixed(2) }}$
          ({{ pnlPercent(item).toFixed(2) }}%)
        </p>
      </div>

      <button
        class="text-red-400 hover:text-red-300"
        @click="remove(index)"
      >
        ✕
      </button>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState, mapActions } from 'pinia'

import { usePortfolioStore, type PortfolioItem } from '@/stores/portfolioStore'
import { useCryptoStore, type Coin } from '@/stores/cryptoStore'

export default defineComponent({
  name: 'PortfolioView',

  computed: {
    ...mapState(usePortfolioStore, ['items']),
    ...mapState(useCryptoStore, ['coins']),


    portfolio(): PortfolioItem[] {
      return this.items as PortfolioItem[]
    },
  },

  methods: {
    ...mapActions(usePortfolioStore, ['remove']),
    ...mapActions(useCryptoStore, ['fetchCoins']),

    getPrice(symbol: string): number {
      const coin = (this.coins as Coin[]).find(
        c => c.symbol.toLowerCase() === symbol.toLowerCase()
      )

      return coin?.current_price ?? 0
    },

    currentValue(item: PortfolioItem): number {
      return item.amount * this.getPrice(item.symbol)
    },

    pnl(item: PortfolioItem): number {
      return this.currentValue(item) - item.amount * item.buyPrice
    },

    pnlPercent(item: PortfolioItem): number {
      const invested = item.amount * item.buyPrice
      return invested
        ? (this.pnl(item) / invested) * 100
        : 0
    },
  },

  async mounted(): Promise<void> {
    const portfolio = usePortfolioStore()

    portfolio.load()

    if (!(this.coins as Coin[]).length) {
      await this.fetchCoins()
    }
  },
})
</script>


