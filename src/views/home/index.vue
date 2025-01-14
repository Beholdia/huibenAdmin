<template lang="pug">
.home
	el-button( type="info" class="refresh" plain @click="getList" style="border:none;position:absolute;right:100px;top:0px;") 刷新
		el-icon
			Refresh
	el-button( type="info" class="clear" plain @click="clearData" style="border:none;position:absolute;right:0px;top:0px;" v-if="showClear") 清空
		//- el-icon
			Refresh
	.row()
		.column()
			.title 书籍总量
			.count {{ detail?.book_count }}
		.column()
			.title 总借出次数
			.count {{ detail?.borrowed_count }}
		.column()
			.title 今日借出次数
			.count {{ detail?.today_borrowed_count }}
	.row()
		.column()
			.title 用户总量
			.count {{ detail?.total_user_count }}
		.column()
			.title 付费用户
			.count {{ detail?.pay_user_count }}
		.column()
			.title 今日新增
			.count {{ detail?.user_count }}
	.row()
		.column()
			.title 累计收入
			.count {{ detail?.total_income/100 }}
		.column()
			.title 近7日收入
			.count {{ detail?.seven_day_income/100 }}
		.column()
			.title 今日收入
			.count {{ detail?.today_income/100 }}
</template>

<script setup>
import { homesStatistics, clear } from "/@/api/books/index"
import { onMounted } from "vue";

const detail = ref({})
const getList = async () => {
	const res = await homesStatistics()
	detail.value = res.data
}
const clearData = async () => {
	const res = await clear()
	await getList();
}
const showClear = ref(false);
onMounted(async () => {
	if (process.env.NODE_ENV === 'development') showClear.value = true;
	await getList()
})

</script>

<style lang="less" scoped>
.home {
	padding: 50px;
	position: relative;

	.row {
		background: rgba(230, 230, 230);
		display: flex;
		align-items: center;
		color: rgba(80, 80, 80);
		margin-bottom: 40px;

		.column {
			font-size: 28px;
			width: 33.3%;
			text-align: center;
			padding: 40px;

			.count {
				font-weight: 500;

			}

			position: relative;
		}

		.column::after {
			position: absolute;
			content: "";
			width: 2px;
			height: 50%;
			background: rgba(153, 153, 153);
			display: block;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
		}

		.column:last-child::after {
			display: none;
		}
	}
}
</style>