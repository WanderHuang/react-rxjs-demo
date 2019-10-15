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

#### 数据流方案
`rxjs`是一个专注数据和事件流处理的库，这让他有能力去尝试替代`react`内常用的状态管理方案`redux`，但是单纯去替代`redux`似乎没有什么意义。是的，我们更在乎的是`流`带给我们的能力。为此，我目前有如下的一个方案，这在我当前的demo中看起来运行还不错，因为会不停发展，因此暂时把它称为plan A(src/rx/hoc withStream)。

特性
* 支持把普通属性映射到props。该属性可以在stream$中使用
* 支持把普通方法映射到props。该方法内可以使用`(state, stream$)`，`state`表示当前状态，`stream$.next({propName: propValue})`可以更新到下一个状态
* 支持把流属性映射到props。该流会被其他流属性一起合并，最终提供一个外部流`observable$`，目前只开放它的解除订阅的方法`const {unsubscribe} = this.props`。所有流属性最终都会被映射为`StreamComponent`的普通属性（通过订阅实现）。

下一阶段
* 支持多个外部流
* 支持状态多播

### license
MIT
