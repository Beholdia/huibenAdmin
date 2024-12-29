<template lang="pug">
.dict
  .filter
    BaseFilter(:filterList="filterList" @onFilter="onFilter" v-model:form="form" ref="filter")
  //- .huibenStatistic 今日新增付费会员： {{ new_vip_count }} 人，总计有效会员：{{statics.totalVip}}人，其中黄金会员：{{statics.goldVip}}人，尊享会员：{{statics.blackVip}}人
  el-table(:data="list")
    el-table-column( label="头像" width="140px")
      template(#default="{row}")
        el-avatar(:src="row.avatar" :preview-src-list = " [ row.avatar ] " :preview-teleported="true" style="width: 50px; height: 50px")
    el-table-column(prop="biz_user_id" label="用户ID")
    el-table-column(prop="nickname" label="昵称")
    el-table-column(prop="phone" label="手机号")
    //- todo 审核时间不知道
    el-table-column(label="申请/审核时间" width="180px")
      template(#default="{row}")
        p {{ row.created_at }}
    el-table-column(prop="goods_detail.main_title" label="会员等级")
      template(#default="{row}")
        p {{ row.biz_vip_detail.main_title }}{{ row.biz_vip_detail.sub_title }}

    el-table-column(prop="vip_price" label="提现")
      template(#default="{row}")
        | {{ row.money/100 }} 元
    el-table-column(label="总金额")
      template(#default="{row}")
        | {{ row.total_amount/100 }} 元
    el-table-column(prop="" label="操作" width="200px")
      template(#default="{row}")
        el-button(type="primary" size="small" @click="confirmWidth(row.biz_withdrawal_order_id)" v-if="row.order_status == 'NOTPAY' ") 同意
        el-button(type="primary" size="small" disabled v-else) 通过
  el-pagination(@current-change="val => getList(val)" background layout="prev, pager, next" :total="total" style="justify-content: center;margin-top: 20px", :page-size="limit")
  //- EditDicDetail(v-model:show="editDictVisible",@onClose="closeEditDict ",:id="currentDictId" :label="label")
    </template>

<script setup>
import { onMounted, ref } from 'vue';
import { withdrawallist, confirmWithdrawal } from '/@/api/order/index.ts';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import BaseFilter from '/@/components/form/BaseFilter.vue'

const router = useRouter();
const editDictVisible = ref(false);

const list = ref([]);
const limit = ref(10);
const page = ref(1);
const total = ref(0);

const form = ref({
  keyword: null,
});
const filterList = [{
  label: '关键词',
  model: 'keyword',
  type: 'input',
},
];

const confirmWidth = (biz_withdrawal_order_id) => {
  ElMessageBox.confirm(
    '确定同意退款吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const res = await confirmWithdrawal({ biz_withdrawal_order_id });
      if (!res.code) {
        ElMessage({
          type: 'success',
          message: '操作成功',
        });
        await getList();
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      });
    });
}
const onFilter = () => {
  page.value = 1;
  getList(page.value);
};
const getList = async (pageNum) => {
  if (pageNum) page.value = pageNum;
  const res = await withdrawallist({ page: page.value, limit: limit.value, ...form.value });
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