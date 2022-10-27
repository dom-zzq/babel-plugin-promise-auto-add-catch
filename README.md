# babel-plugin-promise-auto-add-catch
一个自动给promise添加catch的babel插件


### 安装

```shell
npm install --save-dev babel-plugin-promise-auto-add-catch
```

### 使用说明
babel.config.js 配置如下

```javascript
module.exports = {
  plugins: [
    [
        require('babel-plugin-await-add-trycatch'),
        {
            exclude: ['build']
        }
    ]
}
```
