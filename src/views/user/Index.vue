<template lang="pug">
.list
  .filter
    BaseFilter(:filterList="filterList" @onFilter="onFilter" v-model:form="form" ref="filter")
  .wrapper
    div(style="color:rgba(144,147,153)") 共有注册用户{{statistics?.count_total}}人，体验会员{{statistics?.count_borrowed}}人，黄金会员{{statistics?.count_available}}人，尊享会员600人
    el-table(:data="list" style="width: 100%",@selection-change="handleSelectionChange")
      //- el-table-column(type="selection" width="55")
      el-table-column(prop="biz_user_id" label="序号")
      el-table-column( label="头像" width="100")
        template(#default="{row}")
          el-avatar.cover(:src="row.avatar" v-if="row.avatar")
          el-avatar.cover(src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" v-else)
      el-table-column(prop="nickname" label="昵称" width="200px")
        template(#default="{row}")
          div(@click="goDetail(row.biz_user_id)" style="cursor: pointer") {{ row.nickname }}用户名
      //- el-table-column(prop="collection_no" label="用户ID" width="200px")
      el-table-column(prop="phone" label="手机号" width="200px")
      el-table-column(prop="reg_time" label="注册时间" width="180px")
      el-table-column(prop="biz_vip_expired_at" label="会员有效期" width="180px")
      el-table-column(prop="biz_vip.main_title" label="会员等级" width="150px")
      el-table-column(prop="total_cost_amount" label="消费金额")
      el-table-column( label="借阅记录" width="100")
        template(#default="{row}")
          el-button(link disabled v-if="row.total_borrow_times == 0" )  {{row.total_borrow_times}}
          el-button(link type="primary" v-else) {{row.total_borrow_times}}
      el-table-column( label="借阅状态"  width="100")
        template(#default="{row}")
          //- el-switch(v-model="row.status" @change="editStatus(row)" :active-value="1" :inactive-value="0" inline-prompt active-text="正常" inactive-text="禁用" size="small")
          p(v-if="row.status== 1") 正常
          p(v-else) 禁用
      el-table-column(label="操作" width="100px")
        template(#default="{row}")
          .buttons
            //- el-button(type="info" size="small") 编辑
            el-button(type="primary" size="small" v-if="row.status==1 " @click="changeStatus(row)") 禁
            el-button(type="danger" size="small" v-else @click="changeStatus(row)") 解封
    el-pagination(@current-change="val => getList(val)" background layout="prev, pager, next" :total="total" style="justify-content: center;margin-top: 20px", :page-size="limit")
  Detail(v-model:show="showDetail" :id="selectedId")
  </template>

<script setup>
import { userList, editUserStatus } from '/@/api/user/index.ts';
import BaseFilter from '/@/components/form/BaseFilter.vue'
import { vipList } from '/@/api/member/index.ts';
import Detail from './component/Detail.vue';

const proxy = getCurrentInstance().proxy;
const form = ref({
  keyword: null,
});

const list = ref([]);
const page = ref(1);
const total = ref(0);
const limit = ref(10);
const selectedId = ref(0);
const showDetail = ref(false);

const filterList = ref([
  {
    label: '会员类型',
    model: 'biz_vip_id',
    type: 'select',
    options: [],
    props: { label: 'label', value: 'value' }
  },
]);

const filter = ref(null);

const onFilter = () => {
  page.value = 1;
  getList(page.value);
};

const goDetail = (id) => {
  selectedId.value = id;
  showDetail.value = true;
};


const changeStatus = async (row) => {
  try {
    await ElMessageBox.confirm(`确定${row.status == 1 ? '禁用' : '解封'}该用户吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await editUserStatus({ biz_user_id: row.biz_user_id, status: row.status == 1 ? 0 : 1 });
    getList(page.value);
  } catch (error) {
    console.log(error);
  }
}
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
  console.log(multipleSelection.value);
};
const changeStatusAll = async (status) => {
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
    await changeStatusApi({ biz_user_ids: multipleSelection.value.map((item) => item.biz_user_id), sale_status: status });
    getList(page.value);
  } catch (error) {
    console.log(error);
  }
}

const statistics = ref();
const getList = async (val) => {
  if (!val) return;
  page.value = val;
  const res = await userList({ page: page.value, limit: limit.value, ...form.value });
  total.value = res.data.total;
  list.value = res.data.items;
  statistics.value = res.data.statistics;
};

onMounted(async () => {
  getList(page.value);

  // 会员选择
  const res = await vipList();
  filterList.value[0].options = res.data.items.map(item => ({ label: item.main_title + item.sub_title, value: item.biz_vip_id }));
});
</script>

<style lang="less" scoped>
:deep(.el-button--small) {
  margin-left: 0px !important;
  margin-bottom: 6px;
}
</style>