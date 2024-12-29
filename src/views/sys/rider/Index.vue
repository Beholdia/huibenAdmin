<template lang="pug">
.list
  .filter
    BaseFilter(:filterList="filterList" @onFilter="onFilter" v-model:form="form")
    el-button(type="primary" @click="currentId=0;showDrawer = true") 添加
  .wrapper
    el-table(:data="list" style="width: 100%", )
      //- el-table-column(type="selection" width="55")
      el-table-column(prop="biz_rider_id" label="序号")
      el-table-column(prop="name" label="姓名")
      el-table-column(prop="phone" label="手机号")
      el-table-column(prop="created_at" label="创建时间" width="200")
      el-table-column(prop="pickup_times" label="取书次数")
      el-table-column(prop="delivery_times" label="送书次数")
      el-table-column(prop="status" label="状态" width="200" )
        template(#default="{row}")
          el-switch(v-model="row.status" @change="editStatus(row)" :active-value="1" :inactive-value="0" active-text="正常营业" inactive-text="不营业" size="small")
      el-table-column(label="操作" width="100px")
        template(#default="{row}")
          .buttons
            el-button(type="info" size="small" @click="editRider(row)") 编辑
            el-button(type="danger" size="small" @click="deleteRider(row)") 删除

    el-pagination(@current-change="val => getList(val)" background layout="prev, pager, next" :total="total" style="justify-content: center;margin-top: 20px", :page-size="limit")
  EditRiderDrawer(v-model:show="showDrawer" :id="currentId" @onClose="onCloseDrawer") 
  </template>

<script setup>
import { ref, onMounted } from 'vue';
import { bookList, changeSaleStatus as changeSaleStatusApi } from '/@/api/books/index.ts';
import { editRiderStatus, delRider, riderList } from '/@/api/xcx/rider.ts';
import BaseFilter from '/@/components/form/BaseFilter.vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import EditRiderDrawer from './component/EditRiderDrawer.vue'

const showDrawer = ref(false);//弹框
const currentId = ref(0);//当前id
//修改状态
const editStatus = async (row) => {
  try {
    await editRiderStatus({
      "biz_rider_id": row.biz_rider_id,
      "status": row.status
    });
    ElMessage.success('修改成功');
    await getList();
  } catch (error) {
    console.log(error);
  }
}

// 删除
const deleteRider = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await delRider({ biz_rider_id: row.biz_rider_id });
    ElMessage.success('删除成功');
    await getList();
  } catch (error) {
    ElMessage.info('已取消');
  }
}
// 修改
const editRider = (row) => {
  currentId.value = 0;
  if (row) {
    currentId.value = row.biz_rider_id;
  }
  showDrawer.value = true;
};
const onCloseDrawer = (refresh) => {
  if (refresh) getList();
}

const form = ref({
  keyword: null,
});

const list = ref([]);
const page = ref(1);
const total = ref(0);
const limit = ref(10);
const selectedId = ref(null);
const titleName = ref(null);

const filterList = [{
  label: '关键词',
  model: 'keyword',
  type: 'input',
  placeholder: '手机号'
},
];
const onFilter = () => {
  getList(1);
};

const getList = async (pageNum) => {
  if (pageNum) page.value = pageNum;
  const res = await riderList({ ...form.value, page: page.value, limit: limit.value });
  // 分页
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