/**
 * @/utils/path.ts
 * 后台服务URL前缀
 */

let basePath = 'http://192.168.7.181:9005';
// 不知道为啥不行, 打包发布的时候手动切换把 ...
//basePath = 'https://deeprop.machineilab.org/'

console.log(basePath);
export default basePath;

