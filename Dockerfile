# 使用 Node.js 官方镜像
FROM node:16

# 创建工作目录
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到工作目录中
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有项目文件到容器中
COPY . .

# 设置环境变量（如果有必要）
ENV NODE_ENV production

# 设置启动命令
CMD ["npm", "start"]

# 暴露端口（确保与平台的端口变量一致）
EXPOSE 3000
