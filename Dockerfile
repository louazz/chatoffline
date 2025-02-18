FROM debian:bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get upgrade -y

COPY dist .


EXPOSE 5173
EXPOSE 3000


CMD ["sh","./file-sharing-1.0.0.AppImage"]