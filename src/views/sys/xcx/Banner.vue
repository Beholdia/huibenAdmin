<template lang="pug">
.dict
  el-radio-group(type="button" v-model="type" @change="changeCategory")
    el-radio-button(:label="item.label" :value="item.value" v-for="item in types" size="default")
  el-button(size="default" block class="editBtn" type="primary" @click="editBanner(null)") 添加
  el-table(:data="list")
    el-table-column(prop="biz_banner_id" label="编号")
    el-table-column(label="图片" width="200px")
      template(#default="{row}")
        el-image(:src="row.pic" style="width: 100px; height: 100px" :preview-src-list="[ row.pic ]" :preview-teleported="true")

    el-table-column(prop="position" label="位置")
      template(#default="{row}")
        span(v-if =" row.position == 'home'") 首页
        span(v-if =" row.position == 'home_popup'") 弹出广告
    el-table-column(prop="outlink" label="外链")
    el-table-column(label="内部链接")
      template(#default="{row}")
        span(v-if =" row.biz_type == 'tiny_app'") {{ row.tiny_app_site_map.dict_value+row.tiny_app_site_map_params}}
    el-table-column( label="类型")
      template(#default="{row}")
        span(v-if =" row.biz_type == 'outlink'") 站外跳转
        span(v-if =" row.biz_type == 'tiny_app'") 内部跳转
    el-table-column(prop="sort" label="排序")
      template(#default="{row}")
        el-input(v-model.number="row.sort" size="small" @change="editSort(row)")
    el-table-column(prop="status" label="状态" )
      template(#default="{row}")
        el-switch(v-model="row.status" @change="editStatus(row)" :active-value="1" :inactive-value="0" inline-prompt active-text="启用" inactive-text="关闭" size="small")
    el-table-column(prop="" label="操作" width="200px")
      template(#default="{row}")
        el-button(type="primary" size="small" @click="editBanner(row)") 编辑
        el-button(type="danger" size="small" @click="deleteBanner(row)") 删除
  EditBannerDetail(v-model:show="editBannerVisible",@onClose="closeEditDict ",:id="currentId")
    </template>

<script setup>
import { onMounted, ref } from 'vue';
import { bannerList, delBanner, editBannerSort, editBannerStatus } from '/@/api/xcx/index.ts';
import { ElMessage, ElMessageBox } from 'element-plus';
import EditBannerDetail from './component/EditBannerDialog.vue';

const editBannerVisible = ref(false);
const type = ref("isbn_age_cate");// 默认为年龄分类
const types = ref([{
  label: "图片广告",
  value: "isbn_age_cate"
},
{
  label: "栏目设置",
  value: "isbn_theme_tag"
},
{
  label: "主题推荐",
  value: "isbn_feature_tag"
}, {
  label: "品牌专区",
  value: "isbn_series_cate"
}, {
  label: "特色人物",
  value: "isbn_featured_character"
},
]);
const list = ref([
]);
const currentId = ref(0);
const editBanner = (row) => {
  currentId.value = 0;
  if (row) {
    currentId.value = row.biz_banner_id;
  }
  editBannerVisible.value = true;
};

const closeEditDict = (refreshList) => {
  if (refreshList) getList();
  editBannerVisible.value = false;
};

const editStatus = async (row) => {
  try {
    await editBannerStatus({
      "biz_banner_id": row.biz_banner_id,
      "status": row.status
    });
    ElMessage.success('操作成功');
    await getList();
  } catch (error) {
    console.log(error);
  }
}

const deleteBanner = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除此图文吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await delBanner({ biz_banner_id: row.biz_banner_id });
    getList();
  } catch (error) {
    console.log(error);
    ElMessage.error('已取消');
  }
}

const editSort = async (row) => {
  await editBannerSort({
    "biz_banner_id": row.biz_banner_id,
    "sort": Number(row.sort)
  });
  ElMessage.success('操作成功');
  getList();
}

const changeCategory = (val) => {
  console.log(val);
  type.value = val;
  getList();
}

const getList = async () => {
  const res = await bannerList();
  list.value = res?.data?.items || [];
}

onMounted(async () => {
  getList();
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
</style>