Project Management Web Application - Prototype

Overview:
This prototype project management web application is devloped using both frontend and backend technologies to provide features such as project planning, task managements, rewards system and deadline tracking.

Technologies Used:

Frontend Technologies
1.	HTML 5 and CSS 3: Used to structure and style the user interface. 
2.	JavaScript: Adds logic and user interaction to the web application.  
4.	Live server: It is used to preview HTML, CSS, and JavaScript changes instantly in the browser. 

Backend Technologies
1.	Spring Boot (Java):  Used to develop the backend of the web application. 

 Database and Data Storage
1.	MySQL: Chosen as the main database to store projects, tasks, teams, dashboard customization, and user profiles. 
2.	OpenSSL: Generated RSA keys (private and public keys) for securing HTTP requests. It also plays a significant role in signing JWT tokens during user authentication.

Build tools
1.	Maven: Used to manage build and project tools for the backend. 

Libraries and Frameworks
1.	Intro.js: Provides an interactive onboarding tour.
2.	jsPDF: Enables the export of content from the web application into downloadable PDF files. 
3.	HTML2canvas: Used in combination with jsPDF by converting sections of the webpage into images.
4.	Frappe Gantt: Used for the implementation of the Gantt charts. 
5.	H2 database: This is an in-memory relational database to simulate the actual database during testing. 
6.	Mockito: A mocking framework for unit and integration tests in Java.

Requirements:
Before running the application, please ensure you have the following installed:
-Java 17 or latest
-Maven
-MySQL Server
-Visual Studio Code with Live Server extension.

Getting Started!

Step 1: Clone the repository (https://github.com/belsh17/demo.git)
1. Open Visual Studio Code
2. Open the terminal View > Terminal
3. Run the following command:
    git clone https://github.com/belsh17/demo.git
4. This will download the entire project into a folder named demo.
5. Then, navigate into the project folder by running the following in the terminal:
   cd demo

Step 2: Backend setup (Spring Boot + MySQL)
1. Create a MySQL database (e.g. project_management_db):
   CREATE DATABASE project_management_db;
2. Open the file demo/src/main/resources/application.properties
3. Update the following placeholder with your actual database and Google credentials:
  spring.datasource.url=jdbc:mysql://localhost:3306/project_management_db
  spring.datasource.username=YOUR_DB_USERNAME
  spring.datasource.password=YOUR_DB_PASSWORD
  spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
  spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
  spring.security.oauth2.client.registration.google.redirect-uri=http://localhost:8081/calendar/api/google/callback

For security reasons this project does not include the actual credentials in the codebase.

Step 3: Running the Backend
1. From the project root, run the backend server with:
mvn spring-boot:run or locate this file demo/src/main/java/com/example/demo/DemoApplication.java and click "run"

Step 4: Frontend Setup (Liver Server)
1. Open the index.html under the templates folder.
2. Find the button in the bottom right corner that says "Go Live"
3. The frontend will run at: http://http://127.0.0.1:5500

NOTE: Make sure the backend server is running before testing the frontend.

If you would like to test the calendar integration you will need to create your own credentials else you may skip t the application.properties update instructions. 
Create your Google OAuth credentials:

1. Go to Google Cloud Console (https://console.cloud.google.com/)
2. Create a new project.
3. Enable Google Calendar API for your project:
   - Navigate to APIs & Services > Library.
   - Search for "google Calendar API" and click Enable
4. Create OAuth 2.0 Client IDs:
   - Go to APIs & Services > Credentials
   - Click Create Credentials > OAuth client ID.
   - Select Web application.
   - Set the authorized redirect URI to: http://localhost:8081/calendar/api/google/callback 
5. Once created, copy the Client ID and ClientSecret.

Final notes:
- Spring Boot will auto-generate databse tables using JPA
- You do not need to manually import tables.
- Credentials are excluded to follow security practices.
