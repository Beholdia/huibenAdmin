<template lang="pug">
.group
  el-radio-group(type="button" v-model="type" @change="changeCategory")
    el-radio-button(:label="item.label" :value="item.route" v-for="item in sysXcxTags" size="default")
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { sysXcxTags } from '/@/dicts'

const router = useRouter();
const route = useRoute();
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
const changeCategory = (val) => {
  router.push({ name: 'sysxcx' + val })
}
</script>

<style lang="less" scoped>
.group {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>