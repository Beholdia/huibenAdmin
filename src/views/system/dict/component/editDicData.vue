<template>
  <div class="system-edit-dic-container">
    <el-dialog :title="(ruleForm.dict_code !== 0 ? '修改' : '添加') + '字典'" v-model="isShowDialog" width="769px">
      <el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="90px">
        <el-form-item label="字典类型">
          <el-input v-model="ruleForm.dict_type" :disabled="true" />
        </el-form-item>
        <el-form-item label="数据标签" prop="dict_label">
          <el-input v-model="ruleForm.dict_label" placeholder="请输入数据标签" />
        </el-form-item>
        <el-form-item label="数据键值" prop="dict_value">
          <el-input v-model="ruleForm.dict_value" placeholder="请输入数据键值" />
        </el-form-item>
        <el-form-item label="显示排序" prop="dict_sort">
          <el-input-number v-model="ruleForm.dict_sort" controls-position="right" :min="0" />
        </el-form-item>

        <el-form-item label="系统默认">
          <el-switch v-model="ruleForm.is_default" active-text="是" inactive-text="否" :active-value="1"
            :inactive-value="0"></el-switch>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default">{{ ruleForm.dict_code !== 0 ? '修 改' : '添 加'
            }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import { getData, addData, editData } from '/@/api/system/dict/data';
import { ElMessage } from "element-plus";
interface RuleFormState {
  dict_code: number;
  dict_label: string;
  dict_value: string;
  dict_sort: number;
  is_default: number;
  status: number;
  remark: string;
  dict_type: string;
}
interface DicState {
  isShowDialog: boolean;
  ruleForm: RuleFormState;
  rules: {}
}

export default defineComponent({
  name: 'systemEditDicData',
  props: {
    dict_type: {
      type: String,
      default: () => ''
    }
  },
  setup(prop, { emit }) {
    const formRef = ref<HTMLElement | null>(null);
    const state = reactive<DicState>({
      isShowDialog: false,
      ruleForm: {
        dict_code: 0,
        dict_label: '',
        dict_value: '',
        dict_sort: 0,
        is_default: 0,
        status: 1,
        remark: '',
        dict_type: prop.dict_type
      },
      rules: {
        dict_label: [
          { required: true, message: "数据标签不能为空", trigger: "blur" }
        ],
        dict_value: [
          { required: true, message: "数据键值不能为空", trigger: "blur" }
        ],
        dict_sort: [
          { required: true, message: "数据顺序不能为空", trigger: "blur" }
        ]
      }
    });
    // 打开弹窗
    const openDialog = (row: RuleFormState | null) => {
      resetForm();
      if (row) {
        getData(row.dict_code).then((res: any) => {
          state.ruleForm = res.data.dict
        })
        state.ruleForm = row;
      }
      state.isShowDialog = true;
      console.log(prop);
    };
    const resetForm = () => {
      state.ruleForm = {
        dict_code: 0,
        dict_label: '',
        dict_value: '',
        dict_sort: 0,
        is_default: 0,
        status: 1,
        remark: '',
        dict_type: prop.dict_type
      }
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    // 取消
    const onCancel = () => {
      closeDialog();
    };
    // 新增
    const onSubmit = () => {
      const formWrap = unref(formRef) as any;
      if (!formWrap) return;
      formWrap.validate((valid: boolean) => {
        if (valid) {
          if (state.ruleForm.dict_code !== 0) {
            //修改
            editData(state.ruleForm).then(() => {
              ElMessage.success('字典数据修改成功');
              closeDialog(); // 关闭弹窗
              emit('dataList')
            })
          } else {
            //添加
            addData(state.ruleForm).then(() => {
              ElMessage.success('字典数据添加成功');
              closeDialog(); // 关闭弹窗
              emit('dataList')
            })
          }
        }
      });
    };
    return {
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      formRef,
      ...toRefs(state),
    };
  },
});
</script>
