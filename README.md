### 一个将`rxjs`和`react`结合使用的演示库
> 本工程来源于一次内部分享，[分享稿点这里](https://github.com/PassionateBoy/articles-to-make-a-progress/blob/master/fe-wander/%5B%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%5D%E4%BB%8B%E7%BB%8D%E4%B8%80%E7%A7%8D%E7%BC%96%E7%A8%8B%E6%80%9D%E6%83%B3(rxjs).md)

![demo-image](./imgs/rxjs-demo.gif)

* 创建目的：尝试`rxjs 6`的操作符；锻炼函数式+响应式编程的思维方式；探索与`react`工程化结合方式
* 已包括
  - 在`pipe`中使用多个操作符组合操作数据
  - 演示在异步操作(多个异步组合)中的应用
  - 演示动画&游戏制作思路
  - 演示组件通信
* 已实现
  - 一种状态管理方式：高阶组件给调用者提供流式操作组件数据的方式
  - 父子组件&兄弟组件通信方式：在props中提供调用流的能力
* 待实现
  - 完整的`rxjs`状态管理方案

### license
MIT
