<template lang="pug">
.share
  .filter
    el-button(type="primary" @click="save") 确认保存
  .wrapper
    .share_item
      .header
        el-switch(v-model="expired_day" @change="changeActiveType")
        p 增加会员有效时长
        el-input-Number(v-model="detail.reward_vip_expired_day_amount")
        p 天
      .pics
        .pics_item
          p 活动图片
          Uploader(:files=" [detail.reward_vip_expired_act_pic ] " ref="reward_vip_expired_act_pic" :limit="1")
        .pics_item
          p 分享海报
          Uploader(:files=" [detail.reward_vip_expired_share_poster ] " ref="reward_vip_expired_share_poster" :limit="1")
    .share_item
      .header
        el-switch(v-model="cash_back"  @change="changeActiveType")
        p 现金返现
        el-input-Number(v-model="detail.cash_back_amount")
        p 元
      .pics
        .pics_item
          p 活动图片
          Uploader(:files=" [detail.cash_back_act_pic ] " ref="cash_back_act_pic" :limit="1")
        .pics_item
          p 分享海报
          Uploader(:files=" [detail.cash_back_share_poster ] " ref="cash_back_share_poster" :limit="1")
</template>

<script setup>
import { onMounted } from 'vue';
import Uploader from '/@/components/Uploader.vue';
import { shareDetail, editShareDetail } from '/@/api/xcx';

const detail = ref({});
const expired_day = ref(false);
const cash_back = ref(false);
// 四张海报
const reward_vip_expired_act_pic = ref(null);
const reward_vip_expired_share_poster = ref(null);
const cash_back_act_pic = ref(null);
const cash_back_share_poster = ref(null);

const changeActiveType = async () => {
  detail.value.active_type = detail.value.active_type === 'cash_back' ? 'expired_day' : 'cash_back';
  expired_day.value = detail.value.active_type === 'cash_back' ? false : true;
  cash_back.value = detail.value.active_type === 'cash_back' ? true : false;
}

// 
const save = async () => {
  try {
    const { active_type, reward_vip_expired_day_amount, cash_back_amount } = detail.value;
    const reward_vip_expired_act_pic_url = reward_vip_expired_act_pic.value.fileList?.[0]?.url;
    const reward_vip_expired_share_poster_url = reward_vip_expired_share_poster.value.fileList?.[0]?.url;
    const cash_back_act_pic_url = cash_back_act_pic.value.fileList?.[0]?.url;
    const cash_back_share_poster_url = cash_back_share_poster.value.fileList?.[0]?.url;
    console.log(active_type);
    if (active_type === 'expired_day') {
      console.log(1);
      if (!reward_vip_expired_day_amount) return ElMessage.error('请输入增加会员有效时长');
      if (!reward_vip_expired_act_pic_url) return ElMessage.error('请上传活动图片');
      if (!reward_vip_expired_share_poster_url) return ElMessage.error('请上传分享海报');
    } else {
      if (!cash_back_amount) return ElMessage.error('请输入现金返现');
      if (!cash_back_act_pic_url) return ElMessage.error('请上传活动图片');
      if (!cash_back_share_poster_url) return ElMessage.error('请上传分享海报');
    }
    let data = {
      active_type, reward_vip_expired_day_amount, cash_back_amount,
      reward_vip_expired_act_pic: reward_vip_expired_act_pic_url,
      reward_vip_expired_share_poster: reward_vip_expired_share_poster_url,
      cash_back_act_pic: cash_back_act_pic_url,
      cash_back_share_poster: cash_back_share_poster_url,
    }
    await editShareDetail(data);
    ElMessage.success('保存成功');
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  detail.value = (await shareDetail()).data.item;
  if (detail.value.active_type === 'cash_back') {
    cash_back.value = true;
  } else {
    expired_day.value = true;
  }
})
</script>

<style lang="less" scoped>
.share {

  // padding: 40px;
  // width: 500px !important;
  // margin: 0 auto;
  &_item {
    margin-bottom: 80px;
  }

  .header {
    display: flex;
    align-items: center;
    column-gap: 20px;
    margin: 20px;
  }

  .pics {
    display: flex;

    .pics_item {
      padding-left: 100px;
      box-sizing: border-box;
      width: 200px;
      margin-right: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      row-gap: 20px;
    }

  }
}
</style>