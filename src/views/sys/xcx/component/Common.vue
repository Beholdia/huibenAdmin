<template lang="pug">
.dict 
  Tags(:biz_type="type"  style="margin-bottom: 45px")
  .wrapper
    el-table(:data="list")
      el-table-column(label="编号" prop="dict_code")
      el-table-column(label="主题标签" prop="dict_label")
      el-table-column(label="一句话介绍" prop="remark" v-if="type === 'brand'")
      el-table-column(label="书籍数量" prop="count")
      el-table-column(label="排序" prop="dict_sort")
      el-table-column(prop="status" label="小程序显示状态" )
        template(#default="{row}")
          el-switch(v-model="row.tiny_app_status" @change="editXcxStatus(row)" active-value="1" inactive-value="0" inline-prompt active-text="启用" inactive-text="关闭" size="small")

</template>

<script setup>
import { onMounted } from 'vue';
import { bookTagList, editBookStatusTagXcx } from '/@/api/books/index.ts'
import Tags from './Tags.vue'
import { sysXcxTags } from '/@/dicts'
const props = defineProps({
  type: {
    type: String,
  }
})

const list = ref([]);

const editXcxStatus = async (row) => {
  try {
    await editBookStatusTagXcx({
      "dictCode": row.dict_code,
      "tiny_app_status": row.tiny_app_status
    });
    getList();
    ElMessage.success('修改成功');
  } catch (error) {
    console.log(error);
  }
}

const getList = async () => {
  const value = sysXcxTags.find(item => item.route === props.type).value;
  list.value = (await bookTagList(value)).data.items;
}
onMounted(async () => {
  await getList();
})
</script>

<style lang="less"></style>