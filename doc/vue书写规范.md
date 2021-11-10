### script-setup写法

#### 第一部分

##### template

#### 第二部分

##### script

##### 一、import的顺序, 依次按照下面的顺序。

1. vue模块

   ```typescript
   import {  } from 'vue';
   ```

2. vue相关类型

   ```typescript
   import type {  } from 'vue';
   ```

3. vue-router模块

   ```typescript
   import {  } from 'vue-router';
   ```

4. vue-router相关类型

   ```typescript
   import type {  } from 'vue-router';
   ```

5. UI框架模块

   ```typescript
   import {  } from 'naive-ui';
   ```

6. UI框架相关类型

   ```typescript
   import type {  } from 'naive-ui';
   ```

7. 第三方依赖

   ```typescript
   import BScroll from 'bscroll';
   ```

8. 第三方依赖相关类型

   ```typescript
   import type {  } from 'bscroll';
   ```

9. @/enum

   ```typescript
   import {  } from '@/enum';
   ```

10. @/setting

    ```typescript
    import {  } from '@/setting';
    ```

11. @/plugins

    ```typescript
    import {  } from '@/plugins';
    ```

12. @/layouts

    ```typescript
    import {  } from '@/layouts';
    ```

13. @/views

    ```typescript
    import {  } from '@/views';
    ```

14. @/components

    ```typescript
    import {  } from '@/components';
    ```

15. @/hooks

    ```typescript
    import {  } from '@/hooks';
    ```

16. @/store

    ```typescript
    import {  } from '@/store';
    ```

17. @/context

    ```typescript
    import {  } from '@/context';
    ```

18. @/router

    ```typescript
    import {  } from '@/router';
    ```

19. @/service

    ```typescript
    import {  } from '@/service';
    ```

20. @/utils

    ```typescript
    import {  } from '@/utils';
    ```

21. @/interface

    ```typescript
    import {  } from '@/interface';
    ```

22. @/assets

    ```typescript
    import {  } from '@/assets';
    ```

23. 相对路径依赖

    ```typescript
    import {  } from './components';
    ```

##### 二、TS类型声明

```typescript
interface Props {
	/**姓名 */
  name: string;
	/**年龄 */
  age?: number;
}
interface Emits {
  /**
   * 删除事件
   * @param id - 删除项的id
   */
	(e: 'delete', id: number): void;
}
```
 

##### 三、defineProps、defineEmits、withDefaults

1. 定义属性，如：

```typescript
const props = withDefaults(defineProps<Props>(), {
  age: 24
});
```

其中name是必须的属性，age是可选属性，通过withDefaults添加默认值

2. 定义emit事件

```typescript
const emit = defineEmits<Emits>();
```

##### 四、响应式use函数

有些use函数需要传入响应式的变量参数时，则书写在声明的变量下面。

```typescript
const router = useRouter();
const route = useRoute();
```

```typescript
/**dom引用 */
const domRef = ref<HTMLElement | null>(null);
const { height: domRefHeight } = useElementSize(domRef); //获取domRef的响应式高度
```



##### 五、变量、函数声明

##### 六、vue生命周期函数、nextTick执行

##### 七、defineExpose
