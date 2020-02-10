exports.indent = num => {
  let indentation = ''
  for (let i = 0; i < num; i++) {
    indentation = indentation + ' '
  }
  return indentation
}

exports.importsString = imports => {
  let str = ''
  Object.keys(imports).forEach(k => {
    str+= `import { ${imports[k].join(', ')} } from '${k}';`
  })
  return str
}

exports.tsType = (colType = '') => {
  return {
    VARCHAR: 'string',
    STRING: 'string',
    TEXT: 'string',
    UUID: 'string',

    INT: 'number',
    INTEGER: 'number',
    BIGINT: 'number',
    FLOAT: 'number',
    DOUBLE: 'number',
    DECIMAL: 'number',

    DATE: 'Date',
    DATETIME: 'Date',
    DATEONLY: 'Date',

    BOOLEAN: 'boolean',
  }[colType.toUpperCase()] || 'any'
}
