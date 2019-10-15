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
`rxjs`是一个专注数据和事件流处理的库，这让他有能力去尝试替代`react`内常用的状态管理方案`redux`，但是单纯去替代`redux`似乎没有什么意义。是的，我们更在乎的是`流`带给我们的能力。为此，我目前有如下的一个方案，这在我当前的demo中看起来运行还不错，因为会不停发展，因此暂时把它称为plan A。

```javascript
/**
 * 一个可以将普通组件映射为`流`式组件的高阶组件
 * 接收两个映射函数，分别映射属性和方法，被包裹的组件将能够得到流处理能力。
 * 使用方式：
 * // 映射属性：return的属性将映射到子组件的props内
 * const mapStateToProps = () => {
 *    return {
 *      // 这些属性将称为`可响应的`，因为在stream$内可以去操作或者更新他们。
 *      numAdam: 0,
 *      numBob: 0,
 *      logs: [],
 *      total: 0
 *    }
 *  }
 * // 映射方法：获得当前`state`和`stream$`，其中`stream$`为`流`
 *  const mapActionsToProps = (state, stream$) => {
 *    return {
 *      onNumAdamChange (value) {
 *        const { numBob } = state;
 *        // 调用`stream$.next()`给属性赋值，限制赋值必须为`Object`类型，`key`为`mapStateToProps`方法返回属性的子集
 *        stream$.next({ numAdam: value, total: numBob + value });
 *      },
 *      onNumBobChange (value) {
 *        const { numAdam } = state;
 *        stream$.next({ numBob: value, total: numAdam + value });
 *      },
 *      onLogAppend (message) {
 *        const { logs = [] } = state;
 *        logs.push(message);
 *        stream$.next({ logs });
 *      }
 *    }
 *  }
 *  
 *  // 很方便的调用方式
 *  export default withStream(mapStateToProps, mapActionsToProps)(Calculator);
 * @param {*} mapStateToProps 把组件的state映射为props。目的是把state放到stream$中管理
 * @param {*} mapActionToProps 给方法赋予流的能力，映射到props
 */
export const withStream = (mapStateToProps = () => {}, mapActionToProps = () => {}) => {
  return (WraappedComponent) => {
    /**
     * 产生`流`式组件
     */
    class StreamComponent extends Component {
      constructor (props) {
        super(props);

        // 初始化
        const initialValue = mapStateToProps({});
        // 每个`流`对外提供一个`BehaviorSubject`
        this.stream$ = new BehaviorSubject(initialValue);
        this.state = {
          ...cloneDeep(initialValue)
        }

      }

      componentDidMount () {
        this.subscription = this.stream$.subscribe(newState => {
          if (isType(newState, 'Object')) {
            const oldKeys = Object.keys(this.state);
            const currentKeys = Object.keys(newState);
            const updatedState = currentKeys.reduce((acc, curr) => {
              if (oldKeys.includes(curr)) {
                acc[curr] = newState[curr];
              }
              return acc;
            }, {});
            
            this.setState({
              ...this.state,
              ...updatedState
            });
          } else {
            console.warn(`every stream data should be type of Object. ${newState} is not allowed.`)
          }

          });
      }
      componentWillUnmount () {
        // 解除资源
        this.subscription.unsubscribe();
      }

      render() {
        // 确保每次state为最新
        const rxActions = mapActionToProps(this.state, this.stream$);
        const {forwardedRef, ...props} = this.props;
        return (
          <WraappedComponent ref={forwardedRef} {...props} {...this.state} {...rxActions} stream$={this.stream$}/>
        );
      }
    };

    return React.forwardRef((props, ref) => {
      return (
        <StreamComponent {...props} forwardedRef={ref} />
      )
    });
  }
}
```

### license
MIT
