<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div
      class="animate-spin rounded-full border-2 border-slate-700"
      :class="[sizeClass, 'border-t-amber-400']"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    fullScreen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    sizeClass() {
      const sizes = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
      }
      return sizes[this.size]
    },
    containerClass() {
      return this.fullScreen ? 'min-h-[60vh]' : 'py-8'
    }
  }
}
</script>
