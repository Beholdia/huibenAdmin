<template lang="pug">
.dict
  Tags(:biz_type="type" )
  //- .group
    el-radio-group(type="button" v-model="type" @change="changeCategory")
      el-radio-button(:label="item.label" :value="item.route" v-for="item in types" size="default")
  el-button(size="default" block class="editBtn" type="primary") 添加
  el-table(:data="list")
    el-table-column(prop="dict_code" label="编号")
    el-table-column(prop="dict_label" :label="label")
    el-table-column(prop="dict_label" label="人物图标" v-if="type === 'character'")
      template(#default="{row}")
        el-image(:src="row.logo" :preview-src-list = " [ row.logo ] " :preview-teleported="true" style="width: 100px; height: 100px")
    el-table-column(prop="count" label="书籍数量")
    el-table-column(prop="dict_sort" label="排序")
      template(#default="{row}")
        el-input-number(v-model.number="row.dict_sort" size="small" @change="editSort(row)")
    el-table-column(prop="status" label="状态" )
      template(#default="{row}")
        el-switch(v-model="row.status" @change="editStatus(row)" active-value="1" inactive-value="0" inline-prompt active-text="启用" inactive-text="关闭" size="small")
    el-table-column(prop="status" label="小程序状态" )
      template(#default="{row}")
        el-switch(v-model="row.tiny_app_status" @change="editXcxStatus(row)" active-value="1" inactive-value="0" inline-prompt active-text="启用" inactive-text="关闭" size="small")
    el-table-column(prop="" label="操作" width="200px")
      template(#default="{row}")
        el-button(type="primary" size="small" @click="editDict(row)") 编辑
        el-button(type="danger" size="small" @click="deleteDict(row)") 删除
  EditDicDetail(v-model:show="editDictVisible",@onClose="closeEditDict ",:id="currentDictId" :label="label")
  </template>

<script setup>
import { onMounted, ref } from 'vue';
import { bookShelfList, bookTagList, changeTagStatus, editBookTagSort, deleteBookTag, editBookStatusTagXcx } from '/@/api/books/index.ts';
import { ElMessage, ElMessageBox } from 'element-plus';
import EditDicDetail from './EditDicDetailDialog.vue';
import { useRouter } from 'vue-router';
import Tags from './Tags.vue';
import { sysBookTags } from '/@/dicts'

const router = useRouter();
const editDictVisible = ref(false);
// const type = ref("isbn_age_cate");// 默认为年龄分类
// const props = defineProps({
//   dict_type: {
//     type: String,
//     default: 'theme'
//   }
// })
const type = defineModel('type', {
  type: String,
}
)
const label = ref('');

const list = ref([
]);
const currentDictId = ref(0);
const editDict = (row) => {
  console.log(row);
  currentDictId.value = 0;
  if (row) {
    currentDictId.value = row.dict_code;
  }
  editDictVisible.value = true;
  console.log(editDictVisible.value, currentDictId.value);
};

const closeEditDict = (refreshList) => {
  if (refreshList) getList();
  editDictVisible.value = false;
};

const editStatus = async (row) => {
  console.log(row);
  // todo

  try {
    await changeTagStatus({
      "dictCode": row.dict_code,
      "status": row.status
    });
    ElMessage.success('修改成功');
    await getList();
  } catch (error) {
    console.log(error);
    // row.status = row.status ? 0 : 1;
  }
}
const editXcxStatus = async (row) => {
  console.log(row);

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

const deleteDict = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除此分类吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteBookTag(row.dict_code);
    getList();
  } catch (error) {
    console.log(error);
    ElMessage.error('已取消');
  }
}

const editSort = async (row) => {
  console.log(row);
  await editBookTagSort({
    "dict_code": row.dict_code,
    "sort": row.dict_sort
  });
  ElMessage.success('修改成功');
  await getList();
}

const changeCategory = (val) => {
  // type.value = val;
  // getList();
  router.push({ name: 'sysbook' + val })
}


const getList = async () => {
  const params = sysBookTags.find(item => item.route === type.value).value;
  const res = await bookTagList(params);
  list.value = res?.data?.items || [];
}

onMounted(async () => {
  await getList();
  console.log(type.value);
  label.value = sysBookTags.find(item => item.route === type.value).label;
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

.group {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>