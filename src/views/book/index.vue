<template lang="pug">
.newbook
  .header
    el-input(v-model.trim="isbn" placeholder="请输入ISBN" @keyup.enter="onSearchIsbn" ref="myInput")
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

    formRef.value.filter.pic = IsbnInfo.pic;
    pic.value = IsbnInfo.pic;
    summary.value = IsbnInfo.summary;
    title.value = IsbnInfo.title;
    price.value = IsbnInfo.price;
    // formRef.value.filter.summary = IsbnInfo.summary;

    // 非首次入库，展示书籍列表
    bookList.value = books;
    isbnBtnName.value = '修改isbn';

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

    const res = await isbnStore({
      ...info,
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
  { label: "系列名", key: "series",type:"remote" },
  { label: "封面", key: "pic", type: "uploader", width: "calc(90% + 32px)", },
]);

const myInput = ref(null);
onMounted(async () => {

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