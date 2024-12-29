<template lang="pug">
el-drawer(:modelValue="show",:show-close="false" style="padding:20px" title="借阅记录"  size="80%" @close="onClose")
    el-table(:data="list")
        el-table-column(label="序号" prop="biz_books_order_id")
        el-table-column(label="订单号" prop="biz_books_order_no")
        el-table-column(label="借阅人" prop="name")
        el-table-column(label="手机号" prop="phone" )
        el-table-column(label="下单时间" prop="created_at")
        el-table-column(label="送达时间" prop="delivery_complete_at")
        el-table-column(label="还书时间" prop="return_started_at")
    el-pagination(@current-change="val => getList(val)" background layout="prev, pager, next" :total="total" style="justify-content: center;margin-top: 20px", :page-size="limit")
</template>

<script setup>
import { onMounted, onUpdated } from 'vue';
import { borrowRecord } from '/@/api/books/index.ts';
const show = defineModel('show', { type: Boolean });
// const emit = defineEmits(['onClose'])

const props = defineProps({
    id: Number
});

const list = ref([]);

const total = ref(0);
const page = ref(1);
const limit = ref(10);

const clear = () => {
    list.value = [];
    total.value = 0;
    page.value = 1;
    limit.value = 10;
}
const getList = async () => {
    const res = await borrowRecord({ page: page.value, limit: limit.value, id: props.id });
    list.value = res.data.items || [];
    total.alue = res.data.total || 0;
}

const onClose = () => {
    show.value = false;
    console.log(11)
    // emit('onClose')
}

onUpdated(async () => {
    if (show.value && props.id) {
        await getList();
    }
});
</script>
<style lang="less" scoped>
.borrowList {
    .search {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }

    .info {
        display: flex;
        gap: 20px;

        .middle,
        .bottom {
            display: flex;
            gap: 10px;
        }

        margin-bottom: 20px;

    }

    .list {
        .title {
            display: grid;
            grid-template-columns: 3fr 1fr 1fr;

            p {
                text-align: center;
                border-bottom: 1px solid #ccc;
                border-top: 1px solid #ccc;
                font-size: large;
                padding: 10px 0;
            }


        }

        .list_item {
            display: grid;
            grid-template-columns: 3fr 1fr 1fr;
            border-bottom: 1px solid #ccc;
            border-top: 1px solid #ccc;
            padding: 10px 0;

            .returnTime {
                .status {
                    p {
                        padding: 10px
                    }
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
</style>