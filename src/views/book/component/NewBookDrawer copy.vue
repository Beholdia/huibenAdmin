<template lang="pug">
el-drawer(:modelValue="show",:show-close="false" style="width: 50%;padding:20px" title="新书入库" @close="onClose(null)")
  el-form(label-width="120px" label-position="left" :model="form" style="margin-top:20px")
    //- el-form-item(label="书架号" required)
      //- el-input(v-model="form.biz_bookshelf_id" placeholder="请输入书架号")
      el-select(v-model="form.biz_bookshelf_id" placeholder="请选择书架号")
        el-option(v-for="item in book_shelf_list" :key="item.biz_bookshelf_id" :label="item.name" :value="item.biz_bookshelf_id")
    //- el-form-item(label="采购价格",required)
      el-input-number(v-model="form.purchase_price" placeholder="请输入采购价格")
    //- el-form-item(label="购书日期",required)
      el-date-picker(v-model="form.pubdate" placeholder="请输入购书日期" type="date")
    el-form-item(label="所在书库",required)
      el-select(v-model="form.warehouse_id" placeholder="请选择所在书库")
        el-option(v-for="item in book_warehouse_list" :key="item.dict_code" :label="item.dict_label" :value="item.dict_code")
    el-form-item(label="是否可借",required)
      el-select(v-model="form.borrow_status" placeholder="请选择是否可借")
        el-option(label="是" value="available")
        el-option(label="否" value="borrowed")
    el-form-item(label="入库数量",required)
      el-input-number(v-model="form.stock" placeholder="请输入入库数量")
    el-form-item(label="状态",required)
      el-select(v-model="form.sale_status" placeholder="请选择状态")
        el-option(label="上架" value="on_sale")
        el-option(label="下架" value="off_sale")
  template(#footer)
    el-button(@click="onClose") 取消
    //- el-popconfirm(title="确认提交？",@confirm="onSave")
    //-   template(#reference)
    el-button(type="primary" @click="onSave") 确认
  </template>

<script setup>
import {
  onUpdated, reactive, ref, onMounted,
} from 'vue';
import { bookStore } from '/@/api/books/index.ts';
import { ElMessage, ElLoading } from 'element-plus';
import dayjs from 'dayjs';
import { bookShelfList, bookTagList } from '/@/api/books/index.ts';

// let loading = ref(null);

const show = defineModel('show', { type: Boolean });
const props = defineProps({
  // bookData: Object,
  isbn_id: { type: Number }
});
const form = ref({});
const book_shelf_list = ref([]);// 书架
const book_warehouse_list = ref([]);// 书库
onUpdated(async () => {
  form.value = {};
  form.value.warehouse_id = book_warehouse_list.value[0].dict_code;//默认选择第一个书库
  form.value.borrow_status = 'available';//默认可借
  form.value.sale_status = 'on_sale';//默认上架
  form.value.pubdate = dayjs().format('YYYY-MM-DD');
});
const emit = defineEmits(['onClose']);
const onClose = (refreshList) => {
  form.value = {};
  show.value = false;
  emit('onClose', refreshList);
};
const onSave = async () => {
  if (!props.isbn_id) return ElMessage.error('请先选择书籍');
  const {
    purchase_price, pubdate, warehouse_id, borrow_status, sale_status, biz_bookshelf_id
  } = form.value;
  if (!purchase_price || !pubdate || !warehouse_id || !borrow_status || !sale_status || !biz_bookshelf_id) {
    return ElMessage.error('请填写完整信息');
  }
  // loading.value = ElLoading.service();
  const res = await bookStore({ isbn_id: props.isbn_id, purchase_price, pubdate, warehouse_id, borrow_status, sale_status, biz_bookshelf_id });
  // loading.value.close();
  if (res.code === 0) ElMessage.success('新书入库成功');
  // if (form.value.id) {
  //   await proxy.$api.system.editbookData({
  //     dict_label, dict_type, id, dict_value, dict_sort,
  //   });
  // } else {
  //   await proxy.$api.system.addbookData({
  //     dict_label, dict_type, dict_value, dict_sort,
  //   });
  // }
  onClose(true);
};
onMounted(async () => {
  const bookShelfs = await bookShelfList();
  book_shelf_list.value = bookShelfs?.data?.items || [];
  const bookWarehouses = await bookTagList('book_warehouse');
  book_warehouse_list.value = bookWarehouses?.data?.items || [];
})

defineExpose({
  show,
  form,
  book_shelf_list,
  book_warehouse_list,
  onClose,
  onSave,
})
</script>

<style lang="less" scoped>
:deep(.el-form-item__content) {
  &>div {
    width: 100% !important;
  }
}
</style>