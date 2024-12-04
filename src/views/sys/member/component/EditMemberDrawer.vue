<template lang="pug">
el-drawer(:modelValue="show",:show-close="false" style="width: 50%;padding:20px" :title="props.id? '修改' : '新增'" @close="onClose(null)" )
  el-form(style="margin-top:20px" label-width="120px" label-position="left")
    el-form-item(label="会员类别名称",)
      el-input(v-model="form.title" placeholder="请输入会员类别名称")
    el-form-item(label="有效期天数",)
      el-input-number(v-model="form.valid_days" placeholder="请输入有效期天数")
    el-form-item(label="原价",)
      el-input-number(v-model="form.original_price" placeholder="请输入原价")
    el-form-item(label="优惠价",)
      el-input-number(v-model="form.special_price" placeholder="请输入优惠价")
  template(#footer)
    el-button(@click="onClose") 取消
    el-popconfirm(title="确认提交？",@confirm="onSave")
      template(#reference)
        el-button(type="primary") 确认
</template>

<script setup>
import {
  onUpdated, reactive, ref, getCurrentInstance, defineModel, computed
} from 'vue';
import { storeVip, editVip, vipDetail } from '/@/api/member/index.ts';
import { ElMessage } from 'element-plus';
import Uploader from '/@/components/Uploader.vue';

const imageUploader = ref(null);

const show = defineModel('show', { type: Boolean, default: false })
const props = defineProps({
  id: Number,
});
const form = reactive({
  title: '',
  valid_days: 0,
  original_price: 0,
  special_price: 0,
});
onUpdated(async () => {
  if (show.value && props.id) {
    const {
      title, valid_days, original_price, special_price
    } = (await vipDetail(props.id)).data.dict;
    form.title = title;
    form.valid_days = valid_days;
    form.original_price = original_price;
    form.special_price = special_price;
  }
});
const emit = defineEmits(['onClose']);
const onClose = (refreshList) => {
  form.title = '';
  form.valid_days = 0;
  form.original_price = 0;
  form.special_price = 0;
  show.value = false;
  emit('onClose', refreshList);
};
const onSave = async () => {
  const {
    title, valid_days, original_price, special_price
  } = form;
  if (props.id) {
    await editVip({
      biz_vip_id: props.id, title, valid_days, original_price, special_price
    });
  } else {

    await storeVip({ title, valid_days, original_price, special_price })

  }
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
