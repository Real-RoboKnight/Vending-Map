# Use the official lightweight Python image
FROM python:3.12-slim

RUN apt-get update \
	&& apt-get install -y --no-install-recommends ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /code

# Copy the requirements file first to leverage Docker layer caching
COPY ./requirements.txt /code/requirements.txt

# Install dependencies without saving the cache to minimize image size
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the rest of the application code
COPY ./app /code/app

# Run the FastAPI application using the production server CLI
CMD ["fastapi", "run", "app/main.py", "--port", "80"]
