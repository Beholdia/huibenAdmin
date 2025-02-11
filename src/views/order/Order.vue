<template lang="pug">
.order
    .header
        .group
            el-radio-group(type="button" v-model="status" @change="changeStatus" )
                div(v-for="item in tabs")
                    el-badge(:value="statics[item.value]" :hidden="!statics[item.value]")
                        el-radio-button(:label="item.label" :value="item.value"  size="large")
        .ruku(v-if="status == 'picked_up' || status == 'in_stock' ")
            el-input(v-model="collection_no" placeholder="输入馆藏id" style="width: 300px;" size="default" @keyup.enter="confirmRuku" ref="myInput")
            el-button(type="primary" @click="confirmRuku" size="default") 确认入库
    .search
        //- BaseFilter(:filterList="filterList" @onFilter="onFilter" v-model:form="form")
        el-input(placeholder="订单编号" v-model="form.keyword" style="width: 200px;" clearable)
        el-select( v-model="form.is_canceled" style="width: 200px;margin:20px 30px" )
            el-option(value=" " label="正常订单")
            el-option(value="Y" label="已取消订单")
        el-button(type="primary" @click="onFilter") 查询
        el-button(color="black" @click="openPrinterDrawer" v-show="status == 'wait_to_delivery'") 打印设置
    .list
        .empty(v-if="!list.length") 暂无数据
        .item(v-for="item in list" :key="item.biz_books_order_id")
            .header
                .left
                    p 序号：{{item.biz_books_order_id}}
                    p 订单编号：{{item.biz_books_order_no}}
                    p 创建时间：{{item.created_at}}
                    p 书箱：{{item.biz_user.book_box==0?'无':'有'}}
                    p 配送员：{{item.biz_delivery_rider?.name}}
                    p(v-if="status == 'in_delivery'") 提书时间：{{item.delivery_grab_at}}
                    p(v-if="status == 'delivered'") 送达时间：{{item.delivery_complete_at}}
                    p(v-if="item.return_started_at") 归还时间： {{item.return_started_at}}
                .right(v-show="status=='wait_to_delivery' ")
                    template(v-if="item.user_order_status != 'canceled'")
                        el-button(type="primary" size="small" v-if="!item.packed_at" @click="packed(item)") 完成打包
                        el-button(color="gray" size="small" v-if="item.packed_at") 已打包

                        el-button(color="black" size="small" @click="printLabel(item)" :disabled="!printerReady") 打印标签
                        el-button(color="black" size="small" @click="previewLabel(item)" :disabled="!printerReady") 预览标签
                    el-button(type="info" size="small" v-if="item.user_order_status == 'canceled'") 订单已取消
            .content
                .info
                    .avatar(style="display: flex;flex-direction:column;align-items: center;gap:10px")
                        el-avatar(:src="item.biz_user.avatar" :preview-src-list = " [ item.biz_user.avatar ] " :preview-teleported="true" style="width: 50px; height: 50px")
                        | {{ item.biz_user?.biz_vip_detail?.main_title +'-'+item.biz_user?.biz_vip_detail?.sub_title}}
                    .name
                        //- p {{item.biz_user.nickname}}
                        //- p {{item.biz_user.phone}}
                        p {{item.biz_address_json.name}}
                        p {{item.biz_address_json.phone}}
                        p {{item.biz_address_json.province.province_name}}{{item.biz_address_json.city.city_name}}{{item.biz_address_json.county.county_name}}{{item.biz_address_json.community}}{{item.biz_address_json.detaild_address}}
                        el-button(size="small" @click="editAddress(item)") 编辑地址
                .books
                    .books_item(v-for="book,index in item.goods" :key="index")
                        .cover()
                            el-image(:src="book.book_info?.pic"  style="width: 100px; height: 100px")
                            img.returned(v-if="book.borrow_status=='returned' " class="rukuIcon" class="rukuIcon" src="../../assets/returned.png" )
                            // el-icon(v-if="book.borrow_status=='returned' " class="rukuIcon" size="30")
                                CircleCheck
                        p {{book.book_info?.name}}
                        p {{book.book_info?.collection_no}}
    el-pagination(@current-change="val => getList(val)" background layout="prev, pager, next" :total="total" style="justify-content: center;margin-top: 20px", :page-size="limit")
    PrinterDrawer(v-model="showPrinterDrawer" @printer-ready="onPrinterReady" )
    EditAddress(v-model:show= "showAddress" :detail="address"  :id="orderId" @onClose="onCloseEditAddress")
    el-dialog(v-model="previewVisible")
        img(:src="previewImage" style="width:600px")

</template>

<script setup>
import { orderlist, confirmPack } from '/@/api/order'
import Zhifu from './Zhifu.vue'
import Widthdrawal from './Widthdrawal.vue'
import { onMounted } from 'vue'
import BaseFilter from '/@/components/form/BaseFilter.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PrinterDrawer from '/@/components/PrinterDrawer.vue'
import EditAddress from './component/EditAddress.vue'
import { shelfOption } from '/@/api/books/index.ts';


const status = ref('wait_to_delivery')
const tabs = [
    { label: '待配送', value: 'wait_to_delivery' },
    { label: '配送中', value: 'in_delivery' },
    { label: '送达', value: 'delivered' },
    { label: '取书新单', value: 'wait_to_grap' },
    { label: '待取书', value: 'wait_to_pickup' },
    { label: '已取书', value: 'picked_up' },
    { label: '入库', value: 'in_stock' }]

const delivery_statictics = ref({})
const picked_up_statictics = ref({})
const statics = ref({});

const collection_no = ref(null);

const list = ref([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);

const filterList = [
    {
        label: '关键词',
        model: 'keyword',
        type: 'input',
        placeholder: '借书订单号/馆藏id'
    },
    {
        label: '订单类型',
        model: 'is canceled',
        type: 'select',
        options: [
            { label: '正常订单', value: ' ' },
            { label: '已取消订单', value: 'Y' },
        ],
        hidden: status.value != 'wait_to_delivery'

    },
];
const form = ref({
    keyword: null,
    is_canceled: ''
});
const onFilter = () => {
    page.value = 1;
    getList(page.value);
};
// const list = ref({
//     wait_to_delivery: [],
//     in_delivery: [],
//     delivered: [],
//     wait_to_pickup: [],
//     picked_up: [],
//     in_stock: [],
// })
// 完成打包
const packed = async (item) => {
    try {
        const res = await ElMessageBox.confirm('确定完成打包？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
        console.log(res, item);
        await confirmPack({ biz_order_id: item.biz_books_order_id })
        item.packed_at = '打包了,不要再点了'
    } catch (error) {
        console.log(error)
    }
}

const changeStatus = (val) => {
    status.value = val;
    form.value.keyword = null;
    form.value.is_canceled = '';
    page.value = 1;
    total.value = 1;
    getList();
}
// 确认入库
const confirmRuku = async () => {
    await getList(null, { book_warehousing: 'Y', keyword: collection_no.value })
}
const getList = async (pageNum, returnObj = {}) => {
    if (pageNum) page.value = pageNum

    const res = await orderlist({ order_status: status.value, page: page.value, limit: limit.value, keyword: form.value.keyword, is_canceled: form.value.is_canceled, ...returnObj })
    list.value = res.data.items || []
    delivery_statictics.value = res.data.delivery_statictics
    picked_up_statictics.value = res.data.picked_up_statictics
    statics.value = {
        wait_to_delivery: res.data.delivery_statictics.book_order_delivery_status_not_start + res.data.delivery_statictics.book_order_delivery_status_packed,
        in_delivery: res.data.delivery_statictics.book_order_delivery_status_in_delivery,
        wait_to_pickup: res.data.pickup_statictics.book_order_pickup_status_pending
    }
    total.value = res.data.total
}

const myInput = ref(null);

watch(() => [status.value, myInput.value], () => {
    if (status.value == 'picked_up' && myInput.value) {
        myInput.value.focus();

    }
})

const shelfs = ref([])

onMounted(async () => {
    await getList();
    shelfs.value = (await shelfOption()).data.items;
})

const address = ref({})
const orderId = ref(0);
const showAddress = ref(false);
// 修改地址
const editAddress = (item) => {
    address.value = item.biz_address_json;
    orderId.value = item.biz_books_order_id;
    if (!orderId.value) return;
    showAddress.value = true;
}
const onCloseEditAddress = async (refresh) => {
    address.value = {};
    orderId.value = 0;
    if (refresh) await getList()
}


const showPrinterDrawer = ref(false)

const nMPrintSocket = ref(null)
const printerReady = ref(false)
const printSettings = ref(null)

const openPrinterDrawer = () => {
    showPrinterDrawer.value = true
}

const onPrinterReady = ({ nMPrintSocket: printer, settings }) => {
    nMPrintSocket.value = printer
    printSettings.value = settings
    printerReady.value = true
    ElMessage.success('打印机已就绪')
}

const printLabel = async (item) => {
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
            1
        )

        if (startRes.resultAck.errorCode !== 0) {
            throw new Error('开始打印任务失败')
        }

        // 初始化画板(50mm x 30mm)
        await nMPrintSocket.value.InitDrawingBoard({
            width: 60,
            height: 80,
            rotate: 0
        })

        // 构建打印数据
        const printElements = [
            {
                type: "text",
                json: {
                    x: 4.8,
                    y: 3.0,
                    width: 49,
                    height: 4.2,
                    value: '嘉兴棒棒糖绘本乐园-配送单',
                    fontSize: 3.2,
                    lineMode: 6,
                    textAlignHorizonral: 1,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            },
            // 订单号
            {
                type: "text",
                json: {
                    x: 3.0,
                    y: 8.9,
                    width: 52.3,
                    height: 3.5,
                    value: `订单号`,
                    fontSize: 2.6,
                    lineMode: 6,
                    textAlignHorizonral: 0,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            },
            {
                type: "text",
                json: {
                    x: 3.3,
                    y: 12.9,
                    width: 52.2,
                    height: 4.2,
                    value: `${item.biz_books_order_no}`,
                    fontSize: 3.2,
                    lineMode: 6,
                    textAlignHorizonral: 0,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            },
            // 创建时间
            {
                type: "text",
                json: {
                    x: 3.0,
                    y: 18.6,
                    width: 16.7,
                    height: 3.5,
                    value: `创建时间`,
                    fontSize: 2.6,
                    lineMode: 6,
                    textAlignHorizonral: 0,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            },
            {
                type: "text",
                json: {
                    x: 17,
                    y: 18.6,
                    width: 30,
                    height: 3.5,
                    value: `${item.created_at}`,
                    fontSize: 2.6,
                    lineMode: 6,
                    textAlignHorizonral: 0,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            },
            // 用户信息
            {
                type: "text",
                json: {
                    x: 3,
                    y: 24.3,
                    width: 35,
                    height: 4.2,
                    value: `${item.biz_user.nickname}  ${item.biz_user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}`,
                    fontSize: 3.2,
                    lineMode: 6,
                    textAlignHorizonral: 0,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            },
            // 地址
            {
                type: "text",
                json: {
                    x: 3,
                    y: 29.5,
                    width: 52.7,
                    height: 3.5,
                    value: `${item.biz_address_json.province.province_name}${item.biz_address_json.city.city_name}${item.biz_address_json.county.county_name}${item.biz_address_json.detaild_address}`,
                    fontSize: 2.6,
                    lineMode: 6,
                    textAlignHorizonral: 0,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            },
            {
                type: "text",
                json: {
                    x: 10.6,
                    y: 75.5,
                    width: 42,
                    height: 2.4,
                    value: `请爱护书籍，有任何问题请联系棒棒糖微信客服`,
                    fontSize: 1.8,
                    lineMode: 6,
                    textAlignHorizonral: 0,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            },
            {
                type: 'barcode', // 条形码
                json: {
                    x: 17.5,
                    y: 67,
                    width: 25,
                    height: 8,
                    value: `${item.biz_books_order_no}`,
                    fontSize: 3.2,
                    textPosition: 0,
                    codeType: 20,
                    rotate: 0,
                }
            },
            {
                type: "line",
                json: {
                    x: 3,
                    y: 35.8,
                    height: 0.4,
                    width: 54.1,
                    rotate: 0,
                    lineType: 1,
                    // dashwidth: [1, 1],
                },
            },
        ]

        // 添加书籍信息
        let y = 39
        item.goods.forEach(book => {
            printElements.push({
                type: "text",
                json: {
                    x: 3,
                    y,
                    width: 45.2,
                    height: 3.5,
                    value: `${book.book_info.name} (${book.book_info.collection_no}) ${book.book_info?.biz_bookshelf_id ? shelfs.value.find(item => item?.biz_bookshelf_id == book.book_info.biz_bookshelf_id)?.name : '暂无'}`,
                    fontSize: 2.6,
                    lineMode: 6,
                    textAlignHorizonral: 0,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            })
            y += 5
        })

        // 打印所有元素
        for (let element of printElements) {
            switch (element.type) {
                case "text":
                    await nMPrintSocket.value.DrawLableText(element.json)
                    break
                // 可以添加其他类型元素的处理
                case "barcode":
                    await nMPrintSocket.value.DrawLableBarCode(element.json)
                    break
                case "line":
                    await nMPrintSocket.value.DrawLableLine(element.json)
                    break
            }
        }

        // 提交打印
        const commitRes = await nMPrintSocket.value.commitJob(null, JSON.stringify({
            printerImageProcessingInfo: {
                printQuantity: 1
            }
        }))
        console.log('打印回调', commitRes)

        // 处理返回的页码
        if (commitRes.resultAck.printQuantity == 1 && commitRes.resultAck.onPrintPageCompleted == 1) {
            // 结束打印任务
            const endRes = await nMPrintSocket.value.endJob();
            if (endRes.resultAck.errorCode === 0) {
                ElMessage.success('打印成功');
            }
        } else {
            console.log('发送下一页打印数据')
            // ElMessage.error('打印失败，未返回页码');
        }
    } catch (err) {
        console.error('打印失败:', err)
        ElMessage.error('打印失败')
    }
}
const previewImage = ref('')
const previewVisible = ref(false);

const previewLabel = async (item) => {
    try {
        // 初始化画板(50mm x 30mm)
        await nMPrintSocket.value.InitDrawingBoard({
            width: 60,
            height: 80,
            rotate: 0
        })

        // 构建打印数据
        const printElements = [
            {
                type: "text",
                json: {
                    x: 4.8,
                    y: 3.0,
                    width: 49,
                    height: 4.2,
                    value: '嘉兴棒棒糖绘本乐园-配送单',
                    fontSize: 3.2,
                    lineMode: 6,
                    textAlignHorizonral: 1,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            },
            // 订单号
            {
                type: "text",
                json: {
                    x: 3.0,
                    y: 8.9,
                    width: 52.3,
                    height: 3.5,
                    value: `订单号`,
                    fontSize: 2.6,
                    lineMode: 6,
                    textAlignHorizonral: 0,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            },
            {
                type: "text",
                json: {
                    x: 3.3,
                    y: 12.9,
                    width: 52.2,
                    height: 4.2,
                    value: `${item.biz_books_order_no}`,
                    fontSize: 3.2,
                    lineMode: 6,
                    textAlignHorizonral: 0,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            },
            // 创建时间
            {
                type: "text",
                json: {
                    x: 3.0,
                    y: 18.6,
                    width: 16.7,
                    height: 3.5,
                    value: `创建时间`,
                    fontSize: 2.6,
                    lineMode: 6,
                    textAlignHorizonral: 0,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            },
            {
                type: "text",
                json: {
                    x: 17,
                    y: 18.6,
                    width: 30,
                    height: 3.5,
                    value: `${item.created_at}`,
                    fontSize: 2.6,
                    lineMode: 6,
                    textAlignHorizonral: 0,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            },
            // 用户信息
            {
                type: "text",
                json: {
                    x: 3,
                    y: 24.3,
                    width: 35,
                    height: 4.2,
                    value: `${item.biz_address_json.name}  ${item.biz_address_json.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}`,
                    fontSize: 3.2,
                    lineMode: 6,
                    textAlignHorizonral: 0,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            },
            // 地址
            {
                type: "text",
                json: {
                    x: 3,
                    y: 29.5,
                    width: 52.7,
                    height: 3.5,
                    value: `${item.biz_address_json.province.province_name}${item.biz_address_json.city.city_name}${item.biz_address_json.county.county_name}${item.biz_address_json.detaild_address}`,
                    fontSize: 2.6,
                    lineMode: 6,
                    textAlignHorizonral: 0,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            },
            {
                type: "text",
                json: {
                    x: 10.6,
                    y: 75.5,
                    width: 42,
                    height: 2.4,
                    value: `请爱护书籍，有任何问题请联系棒棒糖微信客服`,
                    fontSize: 1.8,
                    lineMode: 6,
                    textAlignHorizonral: 0,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            },
            {
                type: 'barcode', // 条形码
                json: {
                    x: 17.5,
                    y: 67,
                    width: 25,
                    height: 8,
                    value: `${item.biz_books_order_no}`,
                    fontSize: 3.2,
                    textPosition: 0,
                    codeType: 20,
                    rotate: 0,
                }
            },
            {
                type: "line",
                json: {
                    x: 3,
                    y: 35.8,
                    height: 0.4,
                    width: 54.1,
                    rotate: 0,
                    lineType: 1,
                    // dashwidth: [1, 1],
                },
            },
        ]

        // 添加书籍信息
        let y = 39
        item.goods.forEach(book => {
            printElements.push({
                type: "text",
                json: {
                    x: 3,
                    y,
                    width: 45.2,
                    height: 3.5,
                    value: `${book.book_info.name} (${book.book_info.collection_no})`,
                    fontSize: 2.6,
                    lineMode: 6,
                    textAlignHorizonral: 0,
                    fontFamily: '思源黑体',
                    rotate: 0,
                    textAlignVertical: 1,
                    letterSpacing: 0.0,// 字母之间的标准间隔，单位mm
                    lineSpacing: 1.0,
                    fontStyle: [false, false, false, false],
                }
            })
            y += 5
        })

        // 打印所有元素
        for (let element of printElements) {
            switch (element.type) {
                case "text":
                    await nMPrintSocket.value.DrawLableText(element.json)
                    break
                // 可以添加其他类型元素的处理
                case "barcode":
                    await nMPrintSocket.value.DrawLableBarCode(element.json)
                    break
                case "line":
                    await nMPrintSocket.value.DrawLableLine(element.json)
                    break
            }
        }

        // 提交打印
        const previewRes = await nMPrintSocket.value.generateImagePreviewImage(8,);

        console.log('预览内容', previewRes)
        previewImage.value = "data:image/jpeg;base64," + JSON.parse(previewRes.resultAck.info).ImageData;
        previewVisible.value = true;
        console.log(previewImage.value, previewVisible.value);

    } catch (err) {
        console.error('打印失败:', err)
        ElMessage.error('打印失败')
    }
}
</script>

<style lang="less" scoped>
.header {
    background: #fff;
    padding: 20px;
    margin-bottom: 10px;
}

.group {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    // padding: 20px;
}

.ruku {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    gap: 10px;
}

.list {
    background: #fff;
    padding: 20px;
    // border-radius: 10px;
    // margin-top: 20px;

    .item {
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .left {
                display: flex;
                gap: 20px;

            }

            border-bottom: 1px solid #f0f0f0;
            border-top: 1px solid #f0f0f0;
            padding: 10px;
        }

        .content {
            display: flex;
            justify-content: space-between;
            padding: 10px;

            .info {
                display: flex;
                gap: 40px;

                .name {
                    width: 200px;

                    p {
                        margin-bottom: 10px;
                    }
                }
            }

            .books {
                display: flex;
                gap: 20px;

                &_item {
                    .cover {
                        width: 100px;
                        height: 100px;

                        position: relative;

                        .rukuIcon {
                            position: absolute;
                            right: 0;
                            bottom: 0;
                            width: 40px;
                            height: 40px;
                            // background: #fff;
                            border-radius: 50%;
                        }
                    }

                    p {
                        margin-bottom: 10px;
                    }
                }
            }
        }

    }
}
</style>