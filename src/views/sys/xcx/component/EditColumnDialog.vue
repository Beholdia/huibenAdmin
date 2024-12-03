<template lang="pug">
el-drawer(:modelValue="show",:show-close="false" style="width: 50%;padding:20px" title="详情"  @close="onClose(null)")
  el-form(style="margin-top:20px" label-width="120px" label-position="left")
    el-form-item(label="名称" required)
      el-input(v-model="form.title" placeholder="请输入名称")
    el-form-item(label="跳转类型",required)
      el-select(v-model="form.biz_type" placeholder="请选择跳转类型")
        el-option(label="小程序内跳转" value="tiny_app")
        el-option(label="站外跳转" value="outlink")
    el-form-item(label="外链",v-if="form.biz_type == 'outlink'")
      el-input(v-model="form.outlink" placeholder="请输入外链")
    el-form-item(v-if="form.biz_type == 'tiny_app'" label="小程序路径",)
      el-select(v-model="form.tiny_app_site_map_id" placeholder="请输入小程序路径")
        el-option(v-for="item in siteMapList" :key="item.dict_code" :label="item.dict_label" :value="item.dict_code")
    el-form-item(v-if="form.biz_type == 'tiny_app'" label="小程序参数",)
      el-input(v-model="form.tiny_app_site_map_params" placeholder="请输入小程序参数")
    el-form-item(label="排序",)
      el-input-number(v-model="form.sort" placeholder="请输入排序")
    el-form-item(label="上传图标",required)
      Uploader(:files="[form.logo ]" ref="imageRef" :limit="1")
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
import { storeColumn, columnDetail, editColumn } from '/@/api/xcx/column.ts';
import { bookTagList } from '/@/api/books/index.ts';
import { ElMessage } from 'element-plus';
import Uploader from '/@/components/Uploader.vue'

const show = defineModel('show', { type: Boolean, default: false })
const props = defineProps({
  id: Number,
});
const imageRef = ref(null);
const siteMapList = ref([]);
const form = reactive({
  logo: '',
  title: '',
  outlink: '',
  sort: 0,
  biz_type: "",
  tiny_app_site_map_id: null,
  tiny_app_site_map_params: '',
});
onUpdated(async () => {
  if (show.value && props.id) {
    const {
      logo, title, outlink, tiny_app_site_map_id, tiny_app_site_map_params, sort, biz_type
    } = (await columnDetail(props.id)).data.item;
    form.logo = logo;
    form.title = title;
    form.outlink = outlink;
    form.tiny_app_site_map_id = tiny_app_site_map_id;
    form.tiny_app_site_map_params = tiny_app_site_map_params;
    form.sort = sort;
    form.biz_type = biz_type;
  }
});
const emit = defineEmits(['onClose']);
const onClose = (refreshList) => {
  form.logo = '';
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
    title, outlink, tiny_app_site_map_id, tiny_app_site_map_params, sort, biz_type
  } = form;
  const logo = imageRef.value.fileList
  if (!title) return ElMessage.error('请输入名称');
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
  if (!logo.length) {
    return ElMessage.error('请上传图片');
  }
  if (props.id) {
    await editColumn({
      logo: logo[0].url, outlink, tiny_app_site_map_id, tiny_app_site_map_params, sort, biz_type, biz_column_id: props.id, title
    });
  } else {
    await storeColumn({
      logo: logo[0].url, title, outlink, tiny_app_site_map_id, tiny_app_site_map_params, sort, biz_type
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
