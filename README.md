# SkillBoost

This project is a part of Web Application Development in HCMUS.

## Table of Contents

- [SkillBoost](#skillboost)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Dependencies](#dependencies)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
  - [Usage](#usage)

## Introduction

SkillBoost is an online course marketplace that connects learners with instructors and industry experts across various fields. The project aims to provide a modern, flexible, and effective learning experience, allowing users to easily access high-quality courses.
  
## Dependencies
- Node.js
- MongoDb

## Technologies Used

-   **Handlebars**
-   **Express.js**
-   **Tailwind CSS**
-   **Redis**
-   **AlgoliaSearch**

## Installation

To get started with this project, follow these steps:

1. Clone this repository:
    ```sh
    git clone https://github.com/simpleHuy/E-learning.git
    ```
2. Navigate to the project directory:
    ```sh
    cd E-learning
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

To run the project locally, use the following these steps:
1. Add the `config.env` file based on the template from `config.env.sample`:
    ```
        MONGODB_URI=

        SECRET_KEY=
        GOOGLE_CLIENT_ID=
        GOOGLE_CLIENT_SECRET=

        EMAIL=
        PASS_EMAIL=

        BASE_URL=

        vnp_TmnCode=
        vnp_HashSecret=
        vnp_Url=
        vnp_apiUrl=

        REDIS_USER=
        REDIS_PASSWORD=
        REDIS_HOST=

        ALGOLIA_APP_ID=
        ALGOLIA_API_KEY=

        SUPABASE_URL=
        SUPABASE_KEY=
    ```
2. Run below command to run project
    ```sh
    npm start
    ```
