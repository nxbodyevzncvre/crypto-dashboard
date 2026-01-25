import { defineStore } from 'pinia'

export interface PortfolioItem {
  id: string
  name: string
  symbol: string
  image: string

  amount: number
  buyPrice: number
  createdAt: number
}

const STORAGE_KEY = 'crypto-portfolio'

export const usePortfolioStore = defineStore('portfolio', {
  state: () => ({
    items: [] as PortfolioItem[],
  }),

  getters: {
    totalInvested(state): number {
      return state.items.reduce(
        (sum, item) => sum + item.amount * item.buyPrice,
        0
      )
    },
  },

  actions: {
    load() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        this.items = JSON.parse(raw)
      }
    },

    save() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(this.items)
      )
    },

    addCoin(
      coin: {
        id: string
        name: string
        symbol: string
        image: string
      },
      amount: number,
      buyPrice: number
    ) {
      const existing = this.items.find(
        i => i.symbol.toLowerCase() === coin.symbol.toLowerCase()
      )
    

      if (existing) {
        const totalAmount =
          existing.amount + amount
    
        const totalCost =
          existing.amount * existing.buyPrice +
          amount * buyPrice
    
        existing.buyPrice = totalCost / totalAmount
        existing.amount = totalAmount
    
        this.save()
        return
      }
    

      this.items.push({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        amount,
        buyPrice,
        createdAt: Date.now(),
      })
    
      this.save()
    },
    

    remove(index: number) {
      this.items.splice(index, 1)
      this.save()
    },
  },
})
