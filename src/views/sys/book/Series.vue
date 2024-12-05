<template lang="pug">
Common(v-model:type="type")
</template>

<script setup>
import Common from './component/Common.vue'

const type = ref('series')
</script>

<style lang="less"></style>