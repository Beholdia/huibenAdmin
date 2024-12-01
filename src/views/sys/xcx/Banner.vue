<template lang="pug">
    .dict
      el-radio-group(type="button" v-model="type" @change="changeCategory")
        el-radio-button(:label="item.label" :value="item.value" v-for="item in types" size="default")
      el-button(size="default" block class="editBtn" type="primary") 添加
      el-table(:data="list")
        el-table-column(prop="biz_banner_id" label="编号")
        el-table-column(label="图片")
            template(#default="{row}")
                el-image(:src="row.pic" style="width: 100px; height: 100px" :preview-src-list="[row.pic]" :preview-teleported="true")
            
        el-table-column(prop="position" label="位置")
        el-table-column(prop="outlink" label="链接")
        el-table-column(prop="sort" label="排序")
          template(#default="{row}")
            el-input-number(v-model.number="row.sort" size="small" @change="editSort(row)")
        el-table-column(prop="status" label="状态" )
          template(#default="{row}")
            el-switch(v-model="row.status" @change="editStatus(row)" :active-value="1" :inactive-value="0" inline-prompt active-text="启用" inactive-text="关闭" size="small")
        el-table-column(prop="" label="操作")
          template(#default="{row}")
            el-button(type="primary" size="small" @click="editDictStatus(row)") 编辑
            el-button(type="danger" size="small" @click="deleteBanner(row)") 删除
      EditDicDetail(v-model:show="editDictVisible",@onClose="closeEditDict ",:id="currentDictId")
    </template>
    
    <script setup>
    import { onMounted, ref } from 'vue';
    import { bannerList,delBanner,editBannerSort} from '/@/api/xcx/index.ts';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import EditDicDetail from './component/EditDicDetailDialog.vue';
    
    const editDictVisible = ref(false);
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
      label: "主题设置",
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
    const currentDictId = ref(0);
    const editDict = (row) => {
      console.log(row);
      currentDictId.value = 0;
      if (row) {
        currentDictId.value = row.dict_code;
      }
      editDictVisible.value = true;
      console.log(editDictVisible.value,currentDictId.value);
    };
    
    const closeEditDict = (refreshList) => {
      if (refreshList) getList();
      editDictVisible.value = false;
    };
    
    const editStatus = async (row) => {
      console.log(row);
      // todo
    
      try {
        //   await ElMessageBox.confirm(`确定修改状态吗？`, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning',
        // })
    
        await changeTagStatus({
          "dictCode": row.dict_code,
          "status": row.status ? 0 : 1
        });
        getList();
      } catch (error) {
        console.log(error);
        row.status = row.status ? 0 : 1;
      }
    }
    
    const deleteBanner= async (row) => {
    try {
      await ElMessageBox.confirm(`确定删除此图文吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
      await delBanner({biz_banner_id:row.biz_banner_id});
      getList();
    } catch (error) {
      console.log(error);
      ElMessage.error('已取消');
    }
    }
    
    const editSort = async (row) => {
      console.log(row);
      await editBannerSort({
        "biz_banner_id": row.biz_banner_id,
        "sort": row.sort
      });
    }
    // const clear = () => {
      
    // }
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
    .editBtn{
      display: block;
        margin: 5px 5px 5px auto;
        margin-left: auto;
    }
</style>