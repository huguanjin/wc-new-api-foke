# 新服务器部署说明

这是带「渠道管理员 / 只读管理员」定制的 New API。  
新服务器不要用官方镜像 `calciumion/new-api`，必须用本仓库源码自己构建。

## 1. 拿到代码

```bash
git clone <你的仓库地址> new-api
cd new-api
```

如果拿到的是打包文件 `new-api-custom.bundle`：

```bash
git clone new-api-custom.bundle new-api
cd new-api
```

## 2. 启动服务

服务器需要已安装 Docker 和 docker-compose。

```bash
docker-compose up -d --build
```

第一次构建要下载环境和编译，可能需要 10–20 分钟。  
启动成功后，本机访问：`http://服务器IP:3000`

## 3. 用 80 端口（可选）

把 `deploy/nginx-new-api.conf` 拷到 nginx 配置目录并重载 nginx，即可用 `http://服务器IP/` 访问。

## 4. 安全提醒

`docker-compose.yml` 里的 MySQL / Redis 密码目前是默认值 `123456`。  
正式环境请先改密码再启动。
