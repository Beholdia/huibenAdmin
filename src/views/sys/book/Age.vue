<template lang="pug">
.dict
  el-radio-group(type="button" v-model="type")
    el-radio-button(:label="item.label" :value="item.value" v-for="item in types" size="default")
  el-button(size="default" block class="editBtn" type="primary") 添加
  el-table(:data="list")
    el-table-column(prop="dict_code" label="编号")
    el-table-column(prop="dict_label" label="年龄分类")
    //- el-table-column(prop="" label="书籍数量")
    el-table-column(prop="dict_sort" label="排序")
    el-table-column(prop="status" label="状态" )
      template(#default="{row}")
        el-switch(v-model="row.status" @change="editStatus(row)" active-value="1" inactive-value="0" inline-prompt active-text="启用" inactive-text="关闭")
    el-table-column(prop="" label="操作")
      template(#default="{row}")
        el-button(type="primary" size="small" @click="editDict(row)") 编辑
  EditDicDetail(v-model:show="editDictVisible",@onClose="closeEditDict ",:id="currentDictId")
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { bookShelfList, bookTagList, changeTagStatus } from '/@/api/books/index.ts';
import { ElMessage, ElMessageBox } from 'element-plus';
import EditDicDetail from './component/EditDicDetailDialog.vue';

const editDictVisible = ref(false);
const type = ref("isbn_age_cate");
const types = ref([{
  label: "年龄分类",
  value: "isbn_age_cate"
},
{
  label: "主题标签",
  value: "isbn_theme_tag"
},
{
  label: "特色标签",
  value: "isbn_feature_tag"
}, {
  label: "系列分类",
  value: "isbn_series_cate"
}, {
  label: "特色人物",
  value: "isbn_featured_character"
}, {
  label: "知名品牌",
  value: "isbn_wellknow_brand"
}, {
  label: "书架号",
  value: "book_warehouse"
}
]);
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
  console.log(editDictVisible.value,currentDictId.value);
};

const closeEditDict = (refreshList) => {
  if (refreshList) getList();
  editDictVisible.value = false;
};

const editStatus = async (row) => {
  console.log(row);
  // todo

  try {
    //   await ElMessageBox.confirm(`确定修改状态吗？`, '提示', {
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   type: 'warning',
    // })

    await changeTagStatus({
      "dictCode": row.dict_code,
      "status": row.status ? 0 : 1
    });
    getList();
  } catch (error) {
    console.log(error);
    row.status = row.status ? 0 : 1;
  }
}

const getList = async () => {
  const res = await bookTagList(type.value);
  list.value = res?.data?.items || [];
}

onMounted(async () => {
  const res = await bookTagList('isbn_age_cate');
  list.value = res?.data?.items || [];
})

</script>
<style lang="less" scoped>
.dict {
  :deep(.el-radio-button__inner) {
    border-color: #409eff !important;
    color: #409eff;
  }
}
.editBtn{
  display: block;
    margin: 5px 5px 5px auto;
    margin-left: auto;
}
</style>