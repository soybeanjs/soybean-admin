/*
 * @Author: whr2349 378237242@QQ.com
 * @Date: 2023-08-17 09:25:28
 * @LastEditors: whr2349 378237242@QQ.com
 * @LastEditTime: 2023-08-17 17:14:37
 * @FilePath: \soybean-admin\src\layouts\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const BasicLayout = () => import('./basic-layout/index.vue');
const BlankLayout = () => import('./blank-layout/index.vue');

export { BasicLayout, BlankLayout };
