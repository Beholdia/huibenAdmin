<template lang="pug">
el-drawer(:modelValue="show",:show-close="false" style="padding:20px" title="新书入库" @close="onClose(null)" size="50%")
  el-form(label-width="120px" label-position="left" :model="form" style="margin-top:20px")
    el-form-item(label="封面")
      Uploader(:files="[form.pic ]" ref="imageUploader" )
    //- el-form-item(label="书架号" required)
    //- el-input(v-model="form.biz_bookshelf_id" placeholder="请输入书架号")
    //- el-select(v-model="form.biz_bookshelf_id" placeholder="请选择书架号")
      el-option(v-for="item in book_shelf_list" :key="item.biz_bookshelf_id" :label="item.name" :value="item.biz_bookshelf_id")
    //- el-form-item(label="采购价格",required)
      el-input-number(v-model="form.purchase_price" placeholder="请输入采购价格")
    //- el-form-item(label="购书日期",required)
      el-date-picker(v-model="form.pubdate" placeholder="请输入购书日期" type="date")
    el-form-item(label="书名",required)
      el-input(v-model="form.name" placeholder="请输入书籍名称")
    el-form-item(label="价格",required)
      el-input-number(v-model="form.price" placeholder="请输入价格")
    el-form-item(label="书库位置",)
      el-input(v-model="shukuweizhi" disabled)
    //- el-form-item(label="所在书库",required)
      el-select(v-model="form.warehouse_id" placeholder="请选择所在书库")
        el-option(v-for="item in book_warehouse_list" :key="item.dict_code" :label="item.dict_label" :value="item.dict_code")
    //- el-form-item(label="是否可借",required)
      el-select(v-model="form.borrow_status" placeholder="请选择是否可借")
        el-option(label="是" value="available")
        el-option(label="否" value="borrowed")
    //- el-form-item(label="入库数量",required)
      el-input-number(v-model="form.stock" placeholder="请输入入库数量")
    el-form-item(label="状态",required)
      el-select(v-model="form.sale_status" placeholder="请选择状态")
        el-option(label="上架" value="on_sale")
        el-option(label="下架" value="off_sale")
    el-form-item(label="摘要")
      Editor(:content="form.summary", ref="editorRef" v-if="show")
    template(v-for="item,index in tagSelects" :key="item.dict_id")
      el-form-item( :label="item.dict_name" v-if="item.children&&item.children.length>0")
        //- el-checkbox-group(v-model="form.isbn_tags" v-if=" item.dict_name !== '特色人物' &&item.dict_name!=='知名品牌' " )
        //- el-checkbox-group(v-model="form.isbn_tags[ item.dict_id ] " )
        el-checkbox-group(v-model="form.isbn_tags[ item.dict_id ] " :max=" item.dict_name == '特色人物' ||item.dict_name == '知名品牌' ? 1 : 999 " )
          el-checkbox(v-for="tag in item.children" :key="tag.dict_code" :label="tag.dict_label" :value="tag.dict_code" ) {{ tag.dict_label }}
  template(#footer)
    el-button(@click="onClose(null)") 取消
    //- el-popconfirm(title="确认提交？",@confirm="onSave")
    //-   template(#reference)
    el-button(type="primary" @click="onSave") 确认
  </template>

<script setup>
import {
  onUpdated, reactive, ref, onMounted,
} from 'vue';
import { bookStore, optionSelect, batchList, bookDetail, editBook } from '/@/api/books/index.ts';
import { ElMessage, ElLoading } from 'element-plus';
import dayjs from 'dayjs';
import { bookShelfList, bookTagList } from '/@/api/books/index.ts';
import Editor from '/@/components/Editor.vue';
import Uploader from '/@/components/Uploader.vue';

const imageUploader = ref(null);
const editorRef = ref(null);
const show = defineModel('show', { type: Boolean });
const props = defineProps({
  isbn_id: { type: Number },
  detail: Object,
  pic: String,
  title: String,
  summary: String,
  price:Number
});
const form = ref({ isbn_tags: [] });
const book_shelf_list = ref([]);// 书架
const book_warehouse_list = ref([]);// 书库
const tagSelects = ref([]);// 渲染标签checkbox列表\

const shukuweizhi = ref('嘉兴凯米');

onUpdated(async () => {
  if (show.value) {
    // form.value = {};
    // form.value.warehouse_id = book_warehouse_list.value[0].dict_code;//默认选择第一个书库
    // form.value.pubdate = dayjs().format('YYYY-MM-DD');
    // form.value.borrow_status = 'available';//默认可借
    // form.value.sale_status = 'on_sale';//默认上架
    // form.value.pic = props.pic;
    // form.value.name = props.title;
    // form.value.summary = "<p><strong>A??AA</strong></p>";
    // form.value.isbn_tags = [];
    if (!props?.detail?.biz_books_id) {
      // setTimeout用来解决summary渲染不出来的问题
      setTimeout(() => {
      form.value = {
        name: props.title, pic: props.pic, summary: props.summary, sale_status: 'on_sale', isbn_tags: [],price:props.price
      };
      }, 500)
    }
    if (props?.detail?.biz_books_id) {
      const res = await bookDetail(props.detail.biz_books_id);
      const { name, pic, summary, isbn_tags, borrow_status, sale_status,price } = res.data.item;

      let tags = [];
      if (isbn_tags) tags = isbn_tags.map(item => item?.tag_id);// 获取所有tag id

      // 单选
      let tagSelected = [];
      tagSelects.value.forEach(item => {
        if (item.children) {
          item.children.forEach(sub => {
            if (tags.indexOf(sub.dict_code) != -1) {// 如果sub.dict_code在tags中 则说明被选中 ，绑定到item.dict_id中v-model用
              if (!tagSelected[item.dict_id]) tagSelected[item.dict_id] = [];
              tagSelected[item.dict_id].push(sub.dict_code)
            }
          })
        }
      })

      form.value = { name, pic, summary, borrow_status, sale_status, isbn_tags: tagSelected,price };
    }
  }
});
const emit = defineEmits(['onClose']);
const onClose = (refreshList) => {
  // form.value = {};// 不注释掉会导致checkbox标签绑定报错
  show.value = false;
  emit('onClose', refreshList, props.isbn_id);
};
const onSave = async () => {
  // console.log(form.value.isbn_tags.flat())
  const tagsSelected = form.value.isbn_tags.flat();// 获取所有被选中的tag id

  const { name, sale_status,price } = form.value;
  const pics = imageUploader.value.fileList;
  const summary = editorRef.value.getHtml();
  // const {
  //   purchase_price, pubdate, warehouse_id, borrow_status, sale_status, biz_bookshelf_id
  // } = form.value;
  if (!pics?.length || !name || !summary || !props.isbn_id) {
    return ElMessage.error('请填写完整信息');
  }
  // const res = await bookStore({ isbn_id: props.isbn_id, purchase_price, pubdate, warehouse_id, borrow_status, sale_status, biz_bookshelf_id });
  if (!props?.detail?.biz_books_id) {
    const res = await bookStore({ biz_isbn_id: props.isbn_id, name, pic: pics[0].url, summary, isbn_tags: tagsSelected, sale_status,price });
    if (res.code === 0) ElMessage.success('新书入库成功');
  } else {
    const res = await editBook({ biz_books_id: props.detail.biz_books_id, name, pic: pics[0].url, summary, isbn_tags: tagsSelected, sale_status,price });
    if (res.code === 0) ElMessage.success('修改成功');

  }
  onClose(true);
};
onMounted(async () => {
  // const bookShelfs = await bookShelfList();
  // book_shelf_list.value = bookShelfs?.data?.items || [];
  // const bookWarehouses = await bookTagList('book_warehouse');
  // book_warehouse_list.value = bookWarehouses?.data?.items || [];

  let tags = (await optionSelect()).data.dictType;// 所有label的对象list

  // const dictLabels = tags.map(item=>item.dict_name);//所有label的中文list
  const dictLabels = ["语言分类", "年龄分类", "特色人物", "知名品牌", "出版地区", "获奖绘本", "生活习惯养成", "生活场景认知", "社会角色认知", "自然现象认知", "情绪情感", "益智培养", "品德教育", "文学故事", "自然科学", "人文科学", "权威推荐", "绘本大师", "有声绘本"]

  const options = (await batchList({ dictType: dictLabels })).data.list//所有label下面的options的list
  tags.forEach((item) => {
    item.children = options[item.dict_name];
  })
  tagSelects.value = tags;

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