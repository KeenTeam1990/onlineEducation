## v2.1.0.2（2021-03-21）
修复了 `nvue` 端使用可能报错的问题
## v2.1.0（2021-03-20）
1. `A` 增加了 [container-style](https://jin-yufeng.gitee.io/mp-html/#/basic/prop#container-style) 属性 [详细](https://gitee.com/jin-yufeng/mp-html/pulls/1)
2. `A` 增加支持 `strike` 标签
3. `A` `editable` 插件增加 `placeholder` 属性 [详细](https://jin-yufeng.gitee.io/mp-html/#/advanced/plugin#editable)
4. `A` `editable` 插件增加 `insertHtml` 方法 [详细](https://jin-yufeng.gitee.io/mp-html/#/advanced/plugin#editable)
5. `U` 外部样式支持标签名选择器 [详细](https://jin-yufeng.gitee.io/mp-html/#/overview/quickstart#setting)
6. `F` 修复了 `nvue` 端部分情况下可能不显示的问题
## v2.0.5（2021-03-12）
1. `U` [linktap](https://jin-yufeng.gitee.io/mp-html/#/basic/event#linktap) 事件增加返回内部文本内容 `innerText` [详细](https://github.com/jin-yufeng/mp-html/issues/271)
2. `U` [selectable](https://jin-yufeng.gitee.io/mp-html/#/basic/prop#selectable) 属性设置为 `force` 时能够在微信 `iOS` 端生效（文本块会变成 `inline-block`） [详细](https://github.com/jin-yufeng/mp-html/issues/267)
3. `F` 修复了部分情况下竖向无法滚动的问题 [详细](https://github.com/jin-yufeng/mp-html/issues/182)
4. `F` 修复了多次修改富文本数据时部分内容可能不显示的问题
5. `F` 修复了 [腾讯视频](https://jin-yufeng.gitee.io/mp-html/#/advanced/plugin#txv-video) 插件可能无法播放的问题 [详细](https://github.com/jin-yufeng/mp-html/issues/265)
6. `F` 修复了 [highlight](https://jin-yufeng.gitee.io/mp-html/#/advanced/plugin#highlight) 插件没有设置高亮语言时没有应用默认样式的问题 [详细](https://github.com/jin-yufeng/mp-html/issues/276) by [@fuzui](https://github.com/fuzui)
