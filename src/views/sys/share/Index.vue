<template lang="pug">
.share
  .filter
    el-button(type="primary" @click="save") 确认保存
  .wrapper
    .share_item
      .header
        el-switch(v-model="expired_day" @change="changeActiveType")
        p 增加会员有效时长
        el-input-Number(v-model="reward_vip_expired_day_amount")
        p 天
      .pics
        .pics_item
          p 活动图片
          Uploader(:files="reward_vip_expired_act_pic_files" ref="reward_vip_expired_act_pic_ref" :limit="1")
        .pics_item
          p 分享封面
          Uploader(:files="reward_vip_expired_share_poster_files" ref="reward_vip_expired_share_poster_ref" :limit="1")
        .pics_item
          p 生成海报
          Uploader(:files="reward_vip_expired_generate_poster_files" ref="reward_vip_expired_generate_poster_ref" :limit="1")
    .share_item
      .header
        el-switch(v-model="cash_back"  @change="changeActiveType")
        p 现金返现
        el-input-Number(v-model="cash_back_amount")
        p 元
      .pics
        .pics_item
          p 活动图片
          Uploader(:files="cash_back_act_pic_files" ref="cash_back_act_pic_ref" :limit="1")
        .pics_item
          p 分享封面
          Uploader(:files="cash_back_share_poster_files" ref="cash_back_share_poster_ref" :limit="1")
        .pics_item
          p 生成海报
          Uploader(:files="cash_back_generate_poster_files" ref="cash_back_generate_poster_ref" :limit="1")
</template>

<script setup>
import { onMounted, ref, shallowRef as sref, computed } from 'vue';
import Uploader from '/@/components/Uploader.vue';
import { shareDetail, editShareDetail, editShareType } from '/@/api/xcx';

// 使用 shallowRef 而不是 ref 来存储图片 URL
const reward_vip_expired_act_pic = sref('');
const reward_vip_expired_share_poster = sref('');
const cash_back_act_pic = sref('');
const cash_back_share_poster = sref('');
const reward_vip_expired_generate_poster = sref('');// 生成海报
const cash_back_generate_poster = sref(''); // 生成海报


// 其他数值类型的数据仍然使用普通的 ref
const active_type = ref('');
const reward_vip_expired_day_amount = ref('');
const cash_back_amount = ref('');

// 先默认都是false
const expired_day = ref(false);
const cash_back = ref(false);

// 上传组件的 refs
const reward_vip_expired_act_pic_ref = ref(null);
const reward_vip_expired_share_poster_ref = ref(null);
const cash_back_act_pic_ref = ref(null);
const cash_back_share_poster_ref = ref(null);
const reward_vip_expired_generate_poster_ref = ref(null);
const cash_back_generate_poster_ref = ref(null);

// 为每个上传组件创建计算属性
const reward_vip_expired_act_pic_files = computed(() =>
  reward_vip_expired_act_pic.value ? [reward_vip_expired_act_pic.value] : []
);

const reward_vip_expired_share_poster_files = computed(() =>
  reward_vip_expired_share_poster.value ? [reward_vip_expired_share_poster.value] : []
);

const cash_back_act_pic_files = computed(() =>
  cash_back_act_pic.value ? [cash_back_act_pic.value] : []
);

const cash_back_share_poster_files = computed(() =>
  cash_back_share_poster.value ? [cash_back_share_poster.value] : []
);

const reward_vip_expired_generate_poster_files = computed(() =>
  reward_vip_expired_generate_poster.value ? [reward_vip_expired_generate_poster.value] : []
);

const cash_back_generate_poster_files = computed(() =>
  cash_back_generate_poster.value ? [cash_back_generate_poster.value] : []
);

const changeActiveType = async () => {
  active_type.value = active_type.value === 'cash_back' ? 'expired_day' : 'cash_back';
  expired_day.value = active_type.value === 'cash_back' ? false : true;
  cash_back.value = !expired_day.value;
  await editShareType({ active_type: active_type.value });
}

const save = async () => {
  try {
    const reward_vip_expired_act_pic_url = reward_vip_expired_act_pic_ref.value.fileList?.[0]?.url || reward_vip_expired_act_pic.value;
    const reward_vip_expired_share_poster_url = reward_vip_expired_share_poster_ref.value.fileList?.[0]?.url || reward_vip_expired_share_poster.value;
    const cash_back_act_pic_url = cash_back_act_pic_ref.value.fileList?.[0]?.url || cash_back_act_pic.value;
    const cash_back_share_poster_url = cash_back_share_poster_ref.value.fileList?.[0]?.url || cash_back_share_poster.value;

    const reward_vip_expired_generate_poster_url = reward_vip_expired_generate_poster_ref.value.fileList?.[0]?.url || reward_vip_expired_generate_poster.value;
    const cash_back_generate_poster_url = cash_back_generate_poster_ref.value.fileList?.[0]?.url || cash_back_generate_poster.value;

    if (active_type.value === 'expired_day') {
      if (!reward_vip_expired_day_amount.value) return ElMessage.error('请输入增加会员有效时长');
      if (!reward_vip_expired_act_pic_url) return ElMessage.error('请上传活动图片');
      if (!reward_vip_expired_share_poster_url) return ElMessage.error('请上传分享封面');
    } else {
      if (!cash_back_amount.value) return ElMessage.error('请输入现金返现');
      if (!cash_back_act_pic_url) return ElMessage.error('请上传活动图片');
      if (!cash_back_share_poster_url) return ElMessage.error('请上传分享封面');
    }

    let data = {
      active_type: active_type.value,
      reward_vip_expired_day_amount: reward_vip_expired_day_amount.value,
      cash_back_amount: cash_back_amount.value * 100,
      reward_vip_expired_act_pic: reward_vip_expired_act_pic_url,
      reward_vip_expired_share_poster: reward_vip_expired_share_poster_url,
      cash_back_act_pic: cash_back_act_pic_url,
      cash_back_share_poster: cash_back_share_poster_url,
      reward_vip_expired_generate_poster: reward_vip_expired_generate_poster_url,
      cash_back_generate_poster: cash_back_generate_poster_url
    }
    await editShareDetail(data);
    ElMessage.success('保存成功');
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  const response = (await shareDetail()).data.item;
  // 分别设置每个值
  active_type.value = response.active_type;// 活动类型
  reward_vip_expired_day_amount.value = response.reward_vip_expired_day_amount; // 增加会员有效时长
  reward_vip_expired_act_pic.value = response.reward_vip_expired_act_pic; // 活动图片
  reward_vip_expired_share_poster.value = response.reward_vip_expired_share_poster;// 分享封面
  reward_vip_expired_generate_poster.value = response.reward_vip_expired_generate_poster;// 生成海报

  cash_back_amount.value = response.cash_back_amount / 100; // 现金返现
  cash_back_act_pic.value = response.cash_back_act_pic;// 活动图片
  cash_back_share_poster.value = response.cash_back_share_poster;// 分享封面
  cash_back_generate_poster.value = response.cash_back_generate_poster;// 生成海报

  if (active_type.value === 'cash_back') {
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