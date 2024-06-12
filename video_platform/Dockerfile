# Use the official Python base image
FROM python:3.12

# Set the working directory inside the container
WORKDIR /app

ENV PORT=8080

# Install dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements.txt file and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Set environment variables if needed (e.g., database URL)
# ENV DATABASE_URL="your_database_url"

# Expose the port the app runs on
EXPOSE ${PORT}

# Specify the command to run your Django app using gunicorn
CMD gunicorn video_platform.wsgi:application --bind 0.0.0.0:${PORT} --timeout 600
