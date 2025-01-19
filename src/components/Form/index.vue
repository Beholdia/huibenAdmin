<template lang="pug">
el-form(:inline="true" label-width="100px" label-position="left" class="currentForm" ref="ruleFormRef" :model="filter"
:rules="rules")
  el-form-item(v-for="item,index  in props.formList", :label="item.label"  :style="{width:item.width||'45%'}" :prop="item.key"  )
    el-input( v-model.trim = "filter[ item.key ] ", v-if="item.type === 'input'||!item.type",:placeholder="`请输入${item.label}`", clearable)
    el-select(v-model.trim="filter[item.key]"  filterable remote reserve-keyword :remote-method="remoteSeries" :loading="loading" v-if="item.type == 'remote'")
      el-option(v-for="item, in seriesOptions" :key="item" :label="item" :value="item")
    el-check-tag(v-if="item.type === 'tag'" v-for="subItem in item.options" :checked="subItem.checked" 
    @change="onChangeTag(subItem)" ) {{ subItem[item.props.label] }}
    el-select(v-model.trim="filter[ item.key ]" :placeholder="`请选择${item.label}`",clearable,v-if="item.type === 'select'" :multiple="item.multiple")
      el-option(:value="subItem[item.props?.value||'dict_code']" :label="subItem[item.props?.label||'dict_label']" v-for="subItem in item.options")
    el-divider(v-if="item.type === 'divider'")
    el-date-picker(v-model.trim="filter[ item.key ]" :placeholder="`请选择${item.label}`" type="date" v-if="item.type === 'date'")
    el-cascader(v-model.trim="filter[ item.key ]" :options="item.options" :props="item.props" :placeholder="`请选择${item.label}`" clearable,v-if="item.type === 'cascader'")
    el-input(type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" v-if="item.type === 'textarea'" v-model.trim="filter[ item.key ]" :placeholder="`请输入${item.label}`" clearable)
    Uploader(v-if="item.type === 'uploader'" :files="[filter[ item.key ] ]" ref="imageUploader" :limit="1")
  el-form-item(style="width:90%")
    div
      el-button(type="primary", @click="submitForm(ruleFormRef)"  size="large") {{btnName}}
      //- el-button(@click="emit('onAdd')",v-if="hasPermission(props.addCode)") 新增
      //- el-popconfirm(title="是否确认批量删除？"  @confirm="emit('onDelete')",v-if="props.ifDel && hasPermission(props.deleteCode)")
      //-   template(#reference)
      //-     el-button 批量删除
      slot(name="button")
    
  </template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import Uploader from '/@/components/Uploader.vue';
import { searchSeries } from '/@/api/books/index';

const imageUploader = ref(null);

const props = defineProps({
  formList: Array,
  btnName: String,
  showAdd: { type: Boolean, default: true },
});

const filter = reactive({});
const status = ref(false);
const seriesOptions = ref([]);
const loading = ref(false);

const emit = defineEmits(['onSubmit', 'onAdd', 'onDelete']);


const remoteSeries = async (query) => {
  if (query) {
    loading.value = true
    seriesOptions.value = (await searchSeries({ keyword: query })).data.series;
    if (seriesOptions.value.length == 0) seriesOptions.value = [query]
    loading.value = false
  } else {
    seriesOptions.value = []
  }
}

const rules = reactive({
  isbn: { required: true, message: '请输入ISBN', trigger: 'blur' },
  title: { required: true, message: '请输入正书名', trigger: 'blur' },
  isbn_language_cate_id: { required: true, message: '请选择语言分类', trigger: 'blur' }
});
const ruleFormRef = ref(null);
const onChangeTag = (item) => {
  item.checked = item.checked ? false : true;
}

const onSubmit = () => {
  emit('onSubmit', filter);
};
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit('onSubmit', filter, imageUploader?.value?.[0]?.fileList?.[0]?.url);
    } else {
      console.log('error submit!', fields)
    }
  })
}
onMounted(() => {

})

defineExpose({
  filter,
  onSubmit,
  ruleFormRef,
  rules,
})
</script>

<style lang="less" scoped>
.baseFilter {
  .el-select__wrapper {
    width: 200px !important;
  }

  /* display:grid; */
  /* grid-template-columns: 1fr 1fr; */
  display: flex;
  flex-wrap: wrap;
  justify-content:space-between;

}

.el-check-tag {
  margin-right: 10px;
}

.el-button--large {
  /* margin: 0 auto; */
  margin-right: 10px;
}

:deep(.el-form-item__content) {
  /* justify-content: center !important; */
}

/* :deep(.el-select__wrapper) {
  width: 200px !important;
} */
:deep(.el-form-item__content) {
  &>div {
    width: 100% !important;
  }
}
</style>