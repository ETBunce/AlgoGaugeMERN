# AlgoGauge

This is Brad's tenure project.

## Contributers

Ethan Bunce

John DeGray

Justin Singh

Daxton Butler

## Getting Started

### Prerequisites

- **For Windows machines**, install Visual Studio (Purple One) and get C++ Extension

- `git clone (C++ AlgoGauge CLI repository in backend/programs)` (recommend using HTTPS)

### Frontend

1. Make .env file in frontend folder
   - Inside of .env, make sure to have following variables:

      -REACT_APP_API = http://localhost:4000

      -REACT_APP_ENV_BASENAME=/

      -REACT_APP_BASE_URL= http://localhost:3000/
  
2. `cd frontend`
3. `npm install`
4. `npm start`

**NOTE**: Create React App uses process.env.(YOUR ENVIRONMENT VARIABLE HERE) to access env variables in frontend

#### Figma Design

- [Link to UI Design](https://www.figma.com/file/r5alAblSJBMorkuXMqm3Vh/AlgoGauge?type=design&node-id=0%3A1&mode=design&t=bXLYWE9pL1FxuJFI-1)

### Backend

1. Make .env in backend folder

   - Inside of .env, make sure to have following variables:

      - MONGODB_CONNECTION_STRING (get this from mongodb website from cluster and press connect on AlgoGauge database to get the string. Make sure to have database username and password and save the password somewhere)

      - MONGODB_DATABASE_NAME = (name of database to connect which was made from cluster)

      - SESSION_SECRET = (random 64 hex string)
         - to generate a random 64 hex string:

           ```
           node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
           ```

2. `cd backend/programs/AlgoGauge`
3. `npm install`
4. `mkdir cmake-build-debug`
5. `cd cmake-build-debug`
6. `cmake ..`
   - If UNIX, then do `cd ..` afterwards
7. `cmake --build .`
8. `cd Debug`
9. `./AlgoGauge -h`
   - Gives instructions to how program is run
10. `npm start`

**NOTE**: NodeJS uses process.env.(YOUR ENVIRONMENT VARIABLE HERE) to access env variables in backend

#### CLI command examples

```powershell
./AlgoGauge --algo quick --len 100000 -r --algo bubble --len 100000 -r
```

```powershell
*./AlgoGauge --algo quick --len 10000 --algo bubble --len 10000 --algo selection --len 10000 --algo insertion --len 10000 --algo merge --len 10000 --algo heap --len 10000 --algo quick --len 10000 --algo bubble --len 10000 --algo selection --len 10000 --algo insertion --len 10000 --algo merge --len 10000 --algo heap --len 10000 --algo quick --len 10000 --algo bubble --len 10000 --algo selection --len 10000 --algo insertion --len 10000 --algo merge --len 10000 --algo heap --len 10000 --algo quick --len 10000 --algo bubble --len 10000 --algo selection --len 10000 --algo insertion --len 10000 --algo merge --len 10000 --algo heap --len 10000 --algo quick --len 10000 --algo bubble --len 10000 --algo selection --len 10000 --algo insertion --len 10000 --algo merge --len 10000 --algo heap --len 10000 *rrrrrrssssssooooooeeeeeecccccc
```

```powershell
*./AlgoGauge --algo quick --len 1000 --algo bubble --len 1000 --algo selection --len 1000 --algo insertion --len 1000 --algo merge --len 1000 --algo heap --len 1000 -rrrrrr
```
