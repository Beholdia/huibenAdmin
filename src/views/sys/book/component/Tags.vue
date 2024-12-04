<template lang="pug">
.group
  el-radio-group(type="button" v-model="type" @change="changeCategory")
    el-radio-button(:label="item.label" :value="item.route" v-for="item in types" size="default")
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const type = ref('');
const props = defineProps({
  biz_type: {
    type: String,
  }
})
watch(() => props.biz_type, (val) => {
  type.value = val;
}, { immediate: true }
)
const types = ref([{
  label: "年龄分类",
  value: "isbn_age_cate",
  route: 'age'
},
{
  label: "主题标签",
  value: "isbn_theme_tag",
  route: 'theme'
},
{
  label: "特色标签",
  value: "isbn_feature_tag",
  route: 'featuretag'
}, {
  label: "系列分类",
  value: "isbn_series_cate",
  route: 'series'
}, {
  label: "特色人物",
  value: "isbn_featured_character",
  route: 'character'
}, {
  label: "知名品牌",
  value: "isbn_wellknow_brand",
  route: 'brand'
}, {
  label: "书籍仓库",
  value: "book_warehouse",
  route: 'warehouse'
},
{
  label: "书架号",
  value: 'shelf',
  route: 'shelf'
}
]);
const changeCategory = (val) => {
  router.push({ name: 'sysbook' + val })
}
</script>

<style lang="less" scoped>
.group {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>