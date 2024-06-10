# Video Sharing Platform

This repository contains the frontend and backend code for a video sharing platform. The frontend is built using React and the backend uses Django with Django REST Framework.

### Deployed Link
- Backend: https://video-platform-production.up.railway.app/
- Frontend: https://video-platform-eosin.vercel.app/upload

## Getting Started

Follow the instructions below to set up and run the project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js
- npm (Node Package Manager)
- Python
- pip (Python Package Installer)
- virtualenv (Python virtual environment tool)

## Installation

Clone the repository:
```bash
git clone https://github.com/your-repository.git
cd your-repository
```
Set up a virtual environment and activate it
```bash
virtualenv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

Install the required packages:
```bash
pip install -r requirements.txt
```

Apply the migrations
```bash
python manage.py migrate
```

Start the Django development server:
```bash
python manage.py runserver
```
Navigate to frontend directory
```bash 
cd frontend
```

Start Server
```bash
npm start
```
## Folder Structure
- video_platform/: Contains the Django backend code.
- frontend/: Contains the React frontend code.

### Backend
- manage.py: Django's command-line utility.
- backend/settings.py: Configuration for the Django project.
- video_platform/urls.py: URL declarations for the Django project.
- posts/: Django app containing Post models and the API endpoints to upload, delete, view, and share video posts.
- users/: defines Custom user model for the Users

### Frontend
- src/: Contains the React components and configuration.
- src/components/: React components.
- src/AuthContext.js: Context for handling authentication.
- src/styles.css: CSS file for styling the application.

### Admin Logins
- Email: k@gmail.com
- Password: asdfjkl;

## API EndPoints
### Authentication
- POST /api/v1/rest-auth/login/: Login a user.
- POST /api/v1/rest-auth/logout/: Logout a user.
- POST /api/v1/rest-auth/registration/: Register a new user.
- POST /api/v1/rest-auth/password/reset/: Reset password.

### Posts
- GET /: Retrieve all posts.
- GET /api/v1/post-detail/:id/: Retrieve details of a specific post.
- POST /api/v1/post-upload/: Upload a new video.
- DELETE /api/v1/post-delete/:id/: Delete a specific post.

### Comments
- GET /api/v1/view-comments/:id/: Retrieve comments for a specific post.
- POST /api/v1/add-comment/:id/: Add a new comment to a specific post.

## Features
- User Authentication: Register, login, and logout functionality.
- Video Upload: Users can upload videos.
- Video Viewing: View a list of videos and their details.
- Comments: Add and view comments on videos.
- Social Sharing: Share videos via social media and email.
- Navigation: Navigate between different posts.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
