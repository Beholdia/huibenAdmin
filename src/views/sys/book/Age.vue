<template lang="pug">
Common(v-model:type="type")
</template>

<script setup>
import Common from './component/Common.vue'

const type = ref('age')
</script>

<style lang="less"></style>