<template lang="pug">
el-drawer(:modelValue="show",:show-close="false" style="padding:20px" title="修改联系地址" :close-on-press-escape="false" size="50%" :close-on-click-modal="false")
  el-form(label-width="120px" label-position="left" :model="form" style="margin-top:20px")
    el-form-item(label="收件人",required)
      el-input(v-model="form.name" placeholder="请输入收件人")
    el-form-item(label="联系电话",required)
      el-input(v-model="form.phone" placeholder="请输入联系电话")
    el-form-item(label="城市",required)
      AreaPicker(ref="areaRef" :detail ="form")
    el-form-item(label="小区",required)
      el-input(v-model="form.community" placeholder="请输入小区")
    el-form-item(label="详细地址",required)
      el-input(v-model="form.detaild_address" placeholder="请输入详细地址")
  template(#footer)
    el-button(@click="onClose(null)") 取消
    el-button(type="primary" @click="onSave") 确认
  </template>

<script setup>
import {
  onUpdated, reactive, ref, onMounted,
} from 'vue';
import { editAddress } from '/@/api/order/index.ts';
import { ElMessage, ElLoading } from 'element-plus';
import dayjs from 'dayjs';
import AreaPicker from '/@/components/AreaPicker.vue';

const imageUploader = ref(null);
const show = defineModel('show', { type: Boolean });
const props = defineProps({
  detail: Object,
  id: Number
});

const form = ref({})
const areaRef = ref(null);

onUpdated(async () => {
  if (show.value) {
    form.value = { ...props.detail };
  }
});
const emit = defineEmits(['onClose']);
const onClose = (refreshList) => {
  form.value = {};
  show.value = false;
  emit('onClose', refreshList);
};
const onSave = async () => {
  console.log(areaRef.value.data)
  const { name, phone, province_id, city_id, county_id, detaild_address, community } = form.value;// 单位为元
  if (!name || !phone || !province_id || !city_id || !county_id || !detaild_address || areaRef.value.data.length < 3 || !community) {
    return ElMessage.error('请填写完整信息');
  }
  await editAddress({
    "biz_books_order_id": props.id,
    name,
    phone,
    community,
    "province_id": areaRef.value.data[0],
    "city_id": areaRef.value.data[1],
    "county_id": areaRef.value.data[2],
    "detaild_address": detaild_address
  })
  onClose(true);
};

</script>

<style lang="less" scoped>
:deep(.el-form-item__content) {
  &>div {
    width: 100% !important;
  }
}
</style>