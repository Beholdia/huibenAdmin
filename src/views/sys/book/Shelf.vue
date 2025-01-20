<template lang="pug">
.dict
  Tags(biz_type="shelf")
  //- .group
    el-radio-group(type="button" v-model="type" @change="changeCategory")
      el-radio-button(:label="item.label" :value="item.route" v-for="item in types" size="default")
  el-button(size="default" block class="editBtn" type="primary" @click="addShelf") 添加
  el-table(:data="list")
    el-table-column(prop="biz_bookshelf_id" label="编号")
    el-table-column(prop="name" label="分类")
      template(#default="{row}")
        el-input(v-model="row.name" @change="changeName(row)" size="small")
    el-table-column(prop="count" label="书籍数量")
    el-table-column(prop="status" label="状态" )
      template(#default="{row}")
        el-switch(v-model="row.status" @change="editStatus(row)" :active-value="1" :inactive-value="0" inline-prompt active-text="启用" inactive-text="关闭" size="small")
    el-table-column(prop="" label="操作" width="200px")
      template(#default="{row}")
        //- el-button(type="primary" size="small" @click="editDict(row)") 编辑
        el-button(type="danger" size="small" @click="deleteDict(row)") 删除
  el-pagination(@current-change="val => getList(val)" background layout="prev, pager, next" :total="total" style="justify-content: center;margin-top: 20px", :page-size="limit")
  EditDicDetail(v-model:show="editDictVisible",@onClose="closeEditDict ",:id="currentDictId")
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { bookShelfList, deleteBookShelf, editBookShelf, editBookShelfStatus, addBookShelf } from '/@/api/books/index.ts';
import { ElMessage, ElMessageBox } from 'element-plus';
import EditDicDetail from './component/EditDicDetailDialog.vue';
import Tags from './component/Tags.vue';

const editDictVisible = ref(false);

const page = ref(1);
const total = ref(0);
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
  try {
    await editBookShelfStatus({
      "biz_bookshelf_id": row.biz_bookshelf_id,
      "status": row.status
    });
    ElMessage.success('修改成功');
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
    await deleteBookShelf(row.biz_bookshelf_id);
    getList();
  } catch (error) {
    console.log(error);
    ElMessage.error('已取消');
  }
}
const changeName = async (row) => {
  try {
    await editBookShelf({
      "biz_bookshelf_id": row.biz_bookshelf_id,
      "name": row.name
    })
    ElMessage.success('修改成功');
  } catch (error) {
    console.log(error);
  }
}

const addShelf = async () => {
  try {
    const res = await ElMessageBox.prompt('请输入书架号', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    })
    await addBookShelf(
      {
        "name": res.value,
        "status": "1"
      }
    )
    getList();
  } catch (error) {
    console.log(error);
  }

}
const editSort = async (row) => {
  console.log(row);
  await editBookTagSort({
    "dict_code": row.dict_code,
    "sort": row.dict_sort
  });
}
// const clear = () => {

// }
const changeCategory = (val) => {
  // console.log(val);
  // type.value = val;
  // getList();
  router.push({ name: 'sysbook' + val })

}

const getList = async (pageNum) => {
  if (pageNum) page.value = pageNum;
  const res = await bookShelfList({ page: page.value, limit: 10 });
  list.value = res?.data?.items || [];
  total.value = res?.data?.total || 0;
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

.group {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>