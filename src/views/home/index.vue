<template lang="pug">
.home
	el-button( type="info" class="refresh" plain @click="refresh" style="border:none;position:absolute;right:100px;top:0px;") 刷新
		el-icon
			Refresh
	.row(v-for="i in 3")
		.column(v-for="i in 3")
			.title 书籍总量
			.count 3500
</template>

<script setup>
const refresh = () => {
	console.log("刷新");
}
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