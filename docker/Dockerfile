# node.js
#
# VERSION: 0.0.1
FROM dockerfile/nodejs:latest
MAINTAINER Joao Paulo Dubas "joao.dubas@gmail.com"

# Create app user
RUN useradd -d /home/app -m app \
    && echo app:123app4 | chpasswd

# Expose port 3000 and add it as a environment variable
ENV NODE_PORT 3000
EXPOSE 3000

# Expect an app dir to be mounted and used as working directory
VOLUME ['/app']
WORKDIR /app

# Execute the command npm start when running the container
ENTRYPOINT ["npm"]
CMD ["start"]

# Run the container as app user
ENV HOME /home/app
USER app
