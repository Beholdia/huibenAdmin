<template lang="pug">
el-form(:inline="true" label-width="100px" label-position="left" class="currentForm" ref="ruleFormRef" :model="filter"
:rules="rules")
  el-form-item(v-for="item,index  in props.formList", :label="item.label"  :style="{width:item.width||'45%'}" :prop="item.key"  )
    el-input( v-model.trim = "filter[ item.key ] ", v-if="item.type === 'input'||!item.type",:placeholder="`请输入${item.label}`", clearable)
    //- el-check-tag(checked v-if="item.type === 'tag'" v-for="i in 5") checked
    el-check-tag(v-if="item.type === 'tag'" v-for="subItem in item.options" :checked="subItem.checked" 
    @change="onChangeTag(subItem)" ) {{ subItem[item.props.label] }}
    el-select(v-model.trim="filter[ item.key ]" :placeholder="`请选择${item.label}`",clearable,v-if="item.type === 'select'" :multiple="item.multiple")
      el-option(:value="subItem[item.props?.value||'dict_code']" :label="subItem[item.props?.label||'dict_label']" v-for="subItem in item.options")
    el-divider(v-if="item.type === 'divider'")
    el-cascader(v-model.trim="filter[ item.key ]" :options="item.options" :props="item.props" :placeholder="`请选择${item.label}`" clearable,v-if="item.type === 'cascader'")
    el-input(type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" v-if="item.type === 'textarea'" v-model.trim="filter[ item.key ]" :placeholder="`请输入${item.label}`" clearable)
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
import { reactive, ref } from 'vue';

const props = defineProps({
  formList: Array,
  btnName: String,
  showAdd: { type: Boolean, default: true },
});

const filter = reactive({});
const status = ref(false);

const emit = defineEmits(['onSubmit', 'onAdd', 'onDelete']);

const rules = reactive({
  isbn: { required: true, message: '请输入ISBN', trigger: 'blur' },
  isbn_language_cate_id: { required: true, message: '请选择语言分类', trigger: 'blur' }
});
// const ruleForm = reactive({ isbn: '' });
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
      console.log('submit!');
      emit('onSubmit', filter);
    } else {
      console.log('error submit!', fields)
    }
  })
}
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
</style>