<template lang="pug">
el-drawer(:modelValue="show",:show-close="false" style="width: 50%;padding:20px" title="详情")
  el-form(style="margin-top:20px")
    //- el-form-item(label="字典类型")
    //-   el-input(v-model="form.dict_type" placeholder="请输入字典类型",readonly)
    el-form-item(label="数据标签",required)
      el-input(v-model="form.dictLabel" placeholder="请输入字典名称")
    el-form-item(label="数据键值",required)
      el-input(v-model="form.dict_value" placeholder="请输入字典键值")
    el-form-item(label="字典排序",required)
      el-input-number(v-model="form.dictSort" placeholder="请输入字典排序")
  template(#footer)
    el-button(@click="onClose") 取消
    el-popconfirm(title="确认提交？",@confirm="onSave")
      template(#reference)
        el-button(type="primary") 确认
</template>

<script setup>
import {
  onUpdated, reactive, ref, getCurrentInstance,defineModel
} from 'vue';
import {bookTagDetail } from '/@/api/books/index.ts';

const show = defineModel('show',{type:Boolean,default:false})
const props = defineProps({
  id: Number,
});
const form = reactive({
  dictLabel: '',  dictCode: '', dictSort: 0,logo:'',remark:''
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
    form.remark=dictSort;
    form.logo=logo;
    form.dictCode = props.id;
  }
});
const emit = defineEmits(['onClose']);
const onClose = (refreshList) => {
  form.dictLabel = '';
  // form.dict_type = '';
  // form.dict_value = '';
  form.dictSort = 0;
  form.id = '';
  form.logo='';
  form.remark='';
  show.value = false;
  emit('onClose', refreshList);
};
const onSave = async () => {
  const {
    dictLabel, dict_type, id, dict_value, dictSort,
  } = form;
  if (form.id) {
    await proxy.$api.system.editDictData({
      dictLabel, dict_type, id, dict_value, dictSort,
    });
  } else {
    await proxy.$api.system.addDictData({
      dictLabel, dict_type, dict_value, dictSort,
    });
  }
  onClose(true);
};
</script>

<style lang="less"></style>
