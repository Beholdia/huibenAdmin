<template lang="pug">
.newbook
  .header
    el-input(v-model="isbn" placeholder="请输入ISBN" @keyup.enter="onSearchIsbn")
    el-button(type="primary" @click="onSearchIsbn" ) 确认
  .main
    BaseForm(:formList="formFields" ref="formRef" @onSubmit="storeIsbn")
    BaseForm(:formList="formFields2")
    //- el-divider
    //- BaseForm(:formList="formFields2")
    //- el-form(:inline="true" label-width="100px" label-position="left" class="currentForm")
      el-form-item(label="书名"  )
        el-input(v-model="isbn" placeholder="请输入ISBN")
      el-form-item(label="作者")
        el-input(v-model="isbn" placeholder="请输入ISBN")
      el-form-item(label="出版社")
        el-input(v-model="isbn" placeholder="请输入ISBN")
      el-form-item(label="ISBN")
        el-input(v-model="isbn" placeholder="请输入ISBN")
      el-form-item(label="简介")
        el-input(v-model="isbn" placeholder="请输入ISBN")

      //- .div.form-container
      //- el-form(:model="form" label-width="120px")
        el-row(:gutter="20")
          el-col(:span="12" v-for="(field, index) in formFields" :key="index")
            el-form-item(:label="field.label")
              el-input(v-model="form[field.key]")

        el-divider
        el-row(:gutter="20")
          el-col(:span="12")
            el-form-item(label="主题标签")
              el-tag(
                v-for="tag in topicTags"
                :key="tag"
                type="info"
                closable
                @close="removeTag(tag, 'topic')"
              ) {{ tag }}
              el-input.input-tag(
                v-model="newTopicTag"
                placeholder="添加标签"
                @keyup.enter="addTag('topic')"
              )
          el-col(:span="12")
            el-form-item(label="特色标签")
              el-tag(
                v-for="tag in featureTags"
                :key="tag"
                type="success"
                closable
                @close="removeTag(tag, 'feature')"
              ) {{ tag }}
              el-input.input-tag(
                v-model="newFeatureTag"
                placeholder="添加标签"
                @keyup.enter="addTag('feature')"
              )

        el-divider

        el-row(:gutter="20")
          el-col(:span="12")
            el-form-item(label="书架号")
              el-input(v-model="form.shelfNumber")
          el-col(:span="12")
            el-form-item(label="馆藏号")
              el-input(v-model="form.collectionNumber")
          el-col(:span="12")
            el-form-item(label="采购价格")
              el-input(v-model="form.purchasePrice")
          el-col(:span="12")
            el-form-item(label="购书日期")
              el-date-picker(v-model="form.purchaseDate" type="date")

        el-form-item(label="内容摘要")
          el-input(type="textarea" v-model="form.contentSummary" rows="5")

        el-form-item
          el-button(type="primary" @click="handleSubmit") 确认添加

</template>

<script setup>
import { ref, reactive } from 'vue';
import { searchIsbn, isbnStore } from '/@/api/books/index.ts';
import { login, captcha } from "/@/api/login";
import BaseForm from "/@/components/form/index.vue";
import pagination from '/@/components/pagination/index.vue'
import { ElMessage } from 'element-plus';

const formRef = ref(null);
const onSearchIsbn = async () => {
  try {
    // console.log(formRef.value.filter);
    // formRef.value.filter.isbn = 9999;
    const { data } = (await searchIsbn({ isbn: isbn.value }));
    console.log(data);
    const { IsbnInfo } = data;
    formRef.value.filter.isbn = IsbnInfo.isbn;
    formRef.value.filter.cip = IsbnInfo.cip;
    formRef.value.filter.title = IsbnInfo.title;
    formRef.value.filter.series = IsbnInfo.series;
    formRef.value.filter.publisher = IsbnInfo.publisher;
    formRef.value.filter.pubplace = IsbnInfo.pubplace;
    formRef.value.filter.author = IsbnInfo.author;
    formRef.value.filter.pubdate = IsbnInfo.pubdate;
    formRef.value.filter.volumeName = IsbnInfo.volumeName;
    formRef.value.filter.volumeNumber = IsbnInfo.volumeNumber;
    formRef.value.filter.price = IsbnInfo.price;
    formRef.value.filter.page = IsbnInfo.page;
    formRef.value.filter.language = IsbnInfo.language;
    formRef.value.filter.class = IsbnInfo.class;
    formRef.value.filter.keyword = IsbnInfo.keyword;
    formRef.value.filter.binding = IsbnInfo.binding;
    formRef.value.filter.pubauthor = IsbnInfo.pubauthor;

    if (!data.IsbnTagInfo.isbn_age_cate) ElMessage.info('请手动填写剩余必填信息并提交');

  } catch (error) {
    console.log(error);
    if (error.code === 68) ElMessage.error('请手动填写信息');
  }
}

const isbn = ref('');
const storeIsbn = async (info) => {
  console.log(info);
  await isbnStore({
    ...info,
    "isbn_feature_id": [24], // 特色标签 dictData表
    "isbn_theme_id": [16] // 主题标签 dictData表

  });
}

// const form = reactive({
//   bookName: "",
//   seriesName: "",
//   publisher: "",
//   location: "",
//   author: "",
//   publicationDate: "",
//   volumeName: "",
//   volumeNumber: "",
//   price: "",
//   textLanguage: "",
//   classification: "",
//   keywords: "",
//   bindingType: "",
//   languageCategory: "",
//   ageCategory: "",
//   seriesCategory: "",
//   shelfNumber: "",
//   collectionNumber: "",
//   purchasePrice: "",
//   purchaseDate: "",
//   bookLocation: "",
//   contentSummary: "",
// });

const formFields = [

  { label: "CIP核准号", key: "cip" },
  { label: "ISBN号", key: "isbn" },
  { label: "正书名", key: "title" },
  { label: "丛书名", key: "series" },
  { label: "出版单位", key: "publisher" },
  { label: "出版地", key: "pubplace" },
  { label: "作者", key: "author" },
  { label: "出版时间", key: "pubdate" },
  { label: "分册名", key: "volumeName" },
  { label: "分册号", key: "volumeNumber" },
  { label: "定价", key: "price" },
  { label: "页数", key: "page" },
  { label: "正文语种", key: "language" },
  { label: "中图法分类", key: "class" },
  { label: "主题词", key: "keyword" },
  { label: "出版作者", key: "pubauthor" },
  { label: "装帧方式", key: "binding" },
  { label: "", type: "divider", width: 'calc(90% + 32px)' },
  { label: "语言分类", key: "isbn_language_cate_id" },
  { label: "年龄分类", key: "isbn_age_cate_id" },
  { label: "特色人物", key: "isbn_featured_character_id" },
  { label: "系列分类", key: "isbn_series_cate_id" },
  { label: "知名品牌", key: "isbn_wellknow_brand_id" },
  { label: "主题标签", key: "isbn_theme_id", type: "tag", width: "80%" },
  { label: "特色标签", key: "isbn_feature_id", type: "tag", width: "80%" },
  // { label: "书架号", key: "biz_bookshelf_id" },
  // // { label: "馆藏号", key: "warehouse_id" },
  // { label: "采购价格", key: "purchase_price" },
  // { label: "购书日期", key: "pubdate" },
  // { label: "所在书库", key: "warehouse_id" },
  // // { label: "内容摘要", key: "seriesCategory", width: "calc(90% + 32px)", type: "textarea" },
];
const formFields2 = [
  { label: "书架号", key: "biz_bookshelf_id" },
  // { label: "馆藏号", key: "warehouse_id" },
  { label: "采购价格", key: "purchase_price" },
  { label: "购书日期", key: "pubdate" },
  { label: "所在书库", key: "warehouse_id" },
  // { label: "内容摘要", key: "seriesCategory", width: "calc(90% + 32px)", type: "textarea" },
]

const topicTags = ref(["文学启蒙", "儿童文学", "名家大师"]);
const featureTags = ref(["解决问题", "勇气", "挑战"]);

const newTopicTag = ref("");
const newFeatureTag = ref("");

const addTag = (type) => {
  if (type === "topic" && newTopicTag.value) {
    topicTags.value.push(newTopicTag.value);
    newTopicTag.value = "";
  } else if (type === "feature" && newFeatureTag.value) {
    featureTags.value.push(newFeatureTag.value);
    newFeatureTag.value = "";
  }
};

const removeTag = (tag, type) => {
  if (type === "topic") {
    topicTags.value = topicTags.value.filter((t) => t !== tag);
  } else if (type === "feature") {
    featureTags.value = featureTags.value.filter((t) => t !== tag);
  }
};

const handleSubmit = () => {
  console.log("Form data:", form);
};
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
</style>