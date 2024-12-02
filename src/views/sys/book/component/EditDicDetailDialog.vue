<template lang="pug">
el-drawer(:modelValue="show",:show-close="false" style="width: 50%;padding:20px" title="详情" @close="onClose(null)")
  el-form(style="margin-top:20px" label-width="120px" label-position="left")
    //- el-form-item(label="字典类型")
    //-   el-input(v-model="form.dict_type" placeholder="请输入字典类型",readonly)
    el-form-item(label="数据标签",)
      el-input(v-model="form.dictLabel" placeholder="请输入数据标签")
    el-form-item(label="备注",)
      el-input(v-model="form.remark" placeholder="请输入备注" type="textarea" :rows="4")
    el-form-item(label="字典排序",)
      el-input-number(v-model="form.dictSort" placeholder="请输入字典排序")
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
});
const form = reactive({
  dictLabel: '', dictCode: '', dictSort: 0, logo: '', remark: ''
});
onUpdated(async () => {
  console.log(show.value);
  // form.dict_type = props.dictData.dict_type;
  if (show.value && props.id) {
    const {
      dictLabel, logo, remark, dictSort,
    } = (await bookTagDetail(props.id)).data.dict;
    form.dictLabel = dictLabel;
    // form.dict_type = dict_type;
    // form.dict_value = dict_value;
    form.dictSort = dictSort;
    form.remark = remark;
    form.logo = logo;
    form.dictCode = props.id;
    console.log(form);
  }
});
const emit = defineEmits(['onClose']);
const onClose = (refreshList) => {
  form.dictLabel = '';
  // form.dict_type = '';
  // form.dict_value = '';
  form.dictSort = 0;
  form.id = '';
  form.logo = '';
  form.remark = '';
  show.value = false;
  emit('onClose', refreshList);
};
const onSave = async () => {
  const {
    dictLabel, dictSort, dictCode, logo, remark
  } = form;
  if (props.id) {
    await editBookTag({
      dict_label: dictLabel,
      dict_sort: dictSort,
      logo: imageUploader.value.fileList[0].url,
      remark,
      dict_code: dictCode
    });
  } else {
    ElMessage.error('请刷新重试');
    // 照理来说没有新增
    // await proxy.$api.system.addDictData({
    //   dictLabel, dict_type, dict_value, dictSort,
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
