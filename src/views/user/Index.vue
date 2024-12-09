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
      //- el-table-column(prop="collection_no" label="用户ID" width="200px")
      el-table-column(prop="phone" label="手机号")
      el-table-column(prop="reg_time" label="注册时间")
      el-table-column(prop="biz_vip_expired_at" label="会员有效期")
      el-table-column(prop="biz_vip.title" label="会员等级")
      el-table-column(prop="total_cost_amount" label="消费金额")
      el-table-column( label="借阅记录" width="100")
        template(#default="{row}")
          el-button(link disabled v-if="row.total_borrow_times == 0" )  {{row.total_borrow_times}}
          el-button(link type="primary" v-else) {{row.total_borrow_times}}
      el-table-column( label="借阅状态"  width="100")
        template(#default="{row}")
          //- el-switch(v-model="row.status" @change="editStatus(row)" :active-value="1" :inactive-value="0" inline-prompt active-text="正常" inactive-text="禁用" size="small")
          p(v-if="row.status=== '1'") 正常
          p(v-else) 禁用
      el-table-column(label="操作" width="100px")
        template(#default="{row}")
          .buttons
            //- el-button(type="info" size="small") 编辑
            el-button(type="primary" size="small" v-if="row.status==1 " @click="changeStatus(row)") 禁
            el-button(type="danger" size="small" v-else @click="changeStatus(row)") 解封
    el-pagination(@current-change="val => getList(val)" background layout="prev, pager, next" :total="total" style="justify-content: center;margin-top: 20px", :page-size="limit")
  </template>

<script setup>
import { userList, editUserStatus } from '/@/api/user/index.ts';
import BaseFilter from '/@/components/form/BaseFilter.vue'
import { vipList } from '/@/api/member/index.ts';

const proxy = getCurrentInstance().proxy;
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

const filterList = ref([
  // {
  //   label: '关键词',
  //   model: 'keyword',
  //   type: 'input',
  //   placeholder: '手机号/用户ID'
  // },
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

const changeStatus = async (row) => {
  try {
    await ElMessageBox.confirm(`确定${row.sale_status === 'on_sale' ? '下架' : '上架'}该书籍吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await changeStatusApi({ biz_user_ids: [row.biz_user_id], sale_status: row.sale_status === 'on_sale' ? 'off_sale' : 'on_sale' });
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
  console.log(filterList.value[0].options);
});
</script>

<style lang="less" scoped>
:deep(.el-button--small) {
  margin-left: 0px !important;
  margin-bottom: 6px;
}
</style>