<template lang="pug">
div(style="width:100%;display:flex;column-gap:10px" )
  el-cascader(
    v-model="area"
    :options="levelData"
    :props="cascaderProps" placeholder="请选择城市"
    @change="getAttributeData"
    style="width:100%"
    ref='cascader'
    clearable
  )
  el-select(v-model="town" placeholder="请选择街道" :size="props.isFilter?'default':'large' " v-if="isTown" @change="getAttributetownData")
    el-option(v-for="item in townList" :key="item.town" :label="item.name" :value="item.name")
</template>

<script setup>
import dayjs from 'dayjs';
// import { areaList } from '@vant/area-data';
import {
  town as townData, level as levelData, area as areaData, data as allData,
} from 'province-city-china/data';

const props = defineProps({
  detail: {
    type: Object,
  },
  isTown: {
    type: Boolean,
    default: false,
  },
});

const area = ref([]);
const town = ref('');
const cascader = ref(null);
const cascaderProps = { expandTrigger: 'hover', label: 'name', value: 'code' };

const countyCode = ref('');

const getAttributeData = () => {
  town.value = '';
  const cascaderDetail = cascader.value.getCheckedNodes();
  if (area.value.length) countyCode.value = cascaderDetail[0].data.code;
  const areavalue = [...area.value];
};

defineExpose({
  data: area,
  town,
});

watch(() => props.detail, () => {
  if (props.detail?.province) {
  area.value = [String(props.detail.province.province_id),String(props.detail.city.city_id),String(props.detail.county.county_id)];
}
});
</script>
