import { createRouter, createWebHistory } from "vue-router"
import DashboardView from "../views/DashboardView.vue"
import CoinsView from "../views/CoinsView.vue"
import CoinDetailView from "../views/CoinDetailView.vue"
import PortfolioView from "../views/PortfolioView.vue"
import NewsView from "../views/NewsView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: DashboardView,
    },
    {
      path: "/coins",
      name: "coins",
      component: CoinsView,
    },
    {
      path: "/coin/:id",
      name: "coin-detail",
      component: CoinDetailView,
    },
    {
      path: "/portfolio",
      name: "portfolio",
      component: PortfolioView,
    },
    {
      path: "/news",
      name: "news",
      component: NewsView,
    },
  ],
})

export default router
