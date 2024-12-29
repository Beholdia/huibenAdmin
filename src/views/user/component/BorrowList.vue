<template lang="pug">
.borrowList
    .search
        el-input(placeholder="输入用户ID" style="width:200px" v-model="biz_user_id")
        el-button(type="primary" @click="search") 查询
    .info
        .left
            el-avatar(size="large" :src="detail.avatar")
        .right
            .top {{detail.nickname}}
            .middle 
                p ID：{{detail.biz_user_id}}
                p {{detail.main_title}} {{detail.sub_title}}
                p 手机号：{{detail.phone}}
            .bottom
                p 共借阅：{{detail.total_borrow_times}}次，借阅：{{detail.total_borrow_count}}本，节省：{{detail.savings}}元
    .list
        .title
            p 借阅书籍
            p 借阅时间
            p 归还时间
        .list_item(v-for="item in list" :key="item.biz_books_order_id")
            .books
                .books_item(v-for="book,index in item.good_detail" :key="index")
                            .cover()
                                el-image(:src="book?.pic"  style="width: 100px; height: 100px")
                            p {{book?.name}}
                            p {{book?.collection_no}}
            .borrowTime {{item.created_at}}
            .returnTime
                //- todo 归还后状态？
                .status 
                    p(v-if="item.user_order_status==='reading' ") 借阅中
                    p(v-if="item.user_order_status==='canceled' ") 已取消
                    p(v-if="item.pickup_confirm_at") {{detail.pickup_confirm_at}}
                    p 借阅天数： {{item.borrowed_day}}天
    el-pagination(@current-change="val => getList(val)" background layout="prev, pager, next" :total="total" style="justify-content: center;margin-top: 20px", :page-size="limit")
</template>

<script setup>
import { onMounted } from 'vue';
import { borrowList } from '/@/api/user/index.ts';

const props = defineProps({
    biz_user_id: Number
});

const detail = ref({});
const list = ref([]);

const total = ref(0);
const page = ref(1);
const limit = ref(10);
const biz_user_id = ref();

const clear = () => {
    detail.value = {};
    list.value = [];
    total.value = 0;
    page.value = 1;
    limit.value = 10;
}
const getList = async () => {
    const res = await borrowList({ page: page.value, limit: limit.value, biz_user_id: biz_user_id.value });
    detail.value = res.data;
    list.value = res.data.items || [];
    total.alue = res.data.total || 0;
}

const search = async () => {
    clear();
    await getList();
}
// onMounted(async () => {
//     await getList();
// });

watch(() => props.biz_user_id, async () => {
    console.log('1111q', props.biz_user_id)
    if (props.biz_user_id) {
        clear();
        biz_user_id.value = props.biz_user_id;
        await getList();
    }
}, { immediate: true })
// onUpdated(async () => {
//     await getList();
// });
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