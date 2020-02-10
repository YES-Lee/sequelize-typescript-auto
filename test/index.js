const STAuto = require('../')
const path = require('path')

const auto = new STAuto('xb_robot', 'root', '123456', {
  port: 3307,
  directory: path.resolve(__dirname, '../models')
})

auto.run().then(() => process.exit(0))

