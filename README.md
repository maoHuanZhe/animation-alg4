## 简介

[animation-alg4](https://github.com/maoHuanZhe/animation-alg4) 是一个算法的动画展示项目，它基于 [vue](https://github.com/vuejs/vue) 和 [element-ui](https://github.com/ElemeFE/element) 实现。本项目是作者在学习《算法》第四版时，根据书中的算法逻辑用前端技术实现的排序、查找等算法。

- [在线预览](http://alg4.fgrapp.com/)

**目前版本为 `v1.0+` 基于 `vue-cli` 进行构建，若发现问题，欢迎提[issue](https://github.com/maoHuanZhe/animation-alg4/issues/new)。

## 前序准备

你需要在本地安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/) 。本项目技术栈基于 [ES2015+](http://es6.ruanyifeng.com/) 、[vue](https://cn.vuejs.org/index.html) 、[vuex](https://vuex.vuejs.org/zh-cn/) 、[vue-router](https://router.vuejs.org/zh-cn/) 、[vue-cli](https://github.com/vuejs/vue-cli) 和 [element-ui](https://github.com/ElemeFE/element) 提前了解和学习这些知识会对使用本项目有很大的帮助。

<p>
  <img alt="示例图片" width="900" src="http://alg4.fgrapp.com/animation-alg4.PNG" />
</p>

## 功能

```
- 排序
  - 选择排序
  - 插入排序
  - 希尔排序
  - 自顶向下的归并排序
  - 自底向上的归并排序
  - 快速排序
  - 三分快速排序
  - 堆排序

- 查找
 -  顺序查找
 -  二分查找
 -  二叉树(todo)
 -  红黑树(todo)
 -  散列表(todo)

- 图
 -  todo

- 字符串
 -  todo
```

## 开发

```bash
# 克隆项目
git clone https://github.com/maoHuanZhe/animation-alg4.git

# 进入项目目录
cd animation-alg4

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:8080

## 发布

```bash
npm run build
```

## 其它
作者的前端技术还是很垃圾，目前项目在手机以及pad上访问样式应该还是混乱的。
另外作者准备在把后续的算法页面写完以后，再写出对应的文章。

## Changelog


## Online Demo

[在线 Demo](http://alg4.fgrapp.com)

## License

MIT

## 写在最后
写这个项目的初始目的一是为了巩固记忆算法，另一个原因是现在好像并没有类似的项目，动画展示对算法的逻辑以及步骤的理解一直是很有帮助的。在作者写这个项目之前也在网上找了算法动画相关的文章，发现大多数都是GIF图片就行展示。
所以作者就想写一个网页版算法的动态展示。
