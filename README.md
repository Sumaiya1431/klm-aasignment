# KLM Assignment

# Installation Guide

# Pre Requisite

1. MYSQL Installation
2. NPM
3. Maven

# Overview

The Application is an assignment for KLM. It's basically an application to arrange a holiday for a crew member. This application can perform the following task

1. Overview of my scheduled holidays. 
2. Create a valid new holiday. 
3. Cancel (delete) a scheduled holiday. 
4. Edit a scheduled holiday. 
5. As another crew member, I want all of the above and make sure that my holiday does not overlap the one of other crew members.

Validations that were considered:

    1. There should be a gap of at least 3 working days between holidays.
    2. A holiday must be planned at least 5 working days before the start date.
    3. A holiday must be cancelled at least 5 working days before the start date.
    4. Holidays must not overlap (for the sake of this assignment also not
       between different crew members).

# Project Installation

1. Backend Installation:

I would suggest to use Eclipse or IntelliJ IDEA 2021.2.2 IDE and import klm-assignment folder

    1. cd backend
    2. mvn clean install

2. Frontend Installation:

Go to Frontend folder and run npm install

# Configuration

1. DB Configuration

Edit the file according to the below configuration in IDE
on src/main/resources/application.properties

spring.datasource.url=jdbc:mysql://localhost:<port_no>/<database_name>  
spring.datasource.username=<database_user_name>  
spring.datasource.password=<database_password>  
spring.jpa.show-sql=true  
spring.jpa.hibernate.ddl-auto=update  
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5Dialect

2. FrontEnd Configuration

Edit the apiBaseUrl in file src\environments\environment.ts

# Commands to run the project

1. Backend

    1. cd backend
    2. mvn spring-boot:run

2. FrontEnd

In frontend folder run the command "ng serve"

# Mock Data For Employee


# Future Improvements


