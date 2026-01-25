<template>
  <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-slate-400 text-sm font-medium">{{ title }}</p>
        <p class="text-2xl font-bold text-white mt-1">{{ formattedValue }}</p>
        <div v-if="change !== null" class="flex items-center gap-1 mt-2">
          <svg
            class="w-4 h-4"
            :class="change >= 0 ? 'text-emerald-400' : 'text-red-400'"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path v-if="change >= 0" d="M7 14l5-5 5 5H7z"/>
            <path v-else d="M7 10l5 5 5-5H7z"/>
          </svg>
          <span
            class="text-sm font-medium"
            :class="change >= 0 ? 'text-emerald-400' : 'text-red-400'"
          >
            {{ Math.abs(change).toFixed(2) }}%
          </span>
        </div>
      </div>
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center"
        :class="iconBgClass"
      >
        <slot name="icon">
          <svg class="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
          </svg>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    change: {
      type: Number,
      default: null
    },
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    iconColor: {
      type: String,
      default: 'amber'
    },
     
  },
  computed: {
    formattedValue() {
      return `${this.prefix}${this.value}${this.suffix}`
    },
    iconBgClass() {
      const colors = {
        amber: 'bg-amber-400/10',
        emerald: 'bg-emerald-400/10',
        blue: 'bg-blue-400/10',
        purple: 'bg-purple-400/10'
      }
      return colors[this.iconColor] || colors.amber
    }
  }
}
</script>
