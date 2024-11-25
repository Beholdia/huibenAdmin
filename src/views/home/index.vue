<template lang="pug">
.newbook
  .header
    el-input(v-model="isbn" placeholder="请输入ISBN" @keyup.enter="onSearchIsbn")
    el-button(type="primary" @click="onSearchIsbn" ) 确认
  .main
    BaseForm(:formList="formFields")
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
import { ref,reactive } from 'vue';
import {searchIsbn} from '/@/api/books/index.ts';
import {login,captcha} from "/@/api/login";
import BaseForm from "/@/components/form/index.vue";
import pagination from '/@/components/pagination/index.vue'

const onSearchIsbn = async () => {
  // const res = await searchIsbn(isbn.value);
  console.log(res);
}

const isbn= ref('');

const form = reactive({
  bookName: "",
  seriesName: "",
  publisher: "",
  location: "",
  author: "",
  publicationDate: "",
  volumeName: "",
  volumeNumber: "",
  price: "",
  textLanguage: "",
  classification: "",
  keywords: "",
  bindingType: "",
  languageCategory: "",
  ageCategory: "",
  seriesCategory: "",
  shelfNumber: "",
  collectionNumber: "",
  purchasePrice: "",
  purchaseDate: "",
  bookLocation: "",
  contentSummary: "",
});

const formFields = [
  { label: "正书名", key: "bookName" },
  { label: "丛书名", key: "seriesName" },
  { label: "出版单位", key: "publisher" },
  { label: "出版地", key: "location" },
  { label: "作者", key: "author" },
  { label: "出版时间", key: "publicationDate" },
  { label: "分册名", key: "volumeName" },
  { label: "分册号", key: "volumeNumber" },
  { label: "定价", key: "price" },
  { label: "正文语种", key: "textLanguage" },
  { label: "分类", key: "classification" },
  { label: "主题词", key: "keywords" },
  { label: "装帧方式", key: "bindingType" },
  { label: "语言分类", key: "languageCategory" },
  { label: "年龄分类", key: "ageCategory" },
  { label: "系列分类", key: "seriesCategory" },
];

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
  .main{
    padding: 20px;
    .currentForm{
      display:grid;
      grid-template-columns: 1fr 1fr;
      justify-content:space-between;
    }
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