<template lang="pug">
.list
  .filter
    BaseFilter(:filterList="filterList" @onFilter="onFilter" v-model:form="form" ref="filter")
      template(#button)
        el-button(type="primary", @click="changeSaleStatusAll('on_sale')") 批量上架
        el-button(type="primary", @click="changeSaleStatusAll('off_sale')") 批量下架
      template(#button2)
        el-button(type="primary", @click="startBatchPrintJobTest()" :disabled="!printerReady") 批量打印
        el-button(type="primary", @click="openPrinterDrawer") 打印设置
        el-button(type="primary", @click="setShelfs") 书架
  .wrapper
    .huibenStatistic 共有书籍{{statistics?.count_total}}本，借出{{statistics?.count_borrowed}}本，可借{{statistics?.count_available}}本
    el-table(:data="list" style="width: 100%",@selection-change="handleSelectionChange")
      el-table-column(type="selection" width="55")
      el-table-column(prop="id" label="序号" width="100")
      el-table-column( label="封面" width="100")
        template(#default="{row}")
          img.cover(:src="row.pic" v-if="row.pic")
          p(v-else) 暂无封面
      el-table-column(prop="name" label="书名" )
      el-table-column(prop="isbn" label="ISBN号")
      el-table-column(prop="collection_no" label="馆藏书号")
      el-table-column(label="书架号")
        template(#default="{row}")
          div(style="cursor:pointer")
            p(v-if="row.biz_bookshelf_id") {{shelfs.find(item=>item?.biz_bookshelf_id==row.biz_bookshelf_id)}}
            p(v-else) 暂无书架
      el-table-column( label="借阅记录" width="100")
        template(#default="{row}")
          el-button(link disabled v-if="row.borrow_times == 0" )  {{row.borrow_times}}
          el-button(link type="primary" v-else @click="showBorrowRecord(row)") {{row.borrow_times}}
      el-table-column( label="借阅状态"  width="100")
        template(#default="{row}")
          p(v-if="row.borrow_status=== 'available'") 可借
          p(v-else-if="row.borrow_status=== 'borrowed'") 借出
          p(v-else) {{ row.borrow_status }}
      //- el-table-column( label="销售状态"  width="100")
        template(#default="{row}")
          p(v-if="row.sale_status=== 'on_sale'") 可售
          p(v-else-if="row.sale_status=== 'off_sale'") 不可售
          p(v-else) {{ row.sale_status }}
      el-table-column(label="操作" width="100px")
        template(#default="{row}")
          .buttons
            el-button(type="info" size="small" @click="onEdit(row)") 编辑
            el-button(type="primary" size="small" v-if="row.sale_status=== 'off_sale'" @click="changeSaleStatus(row)") 上架
            el-button(type="warning" size="small" v-else @click="changeSaleStatus(row)") 下架
    el-pagination(@current-change="val => getList(val)" background layout="prev, pager, next" :total="total" style="justify-content: center;margin-top: 20px", :page-size="limit")
    NewBookDrawer(v-model:show="showBookDrawer"  @onClose="onCloseBookDrawer" :detail="currentDetail" :showSaleStatus="false")
  BorrowList(:id="borrowId" v-model:show="borrowRecordVisible" )
  PrinterDrawer(v-model="showPrinterDrawer" @printer-ready="onPrinterReady")
  el-dialog(v-model="showShelfVisible")
    el-select(v-model="shelfId" placeholder="请选择书架" style="width: 100%")
      el-option(v-for="item in shelfs" :key="item.biz_bookshelf_id" :label="item.name" :value="item.biz_bookshelf_id")
    template(#footer)
      el-button(@click="showShelfVisible = false") 取消
      el-button(type="primary" @click="onSetShelf") 确定
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { bookList, changeSaleStatus as changeSaleStatusApi, printBook, shelfOption, setShelf } from '/@/api/books/index.ts';
import BaseFilter from '/@/components/form/BaseFilter.vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import NewBookDrawer from './component/newBookDrawer.vue';
import BorrowList from './component/BorrowList.vue';
import PrinterDrawer from '/@/components/PrinterDrawer.vue'


const form = ref({
  keyword: null,
});

const list = ref([]);
const page = ref(1);
const total = ref(0);
const limit = ref(10);
const selectedId = ref(null);
const titleName = ref(null);

const shelfs = ref([])

// 借阅记录的弹窗
const borrowId = ref(null)
const borrowRecordVisible = ref(false)
const showBorrowRecord = (row) => {
  borrowId.value = row.id;
  borrowRecordVisible.value = true
}
// 新书入库的抽屉
const showBookDrawer = ref(false)
const currentDetail = ref(null);

const onEdit = (row) => {
  currentDetail.value = row;
  showBookDrawer.value = true;
}

const filterList = [{
  label: '关键词',
  model: 'keyword',
  type: 'input',
  placeholder: '书名或ISBN'
},
{
  label: '借阅状态',
  model: 'borrow_status',
  type: 'select',
  options: [{
    label: '可借',
    value: 'available'
  },
  {
    label: '借出',
    value: 'borrowed'
  }
  ]
},
{
  label: '上架状态',
  model: 'sale_status',
  type: 'select',
  options: [{
    label: '上架',
    value: 'on_sale'
  },
  {
    label: '下架',
    value: 'off_sale'
  }
  ]
}
];

const onFilter = () => {
  page.value = 1;
  getList(page.value);
};
const goAdd = () => {
  selectedId.value = null;
  titleName.value = '创建内容';
  serviceDrawer.show = true;
};

const goDetail = (id) => {
  titleName.value = '服务管理详情';
  selectedId.value = id;
  serviceDrawer.show = true;
};

const goEdit = (id) => {
};
const refreshList = () => {
  getList(page.value);
};

const onDel = async (val) => {
  await proxy.$api.yellow_service.del({ id: val });
  getList(page.value);
};

const changeSaleStatus = async (row) => {
  try {
    await ElMessageBox.confirm(`确定${row.sale_status === 'on_sale' ? '下架' : '上架'}该书籍吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await changeSaleStatusApi({ biz_books_entity_ids: [row.id], sale_status: row.sale_status === 'on_sale' ? 'off_sale' : 'on_sale' });
    ElMessage.success('操作成功');
    await getList(page.value);
  } catch (error) {
    console.log(error);
  }
}
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
  // console.log(multipleSelection.value);
};
const changeSaleStatusAll = async (status) => {
  try {
    if (!multipleSelection.value.length) {
      ElMessage({
        message: '请选择书籍',
        type: 'warning',
      });
      return;
    }
    await ElMessageBox.confirm(`确定批量处理吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await changeSaleStatusApi({ biz_books_entity_ids: multipleSelection.value.map((item) => item.id), sale_status: status });
    getList(page.value);
  } catch (error) {
    console.log(error);
  }
}

const statistics = ref();
const getList = async (val) => {
  if (!val) return;
  page.value = val;
  const res = await bookList({ page: page.value, limit: limit.value, ...form.value });
  total.value = res.data.total;
  list.value = res.data.items;
  statistics.value = res.data.statistics;
};


const showShelfVisible = ref(false);
const shelfId = ref(null);
const setShelfs = async (status) => {
  try {
    if (!multipleSelection.value.length) {
      ElMessage({
        message: '请选择书籍',
        type: 'warning',
      });
      return;
    }
    showShelfVisible.value = true;


  } catch (error) {
    console.log(error);
  }
}
const onSetShelf = async () => {
  await setShelf({ book_entity_ids: multipleSelection.value.map((item) => item.id), biz_bookshelf_id: status });
  await getList(page.value);
  ElMessage.success('操作成功');
}

// 添加打印相关的响应式变量
const showPrinterDrawer = ref(false)
const nMPrintSocket = ref(null)
const printerReady = ref(false)
const printSettings = ref(null)

// 打开打印机设置抽屉
const openPrinterDrawer = () => {
  showPrinterDrawer.value = true
}

// 打印机就绪回调
const onPrinterReady = ({ nMPrintSocket: printer, settings }) => {
  nMPrintSocket.value = printer
  printSettings.value = settings
  printerReady.value = true
  ElMessage.success('打印机已就绪')
}

// 实现批量打印功能
const startBatchPrintJobTest = async () => {
  if (!multipleSelection.value.length) {
    ElMessage.warning('请选择要打印的书籍')
    return
  }

  if (!printerReady.value) {
    ElMessage.error('请先完成打印机设置')
    return
  }

  try {
    // 开始打印任务
    const startRes = await nMPrintSocket.value.startJob(
      printSettings.value.density,
      printSettings.value.label_type,
      printSettings.value.print_mode,
      multipleSelection.value.length
    )

    if (startRes.resultAck.errorCode !== 0) {
      throw new Error('开始打印任务失败')
    }

    // 逐个打印选中的书籍
    for (let book of multipleSelection.value) {
      // 初始化画板
      await nMPrintSocket.value.InitDrawingBoard({
        width: 40,
        height: 30,
        rotate: 0,
        path: "ZT001.ttf",
        verticalShift: 0,
        HorizontalShift: 0,
      })

      await nMPrintSocket.value.DrawLableText({
        x: 0,
        y: 0.9,
        width: 40,
        height: 2.5,
        value: '嘉兴棒棒糖绘本乐园',
        fontSize: 1.9,
        lineMode: 6,
        textAlignHorizonral: 1
      })
      await nMPrintSocket.value.DrawLableText({
        x: 3,
        y: 3.5,
        width: 13,
        height: 4.2,
        value: '馆藏ID',
        fontSize: 3.2,
        lineMode: 6
      })

      // 馆藏id
      await nMPrintSocket.value.DrawLableText({
        x: 16,
        y: 3.8,
        width: 30,
        height: 4.2,
        value: book.collection_no,
        fontSize: 3.2,
        lineMode: 6
      })
      await nMPrintSocket.value.DrawLableText({
        x: 3,
        y: 8.5,
        width: 9,
        height: 3.5,
        value: '书名',
        fontSize: 2.6,
        lineMode: 6
      })

      // 书名
      await nMPrintSocket.value.DrawLableText({
        x: 10.4,
        y: 8.9,
        width: 30,
        height: 3.1,
        value: book.name,
        fontSize: 2.3,
        lineMode: 6
      })

      await nMPrintSocket.value.DrawLableText({
        x: 3,
        y: 12.4,
        width: 8.6,
        height: 3.5,
        value: '书仓',
        fontSize: 2.6,
        lineMode: 6
      })
      await nMPrintSocket.value.DrawLableText({
        x: 10.4,
        y: 12.4,
        width: 30,
        height: 3.5,
        value: '嘉兴凯米',
        fontSize: 2.6,
        lineMode: 6
      })
      const age = (await printBook(book.id)).data.age;
      await nMPrintSocket.value.DrawLableText({
        x: 3,
        y: 16.1,
        width: 7.8,
        height: 3.5,
        value: '年龄',
        fontSize: 2.6,
        lineMode: 6
      })
      await nMPrintSocket.value.DrawLableText({
        x: 10.4,
        y: 16.4,
        width: 30,
        height: 3.1,
        value: age,
        fontSize: 2.3,
        lineMode: 6
      })

      await nMPrintSocket.value.DrawLableBarCode({
        x: 7.6,
        y: 21.9,
        width: 30,
        height: 8,
        value: book.collection_no,
        fontSize: 3,
        textPosition: 0,
        codeType: 20,
      })

      // 提交打印
      await nMPrintSocket.value.commitJob(null, JSON.stringify({
        printerImageProcessingInfo: {
          printQuantity: 1
        }
      }))
    }

    // 结束打印任务
    await nMPrintSocket.value.endJob()
    ElMessage.success('打印完成')

  } catch (err) {
    console.error('打印失败:', err)
    ElMessage.error('打印失败')
  }
}

// 关闭编辑
const onCloseBookDrawer = async (refresh, id) => {
  if (refresh) {
    await getList(page.value);
  }
}

onMounted(async () => {
  await getList(page.value);
  shelfs.value = (await shelfOption()).data.items;
  // const age = (await printBook(749)).data.age;
});
</script>

<style lang="less" scoped>
.cover {
  width: 80px;
  height: 100px;
  object-fit: cover;
}

:deep(.el-button--small) {
  margin-left: 0px !important;
  margin-bottom: 6px;
}
</style>