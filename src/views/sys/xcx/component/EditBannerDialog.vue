<template lang="pug">
el-drawer(:modelValue="show",:show-close="false" style="width: 50%;padding:20px" title="详情"  @close="onClose(null)")
  el-form(style="margin-top:20px" label-width="120px" label-position="left")
    el-form-item(label="位置",required v-if="!props.id")
      el-select(v-model="form.position" placeholder="请选择位置")
        el-option(label="banner" value="banner")
        el-option(label="首页弹图" value="home_popup")
    el-form-item(label="跳转类型",required)
      el-select(v-model="form.biz_type" placeholder="请选择跳转类型")
        el-option(label="小程序内跳转" value="tiny_app")
        el-option(label="站外跳转" value="outlink")
    el-form-item(label="外链",v-show="form.biz_type == 'outlink'")
      el-input(v-model="form.outlink" placeholder="请输入外链")
    el-form-item(v-show="form.biz_type == 'tiny_app'" label="小程序路径",)
      el-select(v-model="form.tiny_app_site_map_id" placeholder="请输入小程序路径")
        el-option(v-for="item in siteMapList" :key="item.dict_code" :label="item.dict_label" :value="item.dict_code")
    el-form-item(v-show="form.biz_type == 'tiny_app'" label="小程序参数",)
      el-input(v-model="form.tiny_app_site_map_params" placeholder="请输入小程序参数")
    el-form-item(label="排序",)
      el-input-number(v-model="form.sort" placeholder="请输入排序")
    el-form-item(label="状态",)
      el-select(v-model="form.status" placeholder="请选择状态")
        el-option(label="启用" :value="1")
        el-option(label="禁用" :value="0")
    el-form-item(label="图片",required)
      Uploader(:files="[form.pic ]" ref="imageRef" :limit="1")
    el-form-item
      el-button(@click="onClose") 取消
      el-popconfirm(title="确认提交？",@confirm="onSave")
        template(#reference)
          el-button(type="primary") 确认
</template>

<script setup>
import {
  onUpdated, reactive, ref, getCurrentInstance, defineModel
} from 'vue';
import { storeBanner, bannerDetail, editBanner } from '/@/api/xcx/index.ts';
import { bookTagList } from '/@/api/books/index.ts';
import { ElMessage } from 'element-plus';
import Uploader from '/@/components/Uploader.vue'

const show = defineModel('show', { type: Boolean, default: false })
const props = defineProps({
  id: Number,
});
const imageRef = ref(null);
const form = reactive({
  pic: '',
  position: '',
  outlink: '',
  tiny_app_site_map_id: null,
  tiny_app_site_map_params: '',
  sort: 0,
  status: 1,
  biz_type: ""
});
const siteMapList = ref([]);
onUpdated(async () => {
  if (show.value && props.id) {
    const {
      pic, position, outlink, tiny_app_site_map_id, tiny_app_site_map_params, sort, status, biz_type
    } = (await bannerDetail(props.id)).data.item;
    form.pic = pic;
    form.position = position;
    form.outlink = outlink;
    form.tiny_app_site_map_id = tiny_app_site_map_id;
    form.tiny_app_site_map_params = tiny_app_site_map_params;
    form.sort = sort;
    form.status = status;
    form.biz_type = biz_type;
  }
});
const emit = defineEmits(['onClose']);
const onClose = (refreshList) => {
  form.pic = '';
  form.position = '';
  form.outlink = '';
  form.tiny_app_site_map_id = null;
  form.tiny_app_site_map_params = '';
  form.sort = 0;
  form.status = 1;
  form.biz_type = ""
  show.value = false;
  emit('onClose', refreshList);
};
const onSave = async () => {
  const {
    position, outlink, tiny_app_site_map_id, tiny_app_site_map_params, sort, status, biz_type
  } = form;
  const pic = imageRef.value.fileList

  if (!position) {
    ElMessage.error('请选择图文位置');
    return;
  }
  if (!biz_type) {
    ElMessage.error('请选择跳转类型');
    return;
  }
  if (biz_type == 'outlink' && !outlink) {
    ElMessage.error('请输入外链');
    return;
  }
  if (biz_type == 'tiny_app' && !tiny_app_site_map_id) {
    ElMessage.error('请输入小程序路径');
    return;
  }
  if (biz_type == 'tiny_app' && !tiny_app_site_map_params) {
    ElMessage.error('请输入小程序参数');
    return;
  }
  if (!pic.length) {
    return ElMessage.error('请上传图片');
  }
  if (props.id) {
    await editBanner({
      pic: pic[0].url, outlink, tiny_app_site_map_id, tiny_app_site_map_params, sort, biz_type, biz_banner_id: props.id
    });
  } else {
    // todo
    await storeBanner({
      pic: pic[0].url, position, outlink, tiny_app_site_map_id, tiny_app_site_map_params, sort, status, biz_type
    })
  }
  onClose(true);
};

onMounted(async () => {
  siteMapList.value = (await bookTagList('tiny_app_url_map')).data?.items || [];
})
</script>

<style lang="less" scoped>
:deep(.el-form-item__content) {
  &>div {
    width: 100% !important;
  }
}
</style>
