<template lang="pug">
.zhifu
  .group
    el-radio-group(type="button" v-model="type" )
      el-radio-button(:label="item.label" :value="item.value" v-for="item in tabs" size="large")
  Zhifu(v-show="type == 'pay'")
  Widthdrawal(v-show="type == 'widthdrawal'")
</template>

<script setup>
import Zhifu from './Zhifu.vue'
import Widthdrawal from './Widthdrawal.vue'

const type = ref('pay')
const tabs = [{ label: '支付订单', value: 'pay' }, { label: '提现订单', value: 'widthdrawal' }]
</script>

<style lang="less" scoped>
.group {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  // background: #fff;
}
</style>