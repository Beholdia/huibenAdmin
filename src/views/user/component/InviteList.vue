<template lang="pug">
.borrowList
    .search
        el-input(placeholder="输入用户ID" style="width:200px" v-model="keyword")
        el-button(type="primary" @click="search") 查询
    el-table(:data="list")
        el-table-column(label="头像")
            template(#default="{row}")
                el-avatar(:src="row.avatar")
        el-table-column(label="昵称" prop="nickname")
        el-table-column(label="用户ID" prop="biz_user_id")
        el-table-column(label="手机号" prop="phone")
        el-table-column(label="被邀请用户ID" prop="invitees" )
        el-table-column(label="注册时间" prop="created_at")
        el-table-column(label="会员等级" )  
            template(#default="{row}")
                span {{row.main_title}}{{row.sub_title}}
        el-table-column(label="类型")
            template(#default="{row}")
                span(v-if="row.type == 'expired_day'") 会员天数
                span(v-if="row.type == 'cash_back'") 返现金额
        el-table-column(label="返现金额" prop="vip_increased_money")
        el-table-column(label="增长天数" prop="vip_increased_day")
    el-pagination(@current-change="val => getList(val)" background layout="prev, pager, next" :total="total" style="justify-content: center;margin-top: 20px", :page-size="limit")
</template>

<script setup>
import { onMounted } from 'vue';
import { inviteList } from '/@/api/user/index.ts';

const props = defineProps({
    biz_user_id: Number
});

const detail = ref({});
// const list = ref([]);
const list = ref([
    {
        "biz_user_vip_record_id": 3,
        "biz_user_id": 4,
        "invitees": 5,
        "nickname": "nickname",
        "phone": "18806801621",
        "avatar": "http://127.0.0.1:18808/2024/12/d6ey2tx11k0cvckhqs.png",
        "type": "expired_day",
        "vip_increased_money": 0,
        "vip_increased_day": 30,
        "main_title": "黄金会员",
        "sub_title": "",
        "special_price": 1,
        "created_at": ""
    },
    {
        "biz_user_vip_record_id": 4,
        "biz_user_id": 4,
        "invitees": 5,
        "nickname": "nickname",
        "phone": "18806801621",
        "avatar": "http://127.0.0.1:18808/2024/12/d6ey2tx11k0cvckhqs.png",
        "type": "cash_back",
        "vip_increased_money": 5000,
        "vip_increased_day": 0,
        "main_title": "黄金会员",
        "sub_title": "",
        "special_price": 1,
        "created_at": ""
    }
],);

const total = ref(0);
const page = ref(1);
const limit = ref(10);
const keyword = ref(null);

const clear = () => {
    detail.value = {};
    list.value = [];
    total.value = 0;
    page.value = 1;
    limit.value = 10;
}
const getList = async () => {
    const res = await inviteList({ page: page.value, limit: limit.value, keyword: biz_user_id.value });
    detail.value = res.data;
    list.value = res.data.items || [];
    total.alue = res.data.total || 0;
}

const search = async () => {
    clear();
    await getList();
}
watch(() => props.biz_user_id, async () => {
    if (props.biz_user_id) {
        clear();
        keyword.value = props.biz_user_id;
        await getList();
    }
}, { immediate: true })
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