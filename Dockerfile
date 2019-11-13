# base image
FROM node:13.1.0

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# install and cache app dependencies
COPY . /usr/src/app/
RUN npm install

EXPOSE 3000

# start app
CMD ["npm", "start"]