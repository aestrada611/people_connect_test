# people_connect_test

Shared Steps:  
-Make sure you have npm installed  
-Clone the Repo (https://github.com/aestrada611/people_connect_test.git)

Set Up For Local Dev:  
-Go to root of the project

1. npm install
2. npm run build
3. npm run server  

-In a new terminal at the root of the project
4. npm start

Set Up With Dockerfile:  
-Go to root of project  
-Build the Image

1. docker build -t people_connect_test .  
   -Start the container
2. docker run -d -p 8080:8080 -p 3000:3000 people_connect_test  
   -Go to localhost:8080 to interact with the app.

Places to improve/Lessons Learned:

- The biggest issue with my approach in the app was not organizing my folder structure. I should have had a folder for client and one for server. Main reason I didn't do this was because I was trying to get the app up and running and thought it would be easier to have everything in one place.
- Another big issue was not using React as it is intended with multiple components. I was able to get the app working with one component but it would have been easier to manage the app with multiple components. Especially in a real world scenario where the app would be much larger. I just ran out of time to refactor the app to use multiple components. I also felt like it would have been overkill for such a small app, but I do see the value in using multiple components.
- Another issue was not using a state management library like Redux. I was able to get the app working without it but it would have been easier to manage the state of the app with Redux(KEA). It just also felt like overkill for a smaller app.
- I also didn't use a CSS library like Material UI. I used CSS to keep the app as light as possible but in an actual project I would use a CSS library to make the app look better.
- I also didn't use a testing library like Jest. I would have liked to have used Jest to test the app but I didn't have enough time to implement it.
- I also was forced to use a script in order to get the app to work with Docker. I would have liked to have used a only the Dockerfile to get the app to work.
