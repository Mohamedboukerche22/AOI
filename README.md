# New AOI admin management application
- login page 

- admin / users 

- data bases 

- Students 

- Edit information of students

- Elegent design (ig)

- Export all students to CSV or Excel format

- Import all students data and add it directly to database

- Edit existing students without changing form structure

- Form refreshes student list after operations (ig it's fast enought)

- phone - computer 

## pictures from app


<img src="public/Login.png" width="300">
<img src="public/Dashboard.png" width="300">
<img src="public/Students.png" width="300">
<img src="public/1.png" width="300">
<img src= "public/image.png" width="300">


```mermaid
graph LR
    %% Pages
    Login[Login Page]
    Dash[Dashboard]
    TechRes[Technical Resources]
    StudMgmt[Student Management]

    %% Flow
    Login -->|Authentication| Dash
    Dash --> TechRes
    Dash -.->|Hidden/Commented| StudMgmt
    TechRes --> Dash
    StudMgmt -.-> Dash

    %% Styling
    style StudMgmt stroke-dasharray: 5 5,color:#152
    style Login fill:#1ff,stroke:#333,stroke-width:2px
    
```


## Getting Started

First, run the development server:

```bash
npm i
#to install packages
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```




Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.




