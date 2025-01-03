<template lang="pug">
el-upload.uploader(
  :action="uploadUrl",
  :accept="accept",
  :limit="limit",
  :data="params",
  :headers="headers"
  :on-success="onSuccess",
  :on-error="onError",
  :on-preview="onPreview",
  :on-exceed="onExceed",
  :on-remove="onRemove",
  :before-upload="onBeforeUpload",
  :disabled="disabled"
  v-model:file-list="fileList",
)
  //- el-button(type="primary", v-if="canCtrl") 上传文件
  //- template(#tip, v-if="canCtrl")
  //-   p(style="font-size:12px;color:#999;margin-top:5px;") 文件类型：jpg、png 文件大小：5MB以下
  img(v-if="fileList.length", :src="fileList[0].url", class="avatar")
  el-icon(v-else class="avatar-uploader-icon")
    Plus
el-dialog(v-model="showPreview", style="text-align:center")
  img(:src="curFile.url", style="width: 100%", v-if="['png', 'jpeg', 'jpg'].includes(curFile.type)")
  iframe(v-else, frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes", :src="curFile.url", style="width:100%;height: 100%;")
</template>

<script setup>
import { ElMessage } from 'element-plus';
import {
  reactive, ref, onUnmounted, readonly, onUpdated, computed, watch
} from 'vue';
import { Session } from '/@/utils/storage';

const uploadUrl = import.meta.env.VITE_API_URL + '/api/v1/system/file/upload';
const props = defineProps({
  limit: {
    type: Number,
    default: 1,
  },
  accept: {
    type: String,
    default: '.jpg,.jpeg,.png',
  },
  files: {
    type: Array,
    default() {
      return [];
    },
  },
  canCtrl: {
    type: Boolean,
    default: true,
  },
  size: {
    type: Number,
    default: 50,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  id: {
    type: Number
  }
});
const headers = reactive({
  Authorization: '',
});
const params = ref({
  max_size: 50 * 1024 * 1024,
  allowed_types: JSON.stringify(['jpg', 'jpeg', 'png'])
});
const fileList = ref([]);
const curFile = reactive({
  url: '',
  type: null,
});
const showPreview = ref(false);

const onBeforeUpload = async (rawFile) => {
  if (rawFile.size / 1024 / 1024 > props.size) {
    ElMessage.error(`文件大小不能超过 ${props.size}MB!`);
    return false;
  }
  // config.headers!['Authorization'] = `Bearer ${Session.get('token')}`;


  // const token = localStorage.getItem('token');
  // headers.authorization = `Bearer ${token}`;
  headers.Authorization = `Bearer ${Session.get('token')}`;
  return true;
};

const onSuccess = (res, file, files) => {
  // console.log(res);
  if (!res.code) {
    fileList.value[fileList.value.length - 1] = {
      name: res.data.file[0].new_name,
      url: res.data.file[0].url,
    }
  } else ElMessage.error('上传失败，请重试');
};

const onRemove = (file, files) => {
  // console.log(file);
  // console.log(files);
};

const onPreview = (file) => {
  curFile.type = file.url.split('.').at(-1);
  curFile.url = file.url;
  showPreview.value = true;
};

const onExceed = () => {
  ElMessage.warning(`超出数量限制, 最多上传${props.limit}张`);
};

const onError = (err) => {
  ElMessage.warning(err);
};

watch(() => [props.files, props.id], (val) => {
  if (props.files.length) {
    fileList.value = props.files.flatMap((file) => (file ? ({
      url: `${file}`,
      name: file.split('/').at(-1),
      folder: file.split('/').at(-2),
    }) : []));
  } else fileList.value = [];
});

defineExpose({
  fileList,
});
</script>

<style lang="less">
.uploader .el-upload-list__item {
  line-height: 1.5;
}
</style>

<style scoped>
.avatar {
  width: 178px;
  /* height: 178px; */
  display: block;
}
</style>

<style>
.uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>