# lodash-optimization
lodash 打包优化


lodash 是一个 JavaScript 的实用工具库, 它提供了数十种的工具方法, 用来处理 JavaScript 的各位数据

例如下面一段代码, 使用了它的深克隆和 find 方法
```
import _ from 'lodash'

const users = [
  { 'user': 'barney', 'age': 36, 'active': true },
  { 'user': 'fred', 'age': 40, 'active': false },
  { 'user': 'pebbles', 'age': 1, 'active': true }
]
const deep = _.cloneDeep(users)
const res = _.find(users, o => o.age < 40)

console.log('deep', deep)
console.log('res', res)
```
简单配置一下 webpack, 然后打包一下, 会惊奇的发现打包体积居然有70多k, 明明只使用了它的两个方法,  写了不到10行的代码呢 !!
![image.png](https://upload-images.jianshu.io/upload_images/8004024-7d6cf1a547d4598b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
想到了多年以前被 jQuery 支配的恐惧: 只是想用它发一个 ajax , 但是却不得不引入整个的 jQuery 

那么, 有没有 **按需加载指定方法** 的 方法呢 ? 
有的 !
官方提供了一种叫 cherry pick 的方案
只需要这样写就可以了
```
import cloneDeep from 'lodash/cloneDeep'
import find from 'lodash/find'

const users = [
  { 'user': 'barney',  'age': 36, 'active': true },
  { 'user': 'fred',    'age': 40, 'active': false },
  { 'user': 'pebbles', 'age': 1,  'active': true }
]
const deep = cloneDeep(users)
const res = find(users, o => o.age < 40)
console.log('deep', deep)
console.log('res', res)
```
需要什么就 import lodash + '/' + 对应的方法名就可以的. 如下图, lodash 的源码里面就是这样写的: 它的每个方法都是一个独立的文件, 所以需要用什么方法, 找到对应的文件名然后 import 就好啦
![image.png](https://upload-images.jianshu.io/upload_images/8004024-18fbb814c78ff0cc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

然后重新用 webpack 打包一下试试
![image.png](https://upload-images.jianshu.io/upload_images/8004024-9a4ad4d0dec3316e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
不错的, 减少到26k 了

但是依然不太给力: 假如使用了 lodash 的十几个方法, 就要写十几行的 import, 可以是可以, 就是很烦的, 有的时候写代码写爽了是不想再翻上去写个import的

幸好, 别人也有过同样的烦恼, 而且它写了一个webpack的插件专门去处理 lodash 的打包体积问题

搜索 lodash webpack 关键字, 会找到这个插件 : lodash-webpack-plugin
这是它在 npm 官网上地址 https://www.npmjs.com/package/lodash-webpack-plugin

它也很友好地在readme文件中写了使用方法, 不过, 它最近一次更新readme 的时间是十个月以前, 所以, 按照它的配置方法在 webpack4 下面是不能正常运行的 
 
可以运行配置方法:
```
// webpack.config.js
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
module.exports = {
  // ... 其他配置
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['lodash']
        }
      }
    }]
  },
  plugins: [
    // ... 其他插件
    new LodashModuleReplacementPlugin()
  ]
}
```
运行这条命令安装需要的依赖
```
yarn add @babel/preset-env webpack webpack-cli @babel/core babel-loader babel-plugin-lodash lodash-webpack-plugin -D
```
然后打包, 会发现体积只有8k, 而且还是可以正确运行的

![image.png](https://upload-images.jianshu.io/upload_images/8004024-c8336fe397dc99e0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

代码地址如下: 
https://github.com/xianjiezh/lodash-optimization
