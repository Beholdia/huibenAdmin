<template lang="pug">
.list
  .filter
    BaseFilter(:filterList="filterList" @onFilter="onFilter" v-model:form="form" ref="filter")
      template(#button)
        el-button(type="primary", @click="changeSaleStatusAll('on_sale')") 批量上架
        el-button(type="primary", @click="changeSaleStatusAll('off_sale')") 批量下架
  .wrapper
    .huibenStatistic 共有书籍{{statistics?.count_total}}本，借出{{statistics?.count_borrowed}}本，可借{{statistics?.count_available}}本
    el-table(:data="list" style="width: 100%",@selection-change="handleSelectionChange")
      el-table-column(type="selection" width="55")
      el-table-column(prop="id" label="序号" width="100")
      el-table-column( label="封面" width="100")
        template(#default="{row}")
          //- img.cover(:src="url+row.pic")
          img.cover(:src="row.pic" v-if="row.pic")
          p(v-else) 暂无封面
      el-table-column(prop="name" label="书名" )
      el-table-column(prop="isbn" label="ISBN号")
      el-table-column(prop="collection_no" label="馆藏书号")
      //- el-table-column(prop="book_shelf.name" label="书架号")
      el-table-column( label="借阅记录" width="100")
        template(#default="{row}")
          el-button(link disabled v-if="row.borrow_times == 0" )  {{row.borrow_times}}
          el-button(link type="primary" v-else @click="showBorrowRecord(row)") {{row.borrow_times}}
      el-table-column( label="借阅状态"  width="100")
        template(#default="{row}")
          p(v-if="row.borrow_status=== 'available'") 可借
          p(v-else-if="row.borrow_status=== 'borrowed'") 借出
          p(v-else) {{ row.borrow_status }}
      //- el-table-column( label="销售状态"  width="100")
        template(#default="{row}")
          p(v-if="row.sale_status=== 'on_sale'") 可售
          p(v-else-if="row.sale_status=== 'off_sale'") 不可售
          p(v-else) {{ row.sale_status }}
      el-table-column(label="操作" width="100px")
        template(#default="{row}")
          .buttons
            el-button(type="info" size="small" @click="onEdit(row)") 编辑
            el-button(type="primary" size="small" v-if="row.sale_status=== 'off_sale'" @click="changeSaleStatus(row)") 上架
            el-button(type="warning" size="small" v-else @click="changeSaleStatus(row)") 下架
    el-pagination(@current-change="val => getList(val)" background layout="prev, pager, next" :total="total" style="justify-content: center;margin-top: 20px", :page-size="limit")
    NewBookDrawer(v-model:show="showBookDrawer"  @onClose="onCloseBookDrawer" :detail="currentDetail")
  BorrowList(:id="borrowId" v-model:show="borrowRecordVisible" )
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { bookList, changeSaleStatus as changeSaleStatusApi } from '/@/api/books/index.ts';
import BaseFilter from '/@/components/form/BaseFilter.vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import NewBookDrawer from './component/newBookDrawer.vue';
import BorrowList from './component/BorrowList.vue';

const url = ref('');
const form = ref({
  keyword: null,
});

const list = ref([]);
const page = ref(1);
const total = ref(0);
const limit = ref(10);
const selectedId = ref(null);
const titleName = ref(null);

// 借阅记录的弹窗
const borrowId = ref(null)
const borrowRecordVisible = ref(false)
const showBorrowRecord = (row) => {
  borrowId.value = row.id;
  borrowRecordVisible.value = true
}
// const onCloseBorrowRecord = () => {
//   console.log(22)
//   borrowRecordVisible.value = false
// }
// 新书入库的抽屉
const showBookDrawer = ref(false)
const currentDetail = ref(null);

const onEdit = (row) => {
  currentDetail.value = row;
  showBookDrawer.value = true;
}

const filterList = [{
  label: '关键词',
  model: 'keyword',
  type: 'input',
  placeholder: '书名或ISBN'
},
{
  label: '借阅状态',
  model: 'borrow_status',
  type: 'select',
  options: [{
    label: '可借',
    value: 'available'
  },
  {
    label: '借出',
    value: 'borrowed'
  }
  ]
},
{
  label: '上架状态',
  model: 'sale_status',
  type: 'select',
  options: [{
    label: '上架',
    value: 'on_sale'
  },
  {
    label: '下架',
    value: 'off_sale'
  }
  ]
}
];

const filter = ref(null);

const onFilter = () => {
  page.value = 1;
  getList(page.value);
};
const goAdd = () => {
  selectedId.value = null;
  titleName.value = '创建内容';
  serviceDrawer.show = true;
};

const goDetail = (id) => {
  titleName.value = '服务管理详情';
  selectedId.value = id;
  serviceDrawer.show = true;
};

const goEdit = (id) => {
};
const refreshList = () => {
  getList(page.value);
};

const onDel = async (val) => {
  await proxy.$api.yellow_service.del({ id: val });
  getList(page.value);
};

const changeSaleStatus = async (row) => {
  try {
    await ElMessageBox.confirm(`确定${row.sale_status === 'on_sale' ? '下架' : '上架'}该书籍吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await changeSaleStatusApi({ biz_books_entity_ids: [row.biz_books_id], sale_status: row.sale_status === 'on_sale' ? 'off_sale' : 'on_sale' });
    ElMessage.success('操作成功');
    await getList(page.value);
  } catch (error) {
    console.log(error);
  }
}
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
  console.log(multipleSelection.value);
};
const changeSaleStatusAll = async (status) => {
  try {
    if (!multipleSelection.value.length) {
      ElMessage({
        message: '请选择书籍',
        type: 'warning',
      });
      return;
    }
    await ElMessageBox.confirm(`确定批量处理吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await changeSaleStatusApi({ biz_books_ids: multipleSelection.value.map((item) => item.biz_books_id), sale_status: status });
    getList(page.value);
  } catch (error) {
    console.log(error);
  }
}

const statistics = ref();
const getList = async (val) => {
  if (!val) return;
  page.value = val;
  const res = await bookList({ page: page.value, limit: limit.value, ...form.value });
  total.value = res.data.total;
  list.value = res.data.items;
  statistics.value = res.data.statistics;
};

// 关闭编辑
const onCloseBookDrawer = async (refresh, id) => {
  if (refresh) {
    await getList(page.value);
  }
}

onMounted(async () => {
  getList(page.value);
  url.value = import.meta.env.VITE_API_URL;
});
</script>

<style lang="less" scoped>
.cover {
  width: 80px;
  height: 100px;
  object-fit: cover;
}

:deep(.el-button--small) {
  margin-left: 0px !important;
  margin-bottom: 6px;
}
</style>