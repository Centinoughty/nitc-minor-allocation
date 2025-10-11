# Minor Allocation Portal for NITC

A web portal for **NIT Calicut** that enables students to register, submit preferences, and be allocated minor degree programs in a fair, transparent manner.

## Features

- Student regsitration, authentication, and profile management
- View list of offered minor programs
- submit ranked preferences of minors
- Automated allocation of minors based on preferences and constraints
- Admin dashboard: manage minors, courses, seat counts, allocations
- Notifications to students about allocation results
- Logging and basic reporting

## Technologies and stack

- **Frontend**: Next JS
- **Admin Panel**: Vite
- **Backend**: Node.js
- **Database**: MongoDB

## Setup

1. **Clone the Repository**

```bash
git clone https://github.com/Centinoughty/nitc-minor-allocation.git
cd nitc-minor-allocation
```

start-minor-services.sh2. **Install Dependancies**

```bash
cd server
npm install

cd ..
cd admin
npm install

cd ..
cd client
npm install
```

3. **Configure the Environment**

Set the environment variables referring .env.example

4. **Run the Services**

```bash
bash start-minor-services.sh
```
