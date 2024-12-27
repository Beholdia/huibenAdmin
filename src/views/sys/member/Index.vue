<template lang="pug">
.list
  .filter
    el-button(type="primary" @click="currentId=0;showDrawer = true") 添加
  .wrapper
    el-table(:data="list" style="width: 100%")
      //- el-table-column(type="selection" width="55")
      el-table-column(prop="biz_vip_id" label="编号")
      el-table-column(prop="main_title" label="会员类别")
      el-table-column(prop="sub_title" label="子类别")
      el-table-column(prop="valid_days" label="有效期（天）")
      el-table-column(label="原价")
        template(#default="{row}")
          p {{ row.original_price/100 }}
      el-table-column(label="优惠价（元）")
        template(#default="{row}")
          p {{ row.special_price/100 }}
      el-table-column(prop="status" label="状态" )
        template(#default="{row}")
          el-switch(v-model="row.status" @change="editStatus(row)" :active-value="1" :inactive-value="0" inline-prompt active-text="启用" inactive-text="关闭" size="small")
      el-table-column(label="操作" width="100px")
        template(#default="{row}")
          .buttons
            el-button(type="info" size="small" @click="editVip(row)") 编辑
            el-button(type="danger" size="small" @click="deleteVip(row)") 删除

    //- el-pagination(@current-change="val => getList(val)" background layout="prev, pager, next" :total="total" style="justify-content: center;margin-top: 20px", :page-size="limit")
  EditMemberDrawer(v-model:show="showDrawer" :id="currentId" @onClose="onCloseDrawer") 
  </template>

<script setup>
import { ref, onMounted } from 'vue';
import { bookList, changeSaleStatus as changeSaleStatusApi } from '/@/api/books/index.ts';
import { editVipStatus, delVip, vipList } from '/@/api/member/index.ts';
import BaseFilter from '/@/components/form/BaseFilter.vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import EditMemberDrawer from './component/EditMemberDrawer.vue'

const showDrawer = ref(false);//弹框
const currentId = ref(0);//当前id
//修改状态
const editStatus = async (row) => {
  try {
    await editVipStatus({
      "biz_vip_id": row.biz_vip_id,
      "status": row.status
    });
    ElMessage.success('修改成功');
    await getList();
  } catch (error) {
    console.log(error);
  }
}

// 删除
const deleteVip = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除此分类吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await delVip({ biz_vip_id: row.biz_vip_id });
    ElMessage.success('删除成功');
    await getList();
  } catch (error) {
    ElMessage.info('已取消');
  }
}
// 修改
const editVip = (row) => {
  currentId.value = 0;
  if (row) {
    currentId.value = row.biz_vip_id;
  }
  showDrawer.value = true;
};
const onCloseDrawer = (refresh) => {
  if (refresh) getList();
}

// // todo

// const form = ref({
//   keyword: null,
// });

const list = ref([]);
// const page = ref(1);
// const total = ref(0);
// const limit = ref(8);
// const selectedId = ref(null);
// const titleName = ref(null);

// const filterList = [{
//   label: '关键词',
//   model: 'keyword',
//   type: 'input',
//   placeholder: '书名或ISBN'
// },
// {
//   label: '借阅状态',
//   model: 'borrow_status',
//   type: 'select',
//   options: [{
//     label: '可借',
//     value: 'available'
//   },
//   {
//     label: '借出',
//     value: 'borrowed'
//   }
//   ]
// },
// {
//   label: '销售状态',
//   model: 'sale_status',
//   type: 'select',
//   options: [{
//     label: '可售',
//     value: 'on_sale'
//   },
//   {
//     label: '不可售',
//     value: 'off_sale'
//   }
//   ]
// }
// ];

// const filter = ref(null);

// const onFilter = () => {
//   page.value = 1;
//   getList(page.value);
// };
// const goAdd = () => {
//   selectedId.value = null;
//   titleName.value = '创建内容';
//   serviceDrawer.show = true;
// };

// const goDetail = (id) => {
//   titleName.value = '服务管理详情';
//   selectedId.value = id;
//   serviceDrawer.show = true;
// };

// const goEdit = (id) => {
// };
// const refreshList = () => {
//   getList(page.value);
// };

// const onDel = async (val) => {
//   await proxy.$api.yellow_service.del({ id: val });
//   getList(page.value);
// };

// const changeSaleStatus = async (row) => {
//   try {
//     await ElMessageBox.confirm(`确定${row.sale_status === 'on_sale' ? '下架' : '上架'}该书籍吗？`, '提示', {
//       confirmButtonText: '确定',
//       cancelButtonText: '取消',
//       type: 'warning',
//     })
//     await changeSaleStatusApi({ biz_books_ids: [row.biz_books_id], sale_status: row.sale_status === 'on_sale' ? 'off_sale' : 'on_sale' });
//     getList(page.value);
//   } catch (error) {
//     console.log(error);
//   }
// }
// const multipleSelection = ref([]);
// const handleSelectionChange = (val) => {
//   multipleSelection.value = val;
//   console.log(multipleSelection.value);
// };
// const changeSaleStatusAll = async (status) => {
//   try {
//     if (!multipleSelection.value.length) {
//       ElMessage({
//         message: '请选择书籍',
//         type: 'warning',
//       });
//       return;
//     }
//     await ElMessageBox.confirm(`确定批量处理吗？`, '提示', {
//       confirmButtonText: '确定',
//       cancelButtonText: '取消',
//       type: 'warning',
//     })
//     await changeSaleStatusApi({ biz_books_ids: multipleSelection.value.map((item) => item.biz_books_id), sale_status: status });
//     getList(page.value);
//   } catch (error) {
//     console.log(error);
//   }
// }

const getList = async () => {
  const res = await vipList();
  list.value = res.data.items;
};

onMounted(async () => {
  getList();
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