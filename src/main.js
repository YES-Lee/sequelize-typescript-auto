// inspired by sequelize-auto https://github.com/sequelize/sequelize-auto/blob/master/lib/index.js

const Sequelize = require('sequelize')
const async = require('async')
const _ = require('lodash')
const utils = require('./utils')
const camelCase = require('camelcase')
const path = require('path')
const fs = require('fs')
const ora = require('ora')
const chalk = require('chalk')

function STAuto(database, username, password, options) {

  this.sequelize = new Sequelize(database, username, password, {
    dialect: 'mysql',
    ...(options || {}),
    logging: () => {},
    typescript: true
  });

  this.queryInterface = this.sequelize.getQueryInterface();
  this.tables = {};
  this.foreignKeys = {};

  this.options = _.extend({
    global: 'Sequelize',
    local: 'sequelize',
    spaces: false,
    indentation: 2,
    output: './models',
    additional: {},
    freezeTableName: true,
    typescript: false,
    camelCaseForFileName: false
  }, options || {});
}

/**
 * map tables and foreignkeys
 */
STAuto.prototype.mapTables = function() {
  const spinner = ora('mapping tables').start()
  return new Promise((resolve, reject) => {
    this.queryInterface.showAllTables().then(__tables => {
      let tables
      if (this.options.tables) {
        // intersection between all tables and specified tables
        tables = _.intersection(__tables, this.options.tables)
      } else if (this.options.skipTables) {
        tables = _.difference(__tables, this.options.skipTables)
      } else {
        tables = __tables
      }
  
      async.each(tables, (table, cb) => {
        this.queryInterface.describeTable(table, this.options.schema).then(fields => {
          this.tables[table] = fields
          cb()
        }, cb)
      }, err => {
        if (err) {
          throw err
        }
        spinner.succeed(`found ${tables.length} tables`)
        resolve(tables)
      })
    })
  })
}

STAuto.prototype.generate = function() {
  const text = {}
  let tables = _.keys(this.tables)

  const genTextSpinner = ora('generating text').start()

  return new Promise((resolve, reject) => {
    async.each(tables, (tableName, cb) => {
      const modelName = camelCase(this.options.prefix ? tableName.replace(this.options.prefix, '') : tableName, { pascalCase: true })
      const imports = {
        'sequelize-typescript': [
          'Model',
          'Table',
          'Column',
          'AllowNull',
          'AutoIncrement',
          'Unique',
          'Default',
          'PrimaryKey',
          'Comment'
        ]
      }
      const classDecorators = [
        `@Table({ tableName: '${tableName}' })`
      ]
      const indentation = utils.indent(this.options.indentation)
      let tableText = ''
      tableText += classDecorators.join('\n') + '\n'
      tableText += `export class ${modelName} extends Model<${modelName}> {\n`

      // generate columns
      const columns = Object.keys(this.tables[tableName])
      if (columns.length) {
        imports['sequelize-typescript'].push('DataType')
      }
      columns.forEach(col => {
        const colDecorators = []
        const colObj = this.tables[tableName][col]
        const colType = colObj.type.split('(')[0]
        colDecorators.push(`${indentation}@Column`)
        // colDecorators.push(`${indentation}@Column(DataType.${colType})`)

        colDecorators.push(`${indentation}@Comment('${colObj.comment || ''}')`)

        colDecorators.push(`${indentation}@AllowNull(${colObj.allowNull})`)

        // colDecorators.push(`${indentation}@Default(${colObj.defaultValue})`)

        if (colObj.primaryKey) {
          colDecorators.push(`${indentation}@PrimaryKey`)
        }

        if (colObj.autoIncrement) {
          colDecorators.push(`${indentation}@AutoIncrement`)
        }

        if (colObj.unique) {
          colDecorators.push(`${indentation}@Unique`)
        }

        tableText += '\n' + colDecorators.join('\n') + '\n'
        tableText += `${indentation}${col}${colObj.allowNull ? '?' : ''}: ${utils.tsType(colType)};\n`
      })
  
      tableText += `}\n`
      tableText = utils.importsString(imports) + '\n\n' + tableText
      text[modelName] = tableText
      cb()
    }, err => {
      if (err) {
        throw err
      }
      genTextSpinner.succeed()
      chalk.green('models gennerated successfully')
      this.text = text
      resolve(text)
    })
  })
}

STAuto.prototype.write = function() {
  const writeFileSpinner = ora('writing files').start()
  if (!fs.existsSync(path.resolve(this.options.output))) {
    fs.mkdirSync(path.resolve(this.options.output))
  }
  async.eachOf(this.text, (table, tableName, cb) => {
    const filePath = path.resolve(path.join(this.options.output, `${camelCase(tableName, { pascalCase: true })}.model.ts`))
    const data = new Uint8Array(Buffer.from(table))
    fs.writeFileSync(filePath, data, { encoding: 'utf8' })
    cb()
  }, err => {
    if (err) {
      throw err
    }

    writeFileSpinner.succeed()
  })
}

STAuto.prototype.run = function() {
  return this.mapTables()
    .then(this.generate.bind(this))
    .then(this.write.bind(this))
    .then(() => null)
}

module.exports = STAuto