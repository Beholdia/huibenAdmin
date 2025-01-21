<template lang="pug">
el-form(inline)
  el-form-item(
    v-for="item, index in props.filterList"
    :label="item.label"
    label-width="80px"
    label-position="left",
  )
    el-input(
      v-model.trim="form[ item.model ]"
      v-if="item.type === 'input'"
      :placeholder="`请输入${item.placeholder||item.label.replace(/:$/, '')}`"
      clearable
    )

    el-select(
      v-model="form[ item.model ]"
      :placeholder="`请选择${item.label}`"
      clearable
      v-if="item.type === 'select'"
      :style="{ width: item.width }"
    )
      el-option(
        :value="subItem.value"
        :label="subItem.label"
        v-for="subItem in item.options"
      )

    el-select(
      v-model="form[ item.model ]"
      :placeholder="`请选择${item.label}`"
      clearable
      filterable
      remote
      remote-show-suffix
      v-if="item.type === 'remoteSelect'"
      :style="{ width: item.width }"
      :loading="item.loading"
      :remote-method="item.remoteMethod"
    )
      el-option(
        :value="subItem.id"
        :label="subItem.name"
        v-for="subItem in item.list"
      )

    el-cascader(
      v-model="form[ item.model ]"
      :options="item.options"
      :props="item.props"
      :placeholder="`请选择${item.label}`"
      clearable
      v-if="item.type === 'cascader'"
    )
    //- AreaPicker(
    //-   v-if="item.type === 'area'"
    //-   :isTown="item.isTown"
    //-   ref="area"
    //-   :isFilter="true"
    //- )

  el-form-item
    el-button(@click="getList" type="primary") 查询
    el-popconfirm(title="是否确认批量删除？" @confirm="emit('onBatchDel')", v-if="props.batchDel")
      template(#reference)
        el-button(type="danger") 批量删除
    slot(name="button")
  el-form-item(style="width:500px")
    slot(name="button2")
    

</template>

<script setup>
import { reactive, ref } from 'vue';
// import AreaPicker from '@/components/AreaPicker.vue';

const props = defineProps({
  filterList: Array,
  batchDel: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['onFilter', 'onAdd', 'onBatchDel']);
const form = defineModel('form', {
  type: Object,
  default: () => ({}),
});

const area = ref(null);

const getList = () => {
  emit('onFilter');
};

defineExpose({
  area,
});
</script>

<style lang="less" scoped>
// :deep(.el-select__wrapper) {
//   width: 200px !important;
// }
.el-form {
  // display: grid;
  // grid-template-columns: 1fr 1fr 1fr;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}

.el-form-item {
  width: 285px;
  margin-bottom: 0 !important;
}

.el-form.el-form--inline .el-form-item--large.el-form-item:last-of-type {
  margin-bottom: 0px !important;
}
</style>
