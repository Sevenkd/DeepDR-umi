/**
 * 权限管理模块
 * 返回一个权限封装的React组件, 该组件根据当前的用户权限动态返回待访问组件或异常组件
 * 
 * 总体逻辑我懂了, 但是为什么要写成这样还是不太懂
 * 以及, current权限到底是怎么管理的? renderAuthorize部分还是不太明白
 * 
 * 所以这部分相当于定义了一个Authorized组件类, 外界(utils)会调用这个RenderAuthorize组件, 来实例化权限管理模块?
 * 
 * 外界从这里引用了RenderAuthorize模块, 输入用户的当前权限, 就得到了一个Authorized模块, 这个模块注册了用户的当前权限
 */
import Authorized from './Authorized';
import Secured from './Secured';
import check from './CheckPermissions';
import renderAuthorize from './renderAuthorize';

/**
 * Secured在源文件中叫做authorize, 是一个检测访问权限的函数
 * 其接受用户权限和无权限报错组件作为输入, 返回一个新的函数
 * 其返回的函数接受目标组件作为输入, 检测用户权限, 根据权限返回对应的组件
 * 
 * 又是类似装饰器函数那种感觉, 函数封装了函数, 外层函数提供了一些先验的参数, 返回一个新的函数供外界调用
 */
Authorized.Secured = Secured;
Authorized.check = check;

const RenderAuthorize = renderAuthorize(Authorized);

export default RenderAuthorize; // 最终经过权限封装和当前权限渲染的React组件(或函数), 输入当前的用户权限, 返回对应权限的组件(待访问组件或者无权限的异常组件)
