<template lang="pug">
.newbook
  .header
    el-input(v-model.trim="isbn" placeholder="请输入ISBN" @keyup.enter="onSearchIsbn" @input="changeIsbn" ref="myInput")
    el-button(type="primary" @click="onSearchIsbn" ) 确认
  .main
    BaseForm(:formList="formFields" ref="formRef" @onSubmit="storeIsbn" :btnName = "isbnBtnName")
      template(#button)
        //- el-button(type="primary" @click="showDrawer = true" size="large" v-if="isbn_id") 新书入库
  .book-list(v-if="isbn_refer")
    el-table(:data="bookList" border stripe )
      el-table-column(prop="biz_books_id" label="序号" width="150")
      el-table-column(prop="count" label="库存数量")
      el-table-column(prop="name" label="书名")
      el-table-column(label="书库位置")
        template(#default)
          | 嘉兴凯米
      el-table-column(label="封面")
        template(#default="{row}")
          el-image(:src="row.pic" :preview-src-list = " [ row.pic ] " :preview-teleported="true" style="width: 50px; height: 50px")
      el-table-column(label="操作" width="200")
        template(#default="{row}")
          el-button(@click="onEdit(row)" size="small" ) 编辑
          el-button(@click="addCount(row)" size="small") 增加库存
    el-button(@click="addBook" type="primary" size="large" ) 添加书本
  NewBookDrawer(v-model:show="showDrawer" :isbn_id="isbn_id" @onClose="onCloseBookDrawer" :detail="currentBook" :pic="pic" :title="title" :summary="summary" :price="price")
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { searchIsbn, isbnStore, addBookCount } from '/@/api/books/index.ts';
import BaseForm from "/@/components/form/index.vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from 'dayjs';
import { getDataListOption } from '/@/api/system/dict/data.ts';
import NewBookDrawer from './component/newBookDrawer.vue';


const formRef = ref(null);//表单内容
const showDrawer = ref(false);
const isbnBtnName = ref('添加isbn');
const isbn = ref('');
const isbn_id = ref(0);
const bookList = ref([]);
const pic = ref(null);//带过去用的封面
const title = ref(null);//带过去用的标题
const summary = ref(null);//带过去用的简介
const price = ref(0);//带过去用的价格
const currentBook = ref(null);
const isbn_refer = ref(false);
const changeIsbn = () => {
  if (isbn.value.trim().length === 13) onSearchIsbn();
}

const clearBase = (val) => {
  formRef.value.filter.isbn = isbn.value;
  formRef.value.filter.cip = null;
  formRef.value.filter.title = null;
  formRef.value.filter.series = null;
  formRef.value.filter.publisher = null;
  formRef.value.filter.pubplace = null;
  formRef.value.filter.author = null;
  formRef.value.filter.pubdate = null;
  formRef.value.filter.volumeName = null;
  formRef.value.filter.volumeNumber = null;
  formRef.value.filter.price = null;
  formRef.value.filter.page = null;
  formRef.value.filter.language = null;
  formRef.value.filter.class = null;
  formRef.value.filter.keyword = null;
  formRef.value.filter.binding = null;
  formRef.value.filter.pubauthor = null;
  formRef.value.filter.pic = null;
  formRef.value.filter.summary = null;
}
const clearTag = (val) => {
  formRef.value.filter.isbn_language_cate_id = null;
  formRef.value.filter.isbn_age_cate_id = null;
  formRef.value.filter.isbn_featured_character_id = null;
  formRef.value.filter.isbn_series_cate_id = null;
  formRef.value.filter.isbn_wellknow_brand_id = null;
  formRef.value.filter.isbn_feature_tag_id = null;
  formRef.value.filter.isbn_theme_tag_id = null;
}
const onSearchIsbn = async () => {
  try {
    const { data, } = (await searchIsbn({ isbn: isbn.value }));
    const { IsbnInfo, books } = data;
    if (data.isbn_refer) isbn_refer.value = true;
    isbn_id.value = IsbnInfo.biz_isbn_id;
    formRef.value.filter.isbn = IsbnInfo.isbn;
    formRef.value.filter.cip = IsbnInfo.cip;
    formRef.value.filter.title = IsbnInfo.title;
    formRef.value.filter.series = IsbnInfo.series;
    // formRef.value.filter.publisher = IsbnInfo.publisher;
    // formRef.value.filter.pubplace = IsbnInfo.pubplace;
    // formRef.value.filter.author = IsbnInfo.author;
    // formRef.value.filter.pubdate = IsbnInfo.pubdate;
    // formRef.value.filter.volumeName = IsbnInfo.volumeName;
    // formRef.value.filter.volumeNumber = IsbnInfo.volumeNumber;
    // formRef.value.filter.price = IsbnInfo.price;
    // formRef.value.filter.page = IsbnInfo.page;
    // formRef.value.filter.language = IsbnInfo.language;
    // formRef.value.filter.class = IsbnInfo.class;
    // formRef.value.filter.keyword = IsbnInfo.keyword;
    // formRef.value.filter.binding = IsbnInfo.binding;
    // formRef.value.filter.pubauthor = IsbnInfo.pubauthor;
    formRef.value.filter.pic = IsbnInfo.pic;
    pic.value = IsbnInfo.pic;
    summary.value = IsbnInfo.summary;
    title.value = IsbnInfo.title;
    price.value = IsbnInfo.price;
    console.log(IsbnInfo.price);
    // formRef.value.filter.summary = IsbnInfo.summary;

    // 非首次入库，展示书籍列表
    bookList.value = books;
    isbnBtnName.value = '修改isbn';

    // // isbn未入库
    // if (!IsbnTagInfo || !IsbnTagInfo.isbn_language_cate_id) {
    //   clearTag();
    //   return ElMessage.warning('请手动填写剩余必填信息并提交');
    // }

    // // isbn已入库
    // formRef.value.filter.isbn_language_cate_id = IsbnTagInfo.isbn_language_cate_id;
    // formRef.value.filter.isbn_age_cate_id = IsbnTagInfo.isbn_age_cate_id;
    // formRef.value.filter.isbn_featured_character_id = IsbnTagInfo.isbn_featured_character_id;
    // formRef.value.filter.isbn_series_cate_id = IsbnTagInfo.isbn_series_cate_id;
    // formRef.value.filter.isbn_wellknow_brand_id = IsbnTagInfo.isbn_wellknow_brand_id;
    // formRef.value.filter.isbn_feature_tag_id = IsbnTagInfo.isbn_feature_tag_id;
    // formRef.value.filter.isbn_theme_tag_id = IsbnTagInfo.isbn_theme_tag_id;

    // // 两个标签换成tag 是否check保存在option里 循环查找OPTIONS里的选项是否被checked了
    // formFields.value.at(-3).options.forEach(item => {
    //   if (!IsbnTagInfo.isbn_theme_tag_id) return
    //   const res = IsbnTagInfo.isbn_theme_tag_id.find(id => id === item.dict_code)
    //   if (res) item.checked = true;
    // })
    // formFields.value.at(-2).options.forEach(item => {
    //   if (!IsbnTagInfo.isbn_feature_tag_id) return
    //   const res = IsbnTagInfo.isbn_feature_tag_id.find(id => id === item.dict_code)
    //   if (res) item.checked = true;
    // })


    // isbn_id.value = IsbnInfo.biz_isbn_id;
    // isbnBtnName.value = '修改isbn';

    // ElMessage.warning('请手动填写书库信息并入库');
    // showDrawer.value = true;


  } catch (error) {
    console.log(error);
    // loading.value.close();
    clearBase();
    clearTag();
    isbnBtnName.value = '添加isbn';
    isbn_refer.value = false;
    if (error.code === 68) ElMessage.error('请手动填写信息');
  }
}

//添加书本
const addBook = () => {
  currentBook.value = null;
  showDrawer.value = true;
}
//修改书本
const onEdit = (val) => {
  currentBook.value = val;
  showDrawer.value = true;
}
//写count
const addCount = async (row) => {
  try {
    const res = await ElMessageBox.prompt('请输入添加数量', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    })
    if (!res.value) return;
    await addBookCount(
      {
        "biz_books_id": row.biz_books_id, // 书本id
        "count": Number(res.value) // 增加库存数量
      }
    )
    await onSearchIsbn();
  } catch (error) {
    console.log(error);
  }

}
//刷新书籍列表
const onCloseBookDrawer = async (refresh, id) => {
  console.log(refresh);
  if (refresh) {
    isbn_id.value = id;
    await onSearchIsbn()
  }
}
const storeIsbn = async (info, logo) => {
  try {
    await ElMessageBox.confirm(`确定${isbnBtnName.value}信息吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // const isbn_theme_tag_id = formFields.value.find(item => item.key === 'isbn_theme_tag_id').options.filter(item => item.checked).map(item => item.dict_code)
    // const isbn_feature_tag_id = formFields.value.find(item => item.key === 'isbn_feature_tag_id').options.filter(item => item.checked).map(item => item.dict_code)
    const res = await isbnStore({
      ...info,
      // isbn_theme_tag_id,
      // isbn_feature_tag_id,
      // pubdate: info.pubdate ? dayjs(info.pubdate).format('YYYY-MM-DD') : '',
      pic: logo,
    });
    if (res.code === 0) {
      isbn_id.value = res.data.biz_isbn_id;
      // showDrawer.value = true;
      isbnBtnName.value = '修改isbn';
      isbn_refer.value = true;

      pic.value = logo;
      title.value = info.title;
      summary.value = IsbnInfo.summary;
      price.value = IsbnInfo.price;

      await onSearchIsbn();//刷新书籍列表
      ElMessage.success('添加成功');
    }
  } catch (error) {
    console.log(error);
  }
}

const formFields = ref([

  { label: "CIP核准号", key: "cip" },
  { label: "ISBN号", key: "isbn" },
  { label: "正书名", key: "title" },
  { label: "系列名", key: "series" },
  // { label: "出版单位", key: "publisher" },
  // { label: "出版地", key: "pubplace" },
  // { label: "作者", key: "author" },
  // { label: "出版时间", key: "pubdate", type: "date" },
  // { label: "分册名", key: "volumeName" },
  // { label: "分册号", key: "volumeNumber" },
  // { label: "定价", key: "price" },
  // { label: "页数", key: "page" },
  // { label: "正文语种", key: "language" },
  // { label: "中图法分类", key: "class" },
  // { label: "主题词", key: "keyword" },
  // { label: "出版作者", key: "pubauthor" },
  // { label: "装帧方式", key: "binding" },
  { label: "封面", key: "pic", type: "uploader", width: "calc(90% + 32px)", },
  // { label: "", type: "divider", width: 'calc(90% + 32px)' },
  // { label: "语言分类", key: "isbn_language_cate_id", type: 'select', options: [], props: { label: 'dict_label', value: "dict_code" } },
  // { label: "年龄分类", key: "isbn_age_cate_id", type: 'select', },
  // { label: "特色人物", key: "isbn_featured_character_id", type: 'select', options: [], },
  // { label: "系列分类", key: "isbn_series_cate_id", type: 'select', options: [], },
  // { label: "知名品牌", key: "isbn_wellknow_brand_id", type: 'select', options: [], },
  // { label: "主题标签", key: "isbn_theme_tag_id", type: "tag", width: "calc(90% + 32px)", options: [], multiple: true, props: { label: 'dict_label', value: "dict_code" } },
  // { label: "特色标签", key: "isbn_feature_tag_id", type: "tag", width: "calc(90% + 32px)", options: [], multiple: true, props: { label: 'dict_label', value: "dict_code" } },
  // { label: "内容摘要", key: "summary", width: "calc(90% + 32px)", type: "textarea" },
]);

const myInput = ref(null);
onMounted(async () => {

  // const dicts = ['isbn_language_cate', 'isbn_age_cate', 'isbn_featured_character', 'isbn_series_cate', 'isbn_wellknow_brand', 'isbn_theme_tag', 'isbn_feature_tag']
  // for (let dict of dicts) {
  //   const { data } = await getDataListOption(dict);
  //   const list = data.list || [];
  //   formFields.value.find(item => item.key === `${dict}_id`).options = list;
  // }

  myInput.value.focus();
})
</script>

<style lang="less">
.newbook {
  .header {
    width: 50%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    padding: 20px;
  }

  .main {
    padding: 20px;

    // .currentForm {
    //   display: grid;
    //   grid-template-columns: 1fr 1fr;
    //   justify-content: space-between;
    // }
  }

}
</style>
<style lang="less" scoped>
.form-container {
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.input-tag {
  margin-top: 5px;
  display: inline-block;
}

.book-list {
  padding: 20px;

  button {
    margin-top: 22px;
  }
}

:deep(.avatar) {
  width: 100px !important;
}
</style>