<template lang="pug">
.dict
  Tags(:biz_type="'column'")
  el-button(size="default" block class="editBtn" type="primary" @click="editColumn(null)") 添加
  el-table(:data="list")
    el-table-column(prop="biz_column_id" label="编号")
    el-table-column(label="图片" width="200px")
      template(#default="{row}")
        el-image(:src="row.logo" style="width: 100px; height: auto" :preview-src-list="[ row.logo ]" :preview-teleported="true")
    el-table-column(prop="title" label="名称")
    el-table-column( label="类型")
      template(#default="{row}")
        span(v-if =" row.biz_type == 'outlink'") 站外跳转
        span(v-if =" row.biz_type == 'tiny_app'") 内部跳转
    el-table-column(prop="outlink" label="外链")
    el-table-column(label="内部链接")
      template(#default="{row}")
        span(v-if =" row.biz_type == 'tiny_app'") {{ row.tiny_app_site_map.dict_value+row.tiny_app_site_map_params}}
    el-table-column(prop="sort" label="排序")
      template(#default="{row}")
        el-input(v-model.number="row.sort" size="small" @change="editSort(row)")
    el-table-column(prop="status" label="状态" )
      template(#default="{row}")
        el-switch(v-model="row.status" @change="editStatus(row)" :active-value="1" :inactive-value="0" inline-prompt active-text="启用" inactive-text="关闭" size="small")
    el-table-column(prop="" label="操作" width="200px")
      template(#default="{row}")
        el-button(type="primary" size="small" @click="editColumn(row)") 编辑
        el-button(type="danger" size="small" @click="deleteColumn(row)") 删除
  EditColumnDetail(v-model:show="editColumnVisible",@onClose="closeEditDict ",:id="currentId")
    </template>

<script setup>
import { onMounted, ref } from 'vue';
import { columnList, delColumn, editColumnSort, editColumnStatus } from '/@/api/xcx/column.ts';
import { ElMessage, ElMessageBox } from 'element-plus';
import EditColumnDetail from './component/EditColumnDialog.vue';
import Tags from './component/Tags.vue'

const editColumnVisible = ref(false);
const list = ref([
]);
const currentId = ref(0);
const editColumn = (row) => {
  currentId.value = 0;
  if (row) {
    currentId.value = row.biz_column_id;
  }
  editColumnVisible.value = true;
};

const closeEditDict = (refreshList) => {
  if (refreshList) getList();
  editColumnVisible.value = false;
};

const editStatus = async (row) => {
  try {
    await editColumnStatus({
      "biz_column_id": row.biz_column_id,
      "status": row.status
    });
    ElMessage.success('操作成功');
    await getList();
  } catch (error) {
    console.log(error);
  }
}

const deleteColumn = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除此栏目吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await delColumn({ biz_column_id: row.biz_column_id });
    getList();
  } catch (error) {
    console.log(error);
    ElMessage.info('已取消');
  }
}

const editSort = async (row) => {
  await editColumnSort({
    "biz_column_id": row.biz_column_id,
    "sort": Number(row.sort)
  });
  ElMessage.success('操作成功');
  getList();
}

const changeCategory = (val) => {
  console.log(val);
  type.value = val;
  getList();
}

const getList = async () => {
  const res = await columnList();
  list.value = res?.data?.items || [];
}

onMounted(async () => {
  getList();
})

</script>
<style lang="less" scoped>
.dict {
  :deep(.el-radio-button__inner) {
    border-color: #409eff !important;
    color: #409eff;
  }
}

.editBtn {
  display: block;
  margin: 5px 5px 5px auto;
  margin-left: auto;
}
</style>