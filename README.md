# sequelize-typescript-auto

English | [中文](https://github.com/YES-Lee/sequelize-typescript-auto/blob/master/README.zh_CN.md)

Automatically generate models for sequelize-typescript

## install

```bash
npm i -g sequelize-typescript-auto
```

## use

```text
Usage: sequelize-typescript-auto [options]

Options:
  -V, --version              output the version number
  -H, --host <host>          database host
  -d, --database <database>  name of database
  -u, --username <username>  user of database
  -x, --password <password>  password of database
  -p, --port <port>          port of database, default 3306 (default: 3306)
  -o, --output <dir>         models output dir (default: "./models")
  -f, --prefix <prefix>      to exclude table prefix (default: "")
  -h, --help                 output usage information
```

## example

```bash
sequelize-typescript-auto -H localhost -d test -u root -x 123456 -p 3306 -f test_ -o ./_models
```

## TODO

* [x] support mysql
* [x] cli usage
* [ ] programing usage
* [ ] map foreignkeys
* [ ] hash check
* [ ] generate countor
* [ ] support SQL Server
* [ ] support PostgreSQL

## License

MIT: https://rem.mit-license.org
