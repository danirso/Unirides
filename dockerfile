# Use uma imagem oficial do Node.js como base
FROM node:latest

WORKDIR /app

COPY ./entrypoint.sh /app/

RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["npm", "start"]
