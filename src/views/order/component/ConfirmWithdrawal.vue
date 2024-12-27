<template lang="pug">
el-dialog(title="选择退款方式" v-model="show" width="30%" :close-on-click-modal="false" :close-on-press-escape="false")
  el-form(label-width="100px")
    el-form-item(label="退款方式")
      //- el-checkbox-group(v-model="refundType") todo这里禁用要判断
      div
        el-checkbox(label="1" border :disabled="false" v-model="vip_status") 会员费{{ detail.vip_price*100 }}
        el-checkbox(label="2" border v-model="deposit_status") 书籍押金 {{ detail.deposit_price*100 }}
  template(#footer)
    el-button(@click="show = false") 取消
    el-button(type="primary" @click="submit") 确定
</template>

<script setup>
import { onUpdated } from 'vue';
import { paylist, refund, withdrawallist, confirmWithdrawal } from '/@/api/order/index.ts';

const props = defineProps({
  detail: {
    type: Object,
    default: () => { }
  }
})
const show = defineModel('show', { type: Boolean, default: false })

const detail = ref({});
const deposit_status = ref(false);
const vip_status = ref(false);

const submit = async () => {
  await refund({
    "biz_order_id": detail.value.biz_order_id,
    "deposit_status": deposit_status.value ? "returned" : "not_return", // 已退款，未退款 returned,not_return
    "vip_status": vip_status.value ? "returned" : "not_return" // 已退款，未退款 returned,not_return
  })
}

onUpdated(() => {
  if (show.value) {
    detail.value = props.detail;
    console.log(detail.value);
  }
})
</script>

<style lang="less"></style>