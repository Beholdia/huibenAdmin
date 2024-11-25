<template lang="pug">
el-form(:inline="true" label-width="100px" label-position="left" class="currentForm")
  el-form-item(v-for="item,index  in props.formList", :label="item.label")
    el-input( v-model.trim = "filter[ item.key ] ", v-if="item.type === 'input'||!item.type",:placeholder="`请输入${item.label}`", clearable)

    el-select(v-model.trim="filter[ item.model ]" :placeholder="`请选择${item.label}`",clearable,v-if="item.type === 'select'")
      el-option(:value="subItem[item.props.value]" :label="subItem[item.props.label]" v-for="subItem in item.options")

    el-cascader(v-model.trim="filter[ item.model ]" :options="item.options" :props="item.props" :placeholder="`请选择${item.label}`" clearable,v-if="item.type === 'cascader'")

  //- el-form-item
    el-button(type="primary", @click="getList") 查询
    el-button(@click="emit('onAdd')",v-if="hasPermission(props.addCode)") 新增
    el-popconfirm(title="是否确认批量删除？"  @confirm="emit('onDelete')",v-if="props.ifDel && hasPermission(props.deleteCode)")
      template(#reference)
        el-button 批量删除
    slot(name="button")
  
  </template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
  formList: Array,
});

const filter = reactive({});

const emit = defineEmits(['onFilter', 'onAdd', 'onDelete']);
const getList = () => {
  emit('onFilter', filter);
};
</script>

<style lang="less" scoped>
.baseFilter {
  .el-select__wrapper {
    width: 200px !important;
  }

  display:grid;
  grid-template-columns: 1fr 1fr;
  justify-content:space-between;
}

:deep(.el-select__wrapper) {
  width: 200px !important;
}
</style>