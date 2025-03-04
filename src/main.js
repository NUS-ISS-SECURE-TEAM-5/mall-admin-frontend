import {createApp} from "vue";

import '@csstools/normalize.css'// A modern alternative to CSS resets

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn' // lang i18n
import VueECharts from 'vue-echarts'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import registerIcons from "@/icons";

import '@/icons' // icon
import '@/permission' // permission control

import {use} from 'echarts/core'
import {CanvasRenderer} from 'echarts/renderers'
import {BarChart, LineChart} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
])

const app = createApp(App)

app.use(ElementPlus, {locale: zhCn})
app.component('v-chart', VueECharts)

app.use(router)
app.use(store)

registerIcons(app)

app.mount('#app')
