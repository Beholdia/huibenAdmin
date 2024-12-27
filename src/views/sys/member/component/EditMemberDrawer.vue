<template lang="pug">
el-drawer(:modelValue="show",:show-close="false" style="padding:20px" :title="props.id? '修改' : '新增'" @close="onClose(null)"  size="50%")
  el-form(style="margin-top:20px" label-width="150px" label-position="left")
    el-form-item(label="会员类别名称",)
      el-input(v-model="form.main_title" placeholder="请输入会员类别名称")
    el-form-item(label="子类别",)
      el-input(v-model="form.sub_title" placeholder="请输入")
    el-form-item(label="有效期天数",)
      el-input-number(v-model="form.valid_days" placeholder="请输入有效期天数")
    el-form-item(label="原价",)
      el-input-number(v-model="form.original_price" placeholder="请输入原价")
    el-form-item(label="优惠价",)
      el-input-number(v-model="form.special_price" placeholder="请输入优惠价")
    el-form-item(label="共计可借数量",)
      el-input-number(v-model="form.borrow_books_limit" placeholder="请输入")
    el-form-item(label="单次可借数量",)
      el-input-number(v-model="form.once_borrow_books_limit" placeholder="请输入")
    el-form-item(label="邀请返现次数",)
      el-input-number(v-model="form.share_reward_cash_back_times" placeholder="请输入")
    el-form-item(label="会员样式",)
      el-select(v-model="form.style" placeholder="请输入会员样式")
        el-option(label="gold" value="gold")
        el-option(label="black" value="black")
    el-form-item(label="显示于小程序",)
      el-switch(v-model="form.tiny_app_enable" active-text="是" inactive-text="否" disabled :active-value="1" :inactive-value="0")
    el-form-item(label="会员描述",)
      el-input(v-model="form.summary" placeholder="请输入会员描述" type="textarea")
    el-form-item(label="会员权益",)
      el-input(v-model="form.desc" placeholder="请输入会员权益" type="textarea" rows="6")
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
  valid_days: 0,
  original_price: 0,
  special_price: 0,
  borrow_books_limit: 0,
  desc: '',
  main_title: '',
  once_borrow_books_limit: 0,
  share_reward_cash_back_times: 0,
  style: 'glod',
  sub_title: '',
  summary: '',
  tiny_app_enable: 1
});
onUpdated(async () => {
  if (show.value && props.id) {
    const {
      valid_days, original_price, special_price, borrow_books_limit, desc, main_title, once_borrow_books_limit, share_reward_cash_back_times, style, sub_title, summary, tiny_app_enable,
    } = (await vipDetail(props.id)).data.item;
    form.valid_days = valid_days;
    form.original_price = original_price / 100;
    form.special_price = special_price / 100;
    form.borrow_books_limit = borrow_books_limit;
    form.desc = desc;
    form.main_title = main_title;
    form.once_borrow_books_limit = once_borrow_books_limit;
    form.share_reward_cash_back_times = share_reward_cash_back_times;
    form.style = style;
    form.sub_title = sub_title;
    form.summary = summary;
    form.tiny_app_enable = tiny_app_enable;
  }
});
const emit = defineEmits(['onClose']);
const onClose = (refreshList) => {
  form.valid_days = 0;
  form.original_price = 0;
  form.special_price = 0;
  form.borrow_books_limit = 0;
  form.desc = '';
  form.main_title = '';
  form.once_borrow_books_limit = 0;
  form.share_reward_cash_back_times = 0;
  form.style = 'glod';
  form.sub_title = '';
  form.summary = '';
  form.tiny_app_enable = 1;
  show.value = false;
  emit('onClose', refreshList);
};
const onSave = async () => {
  const {
    valid_days, original_price, special_price, borrow_books_limit, desc, main_title, once_borrow_books_limit, share_reward_cash_back_times, style, sub_title, summary, tiny_app_enable,
  } = form;
  if (props.id) {
    await editVip({
      biz_vip_id: props.id, valid_days, original_price: original_price * 100, special_price: special_price * 100,
      borrow_books_limit,// 不可修改
      once_borrow_books_limit,// 不可修改
      tiny_app_enable,// 不可修改
      summary,// 不可修改
      desc, main_title,
      share_reward_cash_back_times, style, sub_title,
    });
  } else {

    await storeVip({ valid_days, original_price: original_price * 100, special_price: special_price * 100, borrow_books_limit, desc, main_title, once_borrow_books_limit, share_reward_cash_back_times, style, sub_title, summary, tiny_app_enable, })
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
