<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">All Cryptocurrencies</h1>
        <p class="text-slate-400 mt-1">{{ filteredCoins.length }} coins available</p>
      </div>
      <div class="w-full sm:w-72">
        <SearchBar v-model="searchQuery" placeholder="Search coins..." />
      </div>
    </div>

    <LoadingSpinner v-if="loadingCoins && !coins.length" fullScreen />

    <CoinTable
      v-if="filteredCoins.length > 0"
      :coins="filteredCoins"
      @select="goToCoin"
    />
    <div
        v-if="total > limit"
        class="flex justify-between items-center mt-10 px-4"
        >
        <button
            @click="fetchCoins(page - 1)"
            :disabled="page === 1 || loadingCoins"
            class="px-4 py-2 rounded-lg bg-slate-800 text-white
                hover:bg-slate-700 transition
                disabled:opacity-40 disabled:cursor-not-allowed"
        >
            ← Prev
        </button>

        <span class="text-slate-400 font-medium">
            Page {{ page }}
        </span>

        <button
            @click="fetchCoins(page + 1)"
            :disabled="loadingCoins || page * limit >= total"
            class="px-4 py-2 rounded-lg bg-slate-800 text-white
                hover:bg-slate-700 transition
                disabled:opacity-40 disabled:cursor-not-allowed"
        >
            Next →
        </button>
        </div>


    <div v-if="!loadingCoins && filteredCoins.length === 0 && searchQuery" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <h3 class="text-lg font-semibold text-white mb-2">No coins found</h3>
      <p class="text-slate-400">Try adjusting your search query</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useCryptoStore } from '../stores/cryptoStore'
import CoinTable from '../components/CoinTable.vue'
import SearchBar from '../components/SearchBar.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

export default {
  name: 'CoinsView',
  components: {
    CoinTable,
    SearchBar,
    LoadingSpinner
  },
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    ...mapState(useCryptoStore, ['coins', 'loadingCoins', 'page','limit','total',]),
    filteredCoins() {
      if (!this.searchQuery) return this.coins
      const query = this.searchQuery.toLowerCase()
      return this.coins.filter(
        coin => coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query)
      )
    }
  },
  methods: {
    ...mapActions(useCryptoStore, ['fetchCoins']),
    goToCoin(coin) {
      this.$router.push({ name: 'coin-detail', params: { id: coin.id } })
    }
  },
  mounted() {
    if (this.coins.length === 0) {
      this.fetchCoins()
    }
    console.log(this.filteredCoins)
  }
}
</script>
