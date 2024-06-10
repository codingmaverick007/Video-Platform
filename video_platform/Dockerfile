# Use the official Python base image
FROM python:3.12

# Set the working directory inside the container
WORKDIR /app

ENV PORT=8080

# Copy the requirements.txt file and install dependencies
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

RUN python manage.py collectstatic --noinput

# Set environment variables if needed (e.g., database URL)
# ENV DATABASE_URL="your_database_url"

# Specify the command to run your Django app using gunicorn
# Specify the command to run your Django app using gunicorn
CMD gunicorn video_platform.wsgi:application --bind 0.0.0.0:${PORT} --timeout 600


