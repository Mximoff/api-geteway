FROM node:18-alpine

# نصب dependencies سیستمی
RUN apk add --no-cache tini

# ساخت دایرکتوری کاری
WORKDIR /app

# کپی فایل‌های package
COPY package*.json ./

# نصب dependencies (اگر بخواهی بعداً اضافه کنی)
# RUN npm install --production

# کپی کد اصلی
COPY server.js .

# تعیین پورت
EXPOSE 8000

# استفاده از tini برای signal handling بهتر
ENTRYPOINT ["/sbin/tini", "--"]

# اجرای سرور
CMD ["node", "server.js"]
