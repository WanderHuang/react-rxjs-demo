import React, { Component } from 'react';
import { BehaviorSubject } from 'rxjs';

const cloneDeep = (src) => JSON.parse(JSON.stringify(src));


const isType = (obj, type) => Object.prototype.toString.call(obj, `[object ${type}]`);


/**
 * 一个可以将普通组件映射为`流`式组件的高阶组件
 * 接收两个映射函数，分别映射属性和方法，被包裹的组件将能够得到流处理能力。
 * 使用方法：
 * // 映射属性：return的属性将映射到子组件的props内
 * const mapStateToProps = () => {
 *    return {
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
 * @param {*} mapStateToProps 
 * @param {*} mapActionToProps 
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
          <WraappedComponent ref={forwardedRef} {...props} {...this.state} {...rxActions} />
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