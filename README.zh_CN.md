# sequelize-typescript-auto

[English](https://github.com/YES-Lee/sequelize-typescript-auto) | 中文

从数据库自动生成`sequelize-typescript`的`model`

## 安装

```bash
npm i -g sequelize-typescript-auto
```

## 使用

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

## 示例

```bash
sequelize-typescript-auto -H localhost -d test -u root -x 123456 -p 3306 -f test_ -o ./_models
```
