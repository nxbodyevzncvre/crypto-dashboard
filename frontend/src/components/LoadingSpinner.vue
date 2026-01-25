<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div
      class="animate-spin rounded-full border-2 border-slate-700"
      :class="[sizeClass, 'border-t-amber-400']"
    ></div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

type SpinnerSize = 'sm' | 'md' | 'lg'

export default defineComponent({
  name: 'LoadingSpinner',

  props: {
    size: {
      type: String as PropType<SpinnerSize>,
      default: 'md'
    },

    fullScreen: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    sizeClass(): string {
      const sizes: Record<SpinnerSize, string> = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
      }

      return sizes[this.size]
    },

    containerClass(): string {
      return this.fullScreen ? 'min-h-[60vh]' : 'py-8'
    }
  }
})
</script>

