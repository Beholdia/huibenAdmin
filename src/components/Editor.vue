<template>
  <div style="border: 1px solid #ccc;width:100%;">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="simple"
    />
    <Editor
      style="height: 500px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      mode="simple"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import {
  onBeforeUnmount, ref, shallowRef, onMounted,
  watch,
} from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { Session } from '/@/utils/storage';

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
});

const params = ref({
  max_size: 888888,
  allowed_types: JSON.stringify(['jpg', 'jpeg', 'png'])
});

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref('');

watch(() => props.content, (newVal) => {
  valueHtml.value = newVal;
});

const toolbarConfig = {};
const editorConfig = ref({
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      server: import.meta.env.VITE_API_URL + '/api/v1/system/file/upload',
      fieldName: 'file',
      // 单个文件的最大体积限制，默认为 2M
      maxFileSize: 2 * 1024 * 1024, // 1M
      // 最多可上传几个文件，默认为 100
      maxNumberOfFiles: 1,
      // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
      allowedFileTypes: ['image/*'],
      headers: {
      },
      meta:params.value,
      // 跨域是否传递 cookie ，默认为 false
      withCredentials: false,
      // 超时时间，默认为 10 秒
      timeout: 30 * 1000, // 5 秒
      customInsert(res, insertFn) {

        console.log(res)
        if (!res.code) {
          insertFn(res.data.file[0].url, '', '');
        } else ElMessage.error('上传失败');
      },
    },
  },
});

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

const getHtml = () => {
  const editor = editorRef.value;
  return editor ? editor.getHtml() : '';
};

onMounted(async () => {
  editorConfig.value.MENU_CONF.uploadImage.headers['authorization'] = `Bearer ${Session.get('token')}`;
});

defineExpose({
  getHtml,
});
</script>
