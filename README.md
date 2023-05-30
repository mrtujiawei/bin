# @mrtujiawei/bin

shell 工具

## server

```
Usage: t server [options]

静态文件服务，支持https，请求代理

Options:
  -s, --https            开启https (default: false)
  -p, --port <port>      监听端口号 (default: "3000")
  -d, --dir <directory>  项目根目录 (default: 当前目录)
  -t, --target <url>     代理目录地址
  --prefix <prefix>      需要代理的路径前缀 (default: "/api")
  --rewrite              是否移除前缀 (default: false)
  -h, --help             display help for command
```


## push-all

提交所有当前目录下的代码

```
push-all
```

## download-m3u8

下载 m3u8 及 ts 文件

```shell
# dir 下载目录
download-m3u8 {m3u8} [-dir {dir}]
```

## split-m3u8

```shell
# filename 不要带.mp4
split-m3u8 {filename}
```

## combine-m3u8

```shell
combine-m3u8 {filename} {port}
```
