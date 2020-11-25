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
    {
      path: '/user',
      component: '@/layouts/UserLayout',
      routes: [
        {
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
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/records/todayUpload',
            },
            {
              name: 'records',
              icon: 'table',
              path: '/records',
              routes:[
                {
                  path: '/records/todayUpload',
                  name: 'today',
                  icon: 'table',
                  component: './todayUpload',
                },
                {
                  path: '/records/searchRecords',
                  name: 'searchRecords',
                  icon: 'table',
                  component: './searchRecords',
                },
              ]
            },
            {
              name: 'patients',
              icon: 'table',
              path: '/patients',
              routes:[
                {
                  name: 'searchPatients',
                  icon: 'table',
                  path: '/patients/searchPatients',
                  component: './searchPatients',
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
  manifest: {
    basePath: '/',
  },
});
