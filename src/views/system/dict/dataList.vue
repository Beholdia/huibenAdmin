<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="字典类型" prop="dict_type">
            <el-input v-model="tableData.param.dict_type" placeholder="请输入字典类型" clearable size="default"
              @keyup.enter.native="dataList" />
          </el-form-item>
          <el-form-item label="字典标签" prop="dict_label">
            <el-input v-model="tableData.param.dict_label" placeholder="请输入字典标签" clearable size="default"
              @keyup.enter.native="dataList" />
          </el-form-item>
          <el-form-item label="状态" prop="status" style="width: 200px;">
            <el-select v-model="tableData.param.status" placeholder="字典状态" clearable size="default"
              style="width: 240px">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="dataList">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" @click="resetQuery(queryRef)">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
            </el-button>
            <el-button size="default" type="success" class="ml10" @click="onOpenAddDic">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增字典
            </el-button>
            <el-button size="default" type="danger" class="ml10" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete />
              </el-icon>
              删除字典
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="字典编码" align="center" prop="dict_code" />
        <el-table-column label="字典标签" align="center" prop="dict_label" />
        <el-table-column label="字典键值" align="center" prop="dict_value" />
        <el-table-column label="字典排序" align="center" prop="dict_sort" />
        <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" align="center" prop="created_at" width="180" />
        <el-table-column prop="status" label="字典状态" show-overflow-tooltip>
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status">启用</el-tag>
            <el-tag type="info" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenEditDic(scope.row)">修改</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.page"
        v-model:limit="tableData.param.limit" @pagination="dataList" />
    </el-card>
    <EditDic ref="editDicRef" @dataList="dataList" :dict_type="tableData.param.dict_type" />
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditDic from '/@/views/system/dict/component/editDicData.vue';
import { getDataList, deleteData } from "/@/api/system/dict/data";
import { useRoute } from 'vue-router';



// 定义接口来定义对象的类型
interface TableDataRow {
  dict_code: number;
  dict_sort: number;
  dict_label: string;
  dict_value: string;
  dict_type: string;
  status: number,
  remark: string;
  created_at: string
}
interface TableDataState {
  ids: number[];
  tableData: {
    data: Array<TableDataRow>;
    total: number;
    loading: boolean;
    param: {
      page: number;
      limit: number;
      dict_type: string;
      dict_label: string;
      status: string;
    };
  };
}

export default defineComponent({
  name: 'apiV1SystemDictDataList',
  components: { EditDic },
  setup() {
    const route = useRoute();
    const addDicRef = ref();
    const editDicRef = ref();
    const queryRef = ref();
    const state = reactive<TableDataState>({
      ids: [],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          page: 1,
          limit: 10,
          dict_label: '',
          dict_type: '',
          status: ''
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      dataList()
    };
    const dataList = () => {
      getDataList(state.tableData.param).then((res: any) => {
        state.tableData.data = res.data.list;
        state.tableData.total = res.data.total;
      });
    };
    // 打开新增字典弹窗
    const onOpenAddDic = () => {
      console.log(state.tableData.param.dict_type);
      editDicRef.value.openDialog();

    };
    // 打开修改字典弹窗
    const onOpenEditDic = (row: TableDataRow) => {
      editDicRef.value.openDialog(row);
    };
    // 删除字典
    const onRowDel = (row: TableDataRow) => {
      let msg = '你确定要删除所选数据？';
      let ids: number[] = [];
      if (row) {
        msg = `此操作将永久删除用户：“${row.dict_label}”，是否继续?`
        ids = [row.dict_code]
      } else {
        ids = state.ids
      }
      if (ids.length === 0) {
        ElMessage.error('请选择要删除的数据。');
        return
      }
      ElMessageBox.confirm(msg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteData(ids).then(() => {
            ElMessage.success('删除成功');
            dataList();
          })
        })
        .catch(() => { });
    };
    // 页面加载时
    onMounted(() => {
      const dict_type = route.params && route.params.dictType;
      state.tableData.param.dict_type = <string>dict_type;
      console.log(state.tableData.param.dict_type);
      initTableData();
    });
    /** 重置按钮操作 */
    const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
      dataList()
    };
    // 多选框选中数据
    const handleSelectionChange = (selection: TableDataRow[]) => {
      state.ids = selection.map(item => item.dict_code)
    };
    return {
      addDicRef,
      editDicRef,
      queryRef,
      onOpenAddDic,
      onOpenEditDic,
      onRowDel,
      dataList,
      resetQuery,
      handleSelectionChange,
      ...toRefs(state),
    };
  },
});
</script>
