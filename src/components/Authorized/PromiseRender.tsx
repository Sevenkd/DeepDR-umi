/**
 * 处理 Promise 权限问题的代码
 * 
 * PromiseRender是一个封装了用户权限的React组件, 这个组件被返回给系统, 挂载到页面上
 * 当组件被挂载的时候会根据promise解析的结果觉得渲染哪个组件
 */
import React from 'react';
import { Spin } from 'antd';
import isEqual from 'lodash/isEqual';
import { isComponentClass } from './Secured';


/**
 * 传入给PromiseRender的参数
 * 
 * ok: 目标组件
 * error: 无权限报错组件
 * promise: 判断权限的promise
 */
interface PromiseRenderProps<T, K> {
  ok: T;
  error: K;
  promise: Promise<boolean>;
}
/**
 * PromiseRender的内部状态
 * 
 * component: 最终被渲染的组件
 */
interface PromiseRenderState {
  component: React.ComponentClass | React.FunctionComponent;
}

/**
 * PromiseRender, 会根据当前用户权限异步动态渲染目标啊组件或者异常报错组件
 * 
 * T: 目标组件类型
 * K: 错误处理组件类型
 */
export default class PromiseRender<T, K> extends React.Component<PromiseRenderProps<T, K>, PromiseRenderState> {

  state: PromiseRenderState = {
    component: () => null,
  };

  /**
   * 当组件被挂载的时候觉得应该渲染哪个组件
   * (根据promise解析的结果)
   */
  componentDidMount() {
    this.setRenderComponent(this.props);
  }

  /**
   * 根据promise解析结果决定应该渲染哪个组件
   */
  setRenderComponent(props: PromiseRenderProps<T, K>) {
    // 先解析目标组件和异常报错组件
    const ok = this.checkIsInstantiation(props.ok);
    const error = this.checkIsInstantiation(props.error);

    /**
     * 解析promise, 根据promise结果设置目标组件或者异常报错组件
     * 按照这里的逻辑, 只要promise不报错就算用户有权限?
     * 即权限判定成功resolve, 判断失败则reject?
     */
    props.promise
      .then(() => {
        this.setState({
          component: ok,
        });
        return true;
      })
      .catch(() => {
        this.setState({
          component: error,
        });
      });
  }

  /**
   * 封装了用户权限的组件属于一些大组件的根组件, 同时牵扯到promise的异步解析, 
   * 如果每次state变化都重新渲染这个组件的话会导致系统的性能很慢(大概? 我猜的)
   * 所以这里限制只有当props改变后才解析promise, 决定是否重新渲染组件
   * 
   * @param {新props} nextProps 
   * @param {新state} nextState 
   */
  shouldComponentUpdate = (nextProps: PromiseRenderProps<T, K>, nextState: PromiseRenderState) => {
    const { component } = this.state;
    if (!isEqual(nextProps, this.props)) {
      this.setRenderComponent(nextProps);
    }
    if (nextState.component !== component) return true;
    return false;
  };

  /**
   * 判断一个组件的类型(class型, FC型等), 并按照类型返回一个箭头函数?
   * 以下是antd原注释
   * Determine whether the incoming component has been instantiated
   * AuthorizedRoute is already instantiated
   * Authorized  render is already instantiated, children is no instantiated
   * Secured is not instantiated
   * 
   * 或者应该是判断一个组件是否以及被实例化, 比如说一个Authorized权限组件应该是没有被实例化的?
   * 
   * @param {被检查的组件} target 
   */
  checkIsInstantiation = ( target: React.ReactNode | React.ComponentClass, ): React.FunctionComponent => {
    if (isComponentClass(target)) {
      const Target = target as React.ComponentClass;
      return (props: any) => <Target {...props} />;
    }
    if (React.isValidElement(target)) {
      return (props: any) => React.cloneElement(target, props);
    }
    return () => target as React.ReactNode & null;
  };

  render() {
    const { component: Component } = this.state;
    const { ok, error, promise, ...rest } = this.props;

    // 这里的errComponent是promise解析错误的报错组件, 而不是无权限的异常报错组件
    // 无权限的组件在Component里边
    const errComponent = (
    <div style={{
      width: '100%',
      height: '100%',
      margin: 'auto',
      paddingTop: 50,
      textAlign: 'center',
    }} >
      <Spin size="large" />
    </div>
    );

    // 如果Component不为空, 说明promis解析成功, 则渲染目标组件或者无权限组件, errComponent表示promise解析失败
    return Component ? ( <Component {...rest} /> ) : errComponent;
  }
}
