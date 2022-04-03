## 第一周分享收获

> 事前准备、事后复盘

### qiankun （微前端框架）

> shadow实现的css沙盒机制，用以隔离css样式污染

``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <p>我是dom元素p标签</p>
  <!-- 影子存放标签 -->
  <div id="shadow"></div>
  <script>
    // 创建一个影子shadow dom
    // mode:open / closed : 外界可以访问 /不可以访问
    let shaDowDom =  document.getElementById('shadow').attachShadow({mode:'closed'})
    // 我现在创建一个p标签
    let pElm = document.createElement('p')
    //写点内容
    pElm.innerHTML= '我是影子元素的p标签'
    // 创建一个style标签
    let styleElm = document.createElement('style')
    styleElm.textContent = `p{color:red ; background:pink}`
    
    //把创建的p标签和style标签   都插入到影子里去
    shaDowDom.appendChild(styleElm)
    shaDowDom.appendChild(pElm)
  </script>
</body>
</html>
```

> qiankun js隔离实现

https://segmentfault.com/a/1190000038219823

## 自我总结
- 分享的知识自己理解的不够深刻
  - seajs的时候通过正则解析依赖这里不够透彻
  - 不删除script标签为啥会导致内存泄漏没有说清楚
  - 有些地方自己没有真的搞明白就抛出了问题

- 做的好的地方
  - 分享是比较结构化的。有心路历程、背景、有demo
  - 有总结&启发（有但不够深刻）。有更加有用的启发

TODO：

1. 不糊弄。不断反问自己
2. 多联系。分享前尽可能在脑子里多过几遍，或者打草稿给写下来
3. 有启发/引申。分享完成之后对于学到的知识对于现实工作中的意义以及启发（事前多去想）


