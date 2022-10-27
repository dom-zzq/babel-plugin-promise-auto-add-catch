function isObjectProperty(t, callee, name) {
    if (!callee || !t.isMemberExpression(callee)) {
        return false
    }
    if (callee.computed) { // handle a['b']
        return t.isStringLiteral(callee.property, {
            value: name
        })
    } else { // handle a.b
        return t.isIdentifier(callee.property, {
            name
        })
    }
}

function matchesFile(list, filename) {
    return list.find((name) => name && filename.includes(name));
}

module.exports = {
    isObjectProperty,
    matchesFile
}