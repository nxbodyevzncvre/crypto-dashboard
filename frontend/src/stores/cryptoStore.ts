import { defineStore } from 'pinia'

interface CoinApi {
  id: string
  name: string
  symbol: string
  nameid: string

  price_usd: string

  percent_change_24h: string
  percent_change_1h: string
  percent_change_7d: string

  market_cap_usd: string
  volume24: string
}

export interface Coin {
  id: string
  name: string
  symbol: string
  image: string

  current_price: number

  percent_change_24h: number
  percent_change_1h: number
  percent_change_7d: number

  market_cap: number
  volume24: number
}

export interface GlobalData {
  total_market_cap: { usd: number }
  total_volume: { usd: number }
  market_cap_percentage: { btc: number }
  market_cap_change_percentage_24h_usd: number
  active_cryptocurrencies: number
}

const COINS_TTL = 60_000
const GLOBAL_TTL = 5 * 60_000
const STORAGE_KEY = 'crypto-cache'

export const useCryptoStore = defineStore('crypto', {
  state: () => ({
    coins: [] as Coin[],
    globalData: null as GlobalData | null,

    loadingCoins: false,
    loadingGlobal: false,

    errorCoins: null as string | null,
    errorGlobal: null as string | null,

    page: 1,
    limit: 50,
    total: 0,

    cache: {
      pages: {} as Record<number, Coin[]>,
      coinsTs: 0,
      total: 0,

      global: null as GlobalData | null,
      globalTs: 0,
    },
  }),

  getters: {
    topGainers(state): Coin[] {
      return state.coins
        .filter(
          c =>
            Number.isFinite(c.percent_change_24h) &&
            c.percent_change_24h > 0
        )
        .sort((a, b) => b.percent_change_24h - a.percent_change_24h)
        .slice(0, 5)
    },
  
    topLosers(state): Coin[] {
      return state.coins
        .filter(
          c =>
            Number.isFinite(c.percent_change_24h) &&
            c.percent_change_24h < 0
        )
        .sort((a, b) => a.percent_change_24h - b.percent_change_24h)
        .slice(0, 5)
    },
  },

  actions: {
    saveCache() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache))
    },

    loadCache() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return

      try {
        const parsed = JSON.parse(raw)

        if (parsed?.coinsTs) {
          this.cache = {
            ...this.cache,
            ...parsed,
            pages: parsed.pages || {},
          }

          if (parsed.pages?.[1]) {
            this.coins = [...parsed.pages[1]]
            this.page = 1
          }

          if (parsed.total) {
            this.total = parsed.total
          }

          if (parsed.global) {
            this.globalData = { ...parsed.global }
          }
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    },

    init() {
      this.loadCache()
    },

    async fetchCoins(page = 1, force = false): Promise<void> {
      const start = (page - 1) * this.limit

      if (
        !force &&
        this.cache.pages[page] &&
        Date.now() - this.cache.coinsTs < COINS_TTL
      ) {
        this.coins = [...this.cache.pages[page]]
        this.page = page
        return
      }

      this.loadingCoins = true
      this.errorCoins = null

      try {
        const res = await fetch(
          `https://api.coinlore.net/api/tickers/?start=${start}&limit=${this.limit}`
        )
        if (!res.ok) throw new Error('Failed to fetch coins')

        const json = await res.json()

        const mapped: Coin[] = (json.data as CoinApi[]).map((c) => ({
          id: c.id,
          name: c.name,
          symbol: c.symbol,
          image: `https://coinlore.com/img/${c.nameid}.png`,

          current_price: Number(c.price_usd),

          percent_change_24h: Number(c.percent_change_24h),
          percent_change_1h: Number(c.percent_change_1h),
          percent_change_7d: Number(c.percent_change_7d),

          market_cap: Number(c.market_cap_usd),
          volume24: Number(c.volume24),
        }))

        this.coins = mapped
        this.cache.pages[page] = mapped
        this.cache.coinsTs = Date.now()

        this.page = page
        this.total = json.info.coins_num
        this.cache.total = this.total

        this.saveCache()
      } catch (err: any) {
        this.errorCoins = err?.message || 'Failed to load coins'
      } finally {
        this.loadingCoins = false
      }
    },

    async fetchGlobalData(force = false): Promise<void> {
      if (
        !force &&
        this.cache.global &&
        Date.now() - this.cache.globalTs < GLOBAL_TTL
      ) {
        this.globalData = this.cache.global
        return
      }

      this.loadingGlobal = true
      this.errorGlobal = null

      try {
        const res = await fetch('https://api.coinlore.net/api/global/')
        if (!res.ok) throw new Error('Failed to fetch global data')

        const json = await res.json()
        const g = json[0]

        const mapped: GlobalData = {
          total_market_cap: { usd: Number(g.total_mcap) },
          total_volume: { usd: Number(g.total_volume) },
          market_cap_percentage: { btc: Number(g.btc_d) },
          market_cap_change_percentage_24h_usd: 0,
          active_cryptocurrencies: g.coins_count,
        }

        this.globalData = mapped
        this.cache.global = mapped
        this.cache.globalTs = Date.now()

        this.saveCache()
      } catch (err: any) {
        this.errorGlobal = err?.message || 'Failed to load global data'
      } finally {
        this.loadingGlobal = false
      }
    },
  },
})
