<template lang="pug">
el-drawer(:modelValue="show",:show-close="false" style="width: 50%;padding:20px" :title=" id? '编辑' :'添加'" @close="onClose(null)")
  el-form(style="margin-top:20px" label-width="120px" label-position="left" )
    el-form-item(:label="label",required)
      el-input(v-model="form.dict_label" :placeholder="`请输入${label}`")
    el-form-item(label="排序",)
      el-input-number(v-model="form.dict_sort" placeholder="请输入排序")
    el-form-item(label="一句话介绍",)
      el-input(v-model="form.remark" placeholder="一句话介绍" type="textarea" :rows="4")
    el-form-item(label="logo",)
      Uploader(:files="[form.logo ]" ref="imageUploader" :limit="1")
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
import { bookTagDetail, editBookTag } from '/@/api/books/index.ts';
import { ElMessage } from 'element-plus';
import Uploader from '/@/components/Uploader.vue';

const imageUploader = ref(null);

const show = defineModel('show', { type: Boolean, default: false })
const props = defineProps({
  id: Number,
  label: { type: String, default: '分类名称' },
});
const form = reactive({
  dict_label: '', dict_code: '', dict_sort: 0, logo: '', remark: ''
});
onUpdated(async () => {
  // form.dict_type = props.dictData.dict_type;
  if (show.value && props.id) {
    const {
      dict_label, logo, remark, dict_sort,
    } = (await bookTagDetail(props.id)).data.dict;
    form.dict_label = dict_label;
    // form.dict_type = dict_type;
    // form.dict_value = dict_value;
    form.dict_sort = dict_sort;
    form.remark = remark;
    form.logo = logo;
    form.dict_code = props.id;
  } else {
    form.dict_label = '';
    form.dict_sort = 0;
    form.logo = '';
    form.remark = '';
    form.dict_code = '';
  }
});
const emit = defineEmits(['onClose']);
const onClose = (refreshList) => {
  form.dict_label = '';
  // form.dict_type = '';
  // form.dict_value = '';
  form.dict_sort = 0;
  form.id = '';
  form.logo = '';
  form.remark = '';
  show.value = false;
  emit('onClose', refreshList);
};
const onSave = async () => {
  if (!form.dict_label) return ElMessage.info(`请输入${props.label}`);
  const {
    dict_label, dict_sort, dict_code, remark
  } = form;
  if (props.id) {
    await editBookTag({
      dict_label: dict_label,
      dict_sort: dict_sort,
      logo: imageUploader.value.fileList?.[0]?.url,
      remark,
      dict_code: dict_code
    });
  } else {
    ElMessage.error('请刷新重试');
    // 照理来说没有新增
    // await proxy.$api.system.addDictData({
    //   dict_label, dict_type, dict_value, dict_sort,
    // });
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
