<template lang="pug">
el-drawer(:modelValue="show",:show-close="false" style="padding:20px" title="用户详情" @close="onClose(null)" size="80%")
  el-tabs(v-model="activeName")
    el-tab-pane(label="用户信息" name="user")
      .base
        .sub_title 用户详情
        el-form(label-width="80px" style="display:grid;grid-template-columns:repeat(2,1fr);") 
          el-form-item(label="昵称")
            el-input(v-model="form.item.nickname" disabled)
          el-form-item(label="手机号")
            el-input(v-model="form.item.phone" disabled)
          el-form-item(label="小区")
            el-input(v-model="form.item.community")
          el-form-item(label="书箱装否")
            el-select(v-model="form.item.book_box")
              el-option(label="是" :value="1")
              el-option(label="否" :value="0")
        el-button(type="primary" style="margin-left:auto;width:100px;display:block" @click="setBox") 保存
        //- p 昵称：{{form.item.nickname}}
        //- p 手机号：{{form.item.mobile}}
        //- p 小区 {{ form.item.community }}
        //- p 书箱装否 {{ form.item.book_box }}
        .address
          .sub_title(v-if="form?.biz_address?.length") 邮寄地址
          .address_item(v-for="i in form.biz_address")
            p {{ i.province.province_name }}{{ i.city.city_name }}{{ i.county.county_name }}{{ i.detaild_address}}
            p 昵称：{{i.name}}
            p 手机号：{{i.phone}}
        .kid
          .sub_title(v-if="form?.biz_kid?.length") 孩子信息
          .kid_item(v-for="i in form.biz_kid")
            p 姓名：{{i.name}}
            p 出生年月： {{ i.birth }}
            p 性别： {{ i.gender=='M'?'男':'女' }}

        .sub_title(v-if="form?.item?.biz_vip") 会员信息
          p 会员等级：{{ form.item?.biz_vip?.main_title }}
          p 会员到期时间：{{ form.item?.biz_vip_expired_at }}
    el-tab-pane(label="邀请记录" name="invite")
      InviteList(:biz_user_id="props.id")
      //- el-table(:data="form.biz_invite")
      //-   el-table-column(label="被邀请人" prop="invitee_user.nickname")
      //-   el-table-column(label="被邀请用户ID" prop="invitee_user_id")
      //-   el-table-column(label="时间" prop="created_at")
      //-   el-table-column(label="会员等级" prop="vip_detail")
      //-   el-table-column(label="返现金额" prop="cashback_amount")
    el-tab-pane(label="订单记录" name="order")
      BorrowList(:biz_user_id="props.id")
    </template>

<script setup>
import { userDetail, setUserBox } from '/@/api/user/index.ts';
import BorrowList from './BorrowList.vue';
import InviteList from './InviteList.vue';
import { ElMessage } from 'element-plus';


const show = defineModel('show', { type: Boolean });
const props = defineProps({
  id: { type: Number }
});
const emit = defineEmits(['onClose']);
const activeName = ref('user');
const form = ref({ item: {} });

const setBox = async () => {
  // console.log(form.value.item.book_box);
  await setUserBox(
    {
      "biz_user_id": props.id,
      "book_box": form.value.item.book_box,
      "community": form.value.item.community
    }
  )
  ElMessage.success('修改成功');
}

onUpdated(async () => {
  if (show.value) {
    const { data } = await userDetail(props.id);
    form.value = data;
    activeName.value = 'user';
  }

});

const onClose = (refreshList) => {
  show.value = false;
  emit('onClose', refreshList);
};

</script>

<style lang="less" scoped>
:deep(.el-form-item__content) {
  &>div {
    width: 100% !important;
  }
}

.base {
  padding: 20px;

  .sub_title {
    text-align: center;
    font-size: 16px;
    margin-bottom: 20px;

    p {
      text-align: left;
    }
  }

  .address {
    margin-bottom: 20px;

    &_item {
      display: flex;
      gap: 20px;

    }
  }

  .kid {
    margin-bottom: 20px;

    &_item {
      display: flex;
      gap: 20px;
    }
  }
}

:deep(.el-form .el-form-item:last-of-type) {
  margin-bottom: 22px !important;
}
</style>