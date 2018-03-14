# rangeClock
以时钟形式显示已占用时段，支持多时段显示，可自定义修改表盘配色及大小

### 使用方法：

```html
<canvas class="clockCanvas" id="AMClock">您的浏览器当前版本不支持canvas表签</canvas>
```

* 调用方法：
```js
$('#AMClock').rangeClock({
  arcArgs: {
    width: 122,   // 宽
    height: 122, // 高
    radius: 61, // 表盘半径
    times: [{s: 2, e: 5}, {s: 6, e: 10.5}] // 已占用时段
  }
});
```
