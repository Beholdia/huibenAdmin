<template lang="pug">
el-drawer(:modelValue="show",:show-close="false" style="width: 50%;padding:20px" :title="props.id? '编辑' : '添加'" @close="onClose(null)" )
  el-form(style="margin-top:20px" label-width="120px" label-position="left")
    el-form-item(label="姓名",required)
      el-input(v-model="form.name" placeholder="请输入姓名")
    el-form-item(label="电话",required)
      el-input(v-model="form.phone" placeholder="请输入电话")
    el-form-item(label="密码" required)
      el-input(v-model="form.password" placeholder="请输入密码" type="password")
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
import { storeRider, editRider, riderDetail } from '/@/api/xcx/rider.ts';
import { ElMessage } from 'element-plus';
import { checkMobile } from '/@/utils/index.js';

const show = defineModel('show', { type: Boolean, default: false })
const props = defineProps({
  id: Number,
});
const form = reactive({
  name: '',
  phone: '',
  password: '',
});
onUpdated(async () => {
  if (show.value && props.id) {
    const {
      name, phone, password
    } = (await riderDetail(props.id)).data.item;
    form.name = name;
    form.phone = phone;
    form.password = password;
  }
});
const emit = defineEmits(['onClose']);
const onClose = (refreshList) => {
  form.name = '';
  form.phone = '';
  show.value = false;
  emit('onClose', refreshList);
};
const onSave = async () => {
  const {
    name, phone, password
  } = form;
  if (!name) return ElMessage.error('请填写姓名');
  if (!checkMobile(phone)) return ElMessage.info('请输入正确的手机号');
  if (!password) return ElMessage.error('请填写密码');
  if (props.id) {
    await editRider({
      biz_rider_id: props.id, name, phone, password
    });
  } else {

    await storeRider({ name, phone, password });

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
