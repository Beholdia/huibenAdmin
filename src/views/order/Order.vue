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
                .right(v-show="status=='wait_to_delivery' ")
                    template(v-if="item.user_order_status != 'canceled'")
                        el-button(type="primary" size="small" v-if="!item.packed_at" @click="packed(item)") 完成打包
                        el-button(color="gray" size="small" v-if="item.packed_at") 已打包
                        el-button(color="black" size="small") 打印标签
                    el-button(type="info" size="small" v-if="item.user_order_status == 'canceled'") 订单已取消
            .content
                .info
                    el-avatar(:src="item.biz_user.avatar" :preview-src-list = " [ item.biz_user.avatar ] " :preview-teleported="true" style="width: 50px; height: 50px")
                    .name
                        p {{item.biz_user.nickname}}
                        p {{item.biz_user.phone}}
                        p {{item.biz_address_json.province.province_name}}{{item.biz_address_json.city.city_name}}{{item.biz_address_json.county.county_name}}{{item.biz_address_json.detaild_address}}
                .books
                    .books_item(v-for="book,index in item.goods" :key="index")
                        .cover()
                            el-image(:src="book.book_info?.pic"  style="width: 100px; height: 100px")
                            el-icon(v-if="book.borrow_status=='returned' " class="rukuIcon" size="30")
                                CircleCheck
                        p {{book.book_info?.name}}
                        p {{book.book_info?.collection_no}}
    el-pagination(@current-change="val => getList(val)" background layout="prev, pager, next" :total="total" style="justify-content: center;margin-top: 20px", :page-size="limit")

</template>

<script setup>
import { orderlist, confirmPack } from '/@/api/order'
import Zhifu from './Zhifu.vue'
import Widthdrawal from './Widthdrawal.vue'
import { onMounted } from 'vue'
import BaseFilter from '/@/components/form/BaseFilter.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const status = ref('wait_to_delivery')
const tabs = [
    { label: '待配送', value: 'wait_to_delivery' },
    { label: '配送中', value: 'in_delivery' },
    { label: '送达', value: 'delivered' },
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
onMounted(async () => {
    await getList();
})
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