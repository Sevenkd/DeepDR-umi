import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {
    dark: true //是否使用暗色模式
  },
  dva: {
    hmr: true,
  },
  locale: { // 语言, 文字内容写在locales文件夹下
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    { // 用户相关
      path: '/user',
      component: '@/layouts/UserLayout',
      routes: [
        { //用户登录
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '@/layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '@/layouts/BasicLayout',
          authority: ['admin', 'doctor'],
          routes: [
            {
              path: "/",
              redirect: '/main/searchPatient',
            },
            { //首页 (快捷访问) 
              name: 'mainPage',
              icon: 'table',
              path: '/main',
              routes:[
                { // 患者查找(默认页面)
                  path: '/main/searchPatient',
                  // authority: ['admin'],
                  name: 'searchPatient',
                  icon: 'table',
                  component: './patientList',
                },
                { // 随访管理
                  path: '/main/followUpManagement',
                  name: 'followUpManagement',
                  icon: 'table',
                  component: './patientList',
                },
                { // 数据统计
                  path: '/main/statistics',
                  name: 'statistics',
                  icon: 'table',
                  component: './patientList',
                }
              ]
            },
            { //随访管理 
              name: 'followUp',
              icon: 'table',
              path: '/follow',
              routes:[
                { // 患者视图
                  path: '/follow/patientView',
                  name: 'patientView',
                  icon: 'table',
                  component: './patientList',
                },
                { // 计划视图
                  path: '/follow/scheduleView',
                  name: 'scheduleView',
                  icon: 'table',
                  component: './patientList',
                },
              ]
            },
            { // 转诊管理
              name: 'transfer',
              icon: 'table',
              path: '/transfer',
              routes:[
                { // 转出中
                  name: 'outside',
                  icon: 'table',
                  path: '/transfer/outside',
                  component: './patientList',
                },
                { // 已接受
                  name: 'transfering',
                  icon: 'table',
                  path: '/transfer/transfering',
                  component: './patientList',
                },
                { // 回转中
                  name: 'inside',
                  icon: 'table',
                  path: '/transfer/inside',
                  component: './patientList',
                },
                { // 转诊记录
                  name: 'history',
                  icon: 'table',
                  path: '/transfer/history',
                  component: './patientList',
                },
              ]
            },
            { // 患者管理
              name: 'patients',
              icon: 'table',
              path: '/patients',
              routes:[
                { // 患者注册
                  name: 'patientRegister',
                  icon: 'table',
                  path: '/patients/patientRegister',
                  component: './patientList',
                },
                { // 新增记录 (同患者查找)
                  name: 'addRecords',
                  icon: 'table',
                  path: '/patients/addRecords',
                  component: './patientList',
                },
                { // 患者查找 (同 首页 患者查找)
                  name: 'searchPatient',
                  icon: 'table',
                  path: '/patients/searchPatient',
                  component: './patientList',
                },
                { // 病人管理 ( 同 随访管理 病人视图 即病人列表, 但应突出一个管理功能 )
                  name: 'patientList',
                  icon: 'table',
                  path: '/patients/patientList',
                  component: './patientList',
                },
              ]
            },
            { // 数据统计
              name: 'statistic',
              icon: 'table',
              path: '/statistic',
              routes:[
                { // 信息统计
                  name: 'information',
                  icon: 'table',
                  path: '/statistic/information',
                  component: './patientList',
                },
                { // 数据报表
                  name: 'report',
                  icon: 'table',
                  path: '/statistic/report',
                  component: './patientList',
                },
              ]
            },
            { // 远程会诊
              name: 'consultation',
              icon: 'table',
              path: '/consultation',
              routes:[
                { // 会诊列表
                  name: 'consultationList',
                  icon: 'table',
                  path: '/consultation/consultationList',
                  component: './patientList',
                }
              ]
            },
            { // AI诊断
              name: 'AI',
              icon: 'table',
              path: '/AI',
              routes:[
                { // 请求诊断
                  name: 'request',
                  icon: 'table',
                  path: '/AI/request',
                  component: './patientList',
                },
                { // 请求历史
                  name: 'history',
                  icon: 'table',
                  path: '/AI/history',
                  component: './patientList',
                },
              ]
            },
            { // 个人中心
              name: 'personal',
              icon: 'table',
              path: '/personal',
              routes:[
                { // 信息修改
                  name: 'changeInfo',
                  icon: 'table',
                  path: '/personal/changeInfo',
                  component: './patientList',
                },
                { // 使用指南
                  name: 'helpMe',
                  icon: 'table',
                  path: '/personal/helpMe',
                  component: './patientList',
                },
                { // 使用指南
                  name: 'contactUs',
                  icon: 'table',
                  path: '/personal/contactUs',
                  component: './patientList',
                },
              ]
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  // publicPath: '/static/dist/',
  manifest: {
    basePath: '/',
  },
});