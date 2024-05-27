# chat-app

## Date of submission
May 27, 2024

## How to run locally
### Prerequisites
- Docker and Docker Compose installed on your machine

### Steps
1. Clone the repository:
```
gh repo clone candrasaputra/chat-app
```
2. Run the application using Docker Compose:
```
docker compose up --build
```
3. Access the application:
- backend: http://localhost:8081
- frontend: http://localhost:3000

## Time spent
I spent approximately 10 hours on the assignment, divided as follows:
- Backend development: 4 hours
- Frontend development: 4 hours
- Testing and debugging: 1 hours
- Documentation: 1 hour

## Assumptions
- Each room is uniquely identified by a RoomID, which is a text string.
- Usernames must be unique within a chat room and can't be reused in different rooms.
- Validation is performed before a user can join a room.
- User can't send message if there have network issue

## Shortcuts/Compromises made
- The application does not include advanced error handling for edge cases to save time.
- CSS styles are minimal and may not cover all responsive design scenarios.

## Assume your application will go into production
### Testing
- Unit Tests: Write unit tests for both frontend and backend components.
- Integration Tests: Develop integration tests to ensure different parts of the system work together correctly.

### Pipeline
- CI/CD Pipeline: Set up a CI/CD pipeline using GitHub Actions or similar, to automatically run tests, build the application, and deploy it to production.
- Automated Tests: Ensure the pipeline includes steps to run all tests automatically on each commit.

### Ensuring Smooth User Experience
- Service Separation: Split the socket real-time service and API service into different microservices to distribute the load.
- Horizontal Scaling: Implement horizontal scaling using a load balancer to distribute incoming traffic across multiple instances.
- Database Optimization: Analyze and optimize slow queries, add indexes where necessary, and paginate data to improve performance.

### Key Steps for Application Security
- CORS: Implement CORS to control which domains can access the backend API.
- JWT Authentication: Use JWT tokens for user authentication, including additional claims for browser information and IP address to enhance security.
- Data Validation: Perform thorough validation on all input data to prevent injection attacks.
- Environment Variables: Use environment variables for sensitive configurations to keep them secure.

## What did you not include in your solution that you want us to know about? Were you short on time and not able to include something that you want us to know about? Please list it here so that we know that you considered it.
- Advanced Error Handling: Comprehensive error handling for all possible scenarios.
- Responsive Design: Minimal CSS styling and responsiveness adjustments.
- Load old messages in batch

## Other information about your submission that you feel it's important that we know if applicable.
- The service will synchronize the client's state upon reconnection. For example, if a user experiences a network issue and another user sends a message, the first user will receive the message once their network is restored.

## Feedback on this technical challenge
Overall, the technical challenge was well-structured and provided clear guidelines.