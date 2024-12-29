<template lang="pug">
.borrowList
    .search
        el-input(placeholder="输入手机号、用户ID" style="width:200px")
        el-button(type="primary") 查询
    .info
        .left
            el-avatar(size="large" :src="detail.avatar")
        .right
            .top 用户ID：123456
            .middle 
                p 昵称：张三
                p 手机号：123456789
                p 手机号：123456789
            .bottom
                p 借阅时间：2022-01-01 12:00:00
                p 归还时间：2022-01-01 12:00:00
    .list
        .title
            p 借阅书籍
            p 借阅时间
            p 归还时间
        .list_item
            .books
                .book
                    image
                    .name 书名
                    .collection_no
            .borrowTime 
            .returnTime
                .status 正常
                .time 3听


</template>

<script setup>
import { onMounted } from 'vue';
import { borrowList } from '/@/api/user/index.ts';

const detail = ref({});
const getList = async () => {
    const res = await borrowList({ page: 1, limit: 10, biz_user_id: 6 });
    detail.value = res.data;
    console.log(res);
}
onMounted(async () => {
    await getList();
});
onUpdated(async () => {
    await getList();
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
    }
}
</style>