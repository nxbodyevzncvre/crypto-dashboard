import { defineStore } from 'pinia'

export interface Coin {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  price_change_percentage_24h: number
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


    cache: {
      coins: null as Coin[] | null,
      coinsTs: 0,

      global: null as GlobalData | null,
      globalTs: 0,
    },
  }),

  getters: {
    topGainers(state): Coin[] {
      return [...state.coins]
        .sort(
          (a, b) =>
            b.price_change_percentage_24h -
            a.price_change_percentage_24h
        )
        .slice(0, 5)
    },

    topLosers(state): Coin[] {
      return [...state.coins]
        .sort(
          (a, b) =>
            a.price_change_percentage_24h -
            b.price_change_percentage_24h
        )
        .slice(0, 5)
    },
  },

  actions: {

    saveCache(){
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache))
    },
    
    loadCache(){
      const raw = localStorage.getItem(STORAGE_KEY)
      if(!raw) return

      try{
        const parsed = JSON.parse(raw)

        if(parsed?.coinsTs){
          this.cache = parsed
        }
      }catch(err){
        localStorage.removeItem(STORAGE_KEY)
      }
    },

    async fetchCoins(force = false): Promise<void> {
      if (
        !force &&
        this.cache.coins &&
        Date.now() - this.cache.coinsTs < COINS_TTL
      ) {
        this.coins = [...this.cache.coins]
        return
      }

      this.loadingCoins = true
      try {
        const res = await fetch(
          'https://api.coinlore.net/api/tickers/?limit=20'
        )
        if (!res.ok) return

        const json = await res.json()

        const mapped: Coin[] = json.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          symbol: c.symbol,
          image: `https://coinlore.com/img/${c.nameid}.png`,
          current_price: Number(c.price_usd),
          price_change_percentage_24h: Number(c.percent_change_24h),
        }))

        this.coins = [...mapped]
        this.cache.coins = [...mapped]
        this.cache.coinsTs = Date.now()
        this.saveCache()
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
      try{
        const res = await fetch(
        'https://api.coinlore.net/api/global/'
      )
      if (!res.ok) return

      const json = await res.json()
      const g = json[0]

      const mapped: GlobalData = {
        total_market_cap: {
          usd: Number(g.total_mcap),
        },
        total_volume: {
          usd: Number(g.total_volume),
        },
        market_cap_percentage: {
          btc: Number(g.btc_d),
        },
        market_cap_change_percentage_24h_usd: 0, 
        active_cryptocurrencies: g.coins_count,
      }

      this.globalData = {...mapped}
      this.cache.global = {...mapped}
      this.cache.globalTs = Date.now()
      this.saveCache()

      }catch(err : any){
        this.errorGlobal = err?.message || 'Error while getting global data'
      }finally{
        this.loadingGlobal = false
      }
      
    },
    init(){
      this.loadCache()
    }
  },
})
