# Use the Python 3.12 image as base
FROM python:3.13-rc-slim-bookworm

# Copy only requirements to cache them in docker layer
WORKDIR /code

COPY . /code

COPY backend/requirements.txt /code/

RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential pip libffi-dev \
    curl \
    apt-utils \
    gnupg2 &&\
    rm -rf /var/lib/apt/lists/* && \
    pip install --upgrade pip


RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
RUN curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list

RUN apt-get update
RUN env ACCEPT_EULA=Y apt-get install -y msodbcsql18

RUN pip install poetry
ENV PATH="${PATH}:/root/.local/bin"
RUN poetry install

# CMD ["poetry","run","backend/app.py"]


