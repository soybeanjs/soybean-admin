### 1.interface和type

##### interface和type使用优先级：能用interface表示的类型就用interface。

### 2.请求函数

#### api接口：

统一以 **fetch** 开头，例如：

```typescript
/**
 * 获取用户信息
 * @param id - 用户唯一标识id
 */
function fetchUserInfo(id：string) {
	// ***
}
/**
 * 删除列表项
 * @param id - 列表id
 */
function fetchDeleteListItem(id：string) {
	// ***
}
```

#### middleware中间件：

统一以 **handle** 开头，例如

```typescript
/**接口返回的用户信息 */
interface ResponseUserInfo {
  userId: string;
  userName: string;
  userAge: number;
}
/**
 * 获取用户信息 中间件
 @param data - 返回的用户信息
 */
function handleUserInfo(data: ResponseUserInfo): UserInfo {
  // ***
}
```

