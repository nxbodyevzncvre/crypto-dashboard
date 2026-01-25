<template>
  <div class="space-y-6">


    <button
      @click="$router.back()"
      class="flex items-center gap-2 text-slate-400 hover:text-white"
    >
      ← Back
    </button>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p class="text-slate-400 text-sm">Total Invested</p>
        <p class="text-2xl font-bold text-white">
          ${{ formatLargeNumber(totalInvested) }}
        </p>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p class="text-slate-400 text-sm">Current Value</p>
        <p class="text-2xl font-bold text-white">
          ${{ formatLargeNumber(currentValueTotal) }}
        </p>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p class="text-slate-400 text-sm">Total PnL</p>
        <p
          class="text-2xl font-bold"
          :class="totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'"
        >
          {{ totalPnl >= 0 ? '+' : '' }}${{ totalPnl.toFixed(2) }}
        </p>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p class="text-slate-400 text-sm">PnL %</p>
        <p
          class="text-2xl font-bold"
          :class="totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'"
        >
          {{ totalPnl >= 0 ? '+' : '' }}{{ totalPnlPercent.toFixed(2) }}%
        </p>
      </div>

    </div>


    <div v-if="coin" class="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div class="flex flex-col md:flex-row justify-between gap-6">

        <div class="flex items-center gap-4">
          <img :src="coin.image" class="w-16 h-16 rounded-full" />
          <div>
            <h1 class="text-2xl font-bold text-white">
              {{ coin.name }}
            </h1>
            <span class="text-slate-400 text-sm">
              {{ coin.symbol.toUpperCase() }}
            </span>
          </div>
        </div>

        <div class="text-right">
          <p class="text-3xl font-bold text-white">
            ${{ formatPrice(coin.current_price) }}
          </p>

          <p
            class="text-lg font-semibold"
            :class="coin.percent_change_24h >= 0
              ? 'text-emerald-400'
              : 'text-red-400'"
          >
            {{ coin.percent_change_24h.toFixed(2) }}%
          </p>

          <button
            @click="showAdd = true"
            class="mt-3 px-5 py-2 bg-amber-400 text-slate-900 rounded-lg font-semibold"
          >
            Add to portfolio
          </button>
        </div>

      </div>
    </div>


    <div v-if="coin" class="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <TradingViewChart :symbol="coin.symbol" />
    </div>


    <div
      v-if="showAdd"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-sm space-y-4">

        <h3 class="text-xl font-semibold text-white">
          Add {{ coin?.symbol.toUpperCase() }}
        </h3>

        <input
          v-model.number="amount"
          type="number"
          placeholder="Amount"
          class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
        />

        <input
          v-model.number="buyPrice"
          type="number"
          :placeholder="String(coin?.current_price)"
          class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
        />

        <div class="flex gap-3">
          <button
            @click="showAdd = false"
            class="flex-1 py-2 border border-slate-700 text-white rounded"
          >
            Cancel
          </button>

          <button
            @click="addToPortfolio"
            class="flex-1 py-2 bg-amber-400 text-slate-900 rounded font-semibold"
          >
            Add
          </button>
        </div>

      </div>
    </div>

  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'pinia'
import { useCryptoStore, type Coin } from '@/stores/cryptoStore'
import { usePortfolioStore } from '@/stores/portfolioStore'
import TradingViewChart from '@/components/TradingViewChart.vue'

export default defineComponent({
  name: 'CoinDetailView',

  components: { TradingViewChart },

  data() {
    return {
      showAdd: false,
      amount: 0,
      buyPrice: 0,
    }
  },

  computed: {
    ...mapState(useCryptoStore, ['coins']),

    portfolio() {
      return usePortfolioStore()
    },


    coin(): Coin | undefined {
      return this.coins.find(
        (c: Coin) => c.id === this.$route.params.id
      )
    },

    totalInvested(): number {
      return this.portfolio.items.reduce(
        (sum, i) => sum + i.amount * i.buyPrice,
        0
      )
    },

    currentValueTotal(): number {
      return this.portfolio.items.reduce(
        (sum, i) => sum + i.amount * this.getPrice(i.symbol),
        0
      )
    },

    totalPnl(): number {
      return this.currentValueTotal - this.totalInvested
    },

    totalPnlPercent(): number {
      return this.totalInvested
        ? (this.totalPnl / this.totalInvested) * 100
        : 0
    },
  },

  methods: {
    getPrice(symbol: string): number {
      const crypto = useCryptoStore()

      const coin = crypto.coins.find(
        (c: Coin) =>
          c.symbol.toLowerCase() === symbol.toLowerCase()
      )

      return coin?.current_price ?? 0
    },

    formatPrice(price: number): string {
      if (!price) return '0.00'

      if (price >= 1) {
        return price.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      }

      return price.toPrecision(4)
    },

    formatLargeNumber(n: number): string {
      if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T'
      if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
      if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
      return n.toLocaleString()
    },

    addToPortfolio(): void {
      if (!this.coin) return

      const price =
        this.buyPrice && this.buyPrice > 0
          ? this.buyPrice
          : this.coin.current_price

      usePortfolioStore().addCoin(
        {
          id: this.coin.id,
          name: this.coin.name,
          symbol: this.coin.symbol,
          image: this.coin.image,
        },
        this.amount,
        price
      )

      this.showAdd = false
      this.amount = 0
      this.buyPrice = 0
    },
  },
})
</script>
