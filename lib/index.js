const template = require('babel-template');
const {
    isObjectProperty,
    matchesFile
} = require('./util');


module.exports = function ({types: t}) {
    return {
        name: "babel-plugin-promise-auto-add-catch",
        visitor: {
            CallExpression (path) {

                // 通过this.opts 获取用户的配置
                if (this.opts && !this.opts instanceof Object) {
                    return console.error('[babel-plugin-promise-add-catch]: Options muse be an Object.');
                }
                
                // 在排除列表的文件不编译
                if (matchesFile(this.opts.exclude || [], filePath)) {
                    return;
                }

                let polyfillPath = path
                const { node } = polyfillPath;

                if (!(t.isMemberExpression(node.callee) && t.ThisExpression(node.callee.object) && t.isIdentifier(node.callee && node.callee.property, { name: '$confirm' }))) {
                    return
                }
                
                const catchPath = path.findParent(({ node }) => {
                    return t.isFunction(node) || isObjectProperty(node.callee, 'catch')
                })
                if (catchPath && !t.isFunction(catchPath.node)) {
                    return
                }

                const mostOuterThenPath = path.findParent(pPath => {
                    const node = pPath.node;

                    return t.isFunction(node) || (isObjectProperty(node.callee, 'then') && !t.isMemberExpression(pPath.parentPath.node))
                })

                if (mostOuterThenPath && !t.isFunction(mostOuterThenPath.node)) {
                    polyfillPath = mostOuterThenPath
                }

                // 定义语句模板
                let tryTemplate = `
                    {
                        console.log(errorInfo)
                    }
                `;
                const temp = template(tryTemplate);

                // 获取到最外层then所在的节点以后，就用它构建一个callExpression新节点，并替换掉它：
                const arrowFunctionNode = t.arrowFunctionExpression(
                    [t.identifier('err')],
                    temp({
                        errorInfo: t.identifier('err')
                    })
                )
          
                const newNode = t.callExpression(
                    t.memberExpression(
                        polyfillPath.node,
                      t.identifier('catch')
                    ),
                    [arrowFunctionNode]
                )
                polyfillPath.replaceWith(newNode)
            
            }
        }
    }
}