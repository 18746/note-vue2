<template>
  <!-- <div>
      <img src="./assets/img/logo.png">
      <router-view />
  </div> -->
  <router-view />
</template>

<script>
import { throttle } from '@/utils/index.js';

export default {
    name: 'App',
    data() {
        return {}
    },
    computed: {
        screenSize: {
            get() {
                return this.$store.getters["habit/getHabit"].ScreenSize
            },
            set(val) {
                this.$store.commit('habit/setHabit', {
                    ScreenSize: val
                })
            }
        }
    },
    created() { },
    methods: {
        ScreenSize() {
            this.screenSize = window.document.body.offsetWidth;
        },
        screenSizeThrottle() {},
    },
    mounted() {
        this.screenSizeThrottle = throttle(this.ScreenSize, 20)
        this.$nextTick(() => {
            this.screenSizeThrottle()
        })
        
        window.addEventListener('resize', this.screenSizeThrottle, false)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.screenSizeThrottle, false)
    }
}
</script>

<style lang="less" scoped>

</style>
