<template lang="pug">
.dict
  .huibenStatistic 今日新增付费会员： {{ new_vip_count }} 人，总计有效会员：{{statics.totalVip}}人，其中黄金会员：{{statics.goldVip}}人，尊享会员：{{statics.blackVip}}人
  el-table(:data="list")
    //- el-table-column(prop="biz_order_id" label="序号")
    el-table-column( label="头像" width="100px")
      template(#default="{row}")
        el-avatar(:src="row.avatar" :preview-src-list = " [ row.avatar ] " :preview-teleported="true" style="width: 50px; height: 50px")
    el-table-column(prop="biz_user_id" label="用户ID")
    el-table-column(prop="biz_order_id" label="订单编号" width="100px")
    el-table-column(prop="out_trade_no" label="支付编号" width="200px")
    el-table-column(prop="notify_at" label="支付时间" width="200px")
    el-table-column(prop="goods_detail.main_title" label="会员等级" width="100px")
      template(#default="{row}")
        p {{ row.goods_detail.main_title }}{{ row.goods_detail.sub_title }}
    el-table-column(prop="vip_price" label="会员金额" width="100px")
      template(#default="{row}")
        div(v-if="row.vip_status==='not_return' ") {{ row.vip_price/100 }} 元
        div(v-else)
          div(style = " text-decoration :  line-through " ) {{ row.deposit_price/100 }} 元
          div(style="color:red") 已退款
    el-table-column(prop="deposit_price" label="书籍押金" width="100px")
      template(#default="{row}")
        div(v-if="row.deposit_status==='not_return' ") {{ row.deposit_price/100 }} 元
        div(v-else)
          div(style = " text-decoration :  line-through " ) {{ row.deposit_price/100 }} 元
          div(style="color:red") 已退款
    el-table-column(prop="" label="操作" width="200px")
      template(#default="{row}")
        el-button(type="primary" size="small" @click="selectRefund(row)" :disabled="row.vip_status==='returned' && row.deposit_status==='returned' ") 退款
  el-pagination(@current-change="val => getList(val)" background layout="prev, pager, next" :total="total" style="justify-content: center;margin-top: 20px", :page-size="limit")
  SelectRefund(v-model:show="showSelectRefund" :detail="currentRefund" @onClose="onCloseRefund")
    </template>

<script setup>
import { onMounted, ref } from 'vue';
import { paylist, refund, withdrawallist, confirmWithdrawal } from '/@/api/order/index.ts';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import SelectRefund from './component/SelectRefund.vue';

const router = useRouter();
const editDictVisible = ref(false);
const type = defineModel('type', {
  type: String,
}
)
const label = ref('');

const list = ref([]);
const limit = ref(10);
const page = ref(1);
const total = ref(0);

const showSelectRefund = ref(false);
const currentRefund = ref({});
const selectRefund = (row) => {
  currentRefund.value = row;
  showSelectRefund.value = true;
}
const onCloseRefund = (refresh) => {
  if (refresh) getList();
}

const currentDictId = ref(0);
const editDict = (row) => {
  currentDictId.value = 0;
  if (row) {
    currentDictId.value = row.dict_code;
  }
  editDictVisible.value = true;
};

const closeEditDict = (refreshList) => {
  if (refreshList) getList();
  editDictVisible.value = false;
};

const editStatus = async (row) => {
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

const statics = ref({});
const new_vip_count = ref(0);
const getList = async (pageNum) => {
  if (pageNum) page.value = pageNum;
  const res = await paylist({ page: page.value, limit: limit.value });
  let goldVip = 0;
  let blackVip = 0;
  res.data.statitics.forEach((item) => {
    if (item.main_title == '黄金会员') {
      goldVip += item.count;
    } else if (item.main_title == '尊享会员') {
      blackVip += item.count;
    }
  })
  statics.value = {
    goldVip,
    blackVip,
    totalVip: goldVip + blackVip
  }
  new_vip_count.value = res?.data?.new_vip_count;
  list.value = res?.data?.items || [];
  total.value = res?.data?.total || 0;
}

onMounted(async () => {
  await getList();
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