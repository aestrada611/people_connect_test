# people_connect_test

Shared Steps:
-Make sure you have npm installed
-Clone the Repo

Set Up For Local Dev:
-Go to root of the project
1.npm install
2.npm run build
3.npm run server
4.npm start

Set Up With Dockerfile
-Go to root of project
-Build the Image
  1. docker build -t people_connect_test .
  2. docker run docker run -d -p 80:8080 -p 3000:3000 people_connect_test localapp:latest
-Go to localhost to ineract with the app
