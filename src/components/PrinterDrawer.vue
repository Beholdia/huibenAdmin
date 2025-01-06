<template>
  <el-drawer v-model="visible" title="打印机设置" :size="800" style="padding: 20px;">
    <div class="print_init">
      <h3>打印机初始化：</h3>
      <div class="content">
        <div class="service">
          <p class="service_status status">
            打印服务状态：{{ !printSocketOpen ? "未" : "已" }}连接
          </p>
        </div>
        <div class="select_usb">
          <div class="select_printer status">
            <label>选择USB打印机:</label>
            <select v-model="usbSelectPrinter" name="usbPrinters">
              <option value="" disabled v-if="!Object.keys(usbPrinters).length">
                请选择USB打印机
              </option>
              <option v-for="(value, name) in usbPrinters" :value="name" :key="name">
                {{ name }}: {{ value }}
              </option>
            </select>
          </div>
          <el-button type="primary" @click="getPrinters">更新USB打印机列表</el-button>
        </div>

        <div class="connect_usb">
          <p class="usb_printer_connect_status status">
            打印机连接状态：USB打印机{{ !onlineUsbBool ? "未" : "已" }}连接
          </p>
          <el-button type="primary" @click="selectOnLineUsbPrinter">连接USB打印机</el-button>
        </div>

        <div class="init">
          <div class="init_content">
            <p class="init_status status">
              SDK初始化状态：{{ !initBool ? "未" : "已" }}初始化
            </p>
            <el-button type="primary" @click="init">初始化SDK</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="print_settings">
      <h3>打印设置：</h3>
      <div class="content">
        <el-form :model="printSettings" label-width="120px">
          <el-form-item label="打印浓度">
            <el-select v-model="printSettings.density">
              <el-option v-for="item in 15" :key="item" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="纸张类型">
            <el-select v-model="printSettings.label_type">
              <el-option :value="1" label="间隙纸"/>
              <el-option :value="2" label="黑标纸"/>
              <el-option :value="3" label="连续纸"/>
              <el-option :value="4" label="过孔纸"/>
              <el-option :value="5" label="透明纸"/>
              <el-option :value="6" label="标牌"/>
            </el-select>
          </el-form-item>
          <el-form-item label="打印模式">
            <el-select v-model="printSettings.print_mode">
              <el-option :value="1" label="热敏模式"/>
              <el-option :value="2" label="热转印模式"/>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import Socket from '../utils/Socket'
import NMPrintSocket from '../utils/Print'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'printer-ready'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const printSocketOpen = ref(false)
const usbPrinters = ref({})
const usbSelectPrinter = ref('')
const onlineUsbBool = ref(false)
const initBool = ref(false)
const nMPrintSocket = ref(null)

const printSettings = ref({
  density: 3,
  label_type: 1,
  print_mode: 1
})

// 初始化打印服务
onMounted(() => {
  const socketData = new Socket("ws://127.0.0.1:37989")
  
  socketData.open(
    (openBool) => {
      printSocketOpen.value = openBool
      if(!openBool) {
        ElMessage.warning('打印服务未连接')
      }
    },
    (msg) => {
      console.log('打印机消息:', msg)
    }
  )

  nMPrintSocket.value = new NMPrintSocket(socketData)
})

// 获取打印机列表
const getPrinters = async () => {
  if (!printSocketOpen.value) {
    return ElMessage.error("打印服务未开启")
  }
  try {
    const res = await nMPrintSocket.value.getAllPrinters()
    if (res.resultAck.errorCode === 0) {
      const allPrinters = JSON.parse(res.resultAck.info)
      usbPrinters.value = { ...allPrinters }
      usbSelectPrinter.value = Object.keys(usbPrinters.value)[0]
    } else {
      ElMessage.warning("没有在线的打印机")
    }
  } catch (err) {
    console.error(err)
    ElMessage.error("获取打印机列表失败")
  }
}

// 连接打印机
const selectOnLineUsbPrinter = async () => {
  if (!printSocketOpen.value) {
    return ElMessage.error("打印服务未开启")
  }
  try {
    const res = await nMPrintSocket.value.selectPrinter(
      usbSelectPrinter.value,
      parseInt(usbPrinters.value[usbSelectPrinter.value])
    )
    if (res.resultAck.errorCode === 0) {
      onlineUsbBool.value = true
      ElMessage.success("打印机连接成功")
    } else {
      onlineUsbBool.value = false
      ElMessage.error("打印机连接失败")
    }
  } catch (err) {
    console.error(err)
    ElMessage.error("打印机连接失败")
  }
}

// 初始化SDK
const init = async () => {
  if (!printSocketOpen.value) {
    return ElMessage.error("打印服务未开启")
  }
  try {
    const res = await nMPrintSocket.value.initSdk({ fontDir: "" })
    if (res.resultAck.errorCode === 0) {
      initBool.value = true
      ElMessage.success("SDK初始化成功")
      emit('printer-ready', {
        nMPrintSocket: nMPrintSocket.value,
        settings: printSettings.value
      })
    } else {
      initBool.value = false
      ElMessage.error("SDK初始化失败")
    }
  } catch (err) {
    console.error(err)
    ElMessage.error("SDK初始化失败")
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 20px;
  border: 1px solid #eee;
  margin: 10px 0;
}

.status {
  margin: 10px 0;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
}

.select_usb, .connect_usb, .init {
  margin: 20px 0;
}
</style> 