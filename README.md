# MEAN Stack-Based Online Appointment Booking and Scheduling System

A complete college project built with MongoDB, Express.js, Angular, and Node.js.

## Features

**Customer:** register/login, browse services, view providers, view available slots, book appointments, view upcoming/past appointments, cancel appointments.

**Provider:** register/login, create/edit/delete services, manage availability slots, view booked appointments, confirm/reject/complete appointments.

Double-booking is prevented using an atomic MongoDB update on the slot when an appointment is created.

## Prerequisites

- Node.js (v18 or later recommended)
- MongoDB running locally (or a MongoDB Atlas connection string)
- Angular CLI: `npm install -g @angular/cli`

## 1. Backend Setup

```bash
cd backend
npm install
```

Create your local `.env` from the provided template (`.env` is git-ignored and must not be committed):

```bash
cp .env.example .env      # Windows (cmd): copy .env.example .env
```

Then edit `.env` if needed (defaults to a local MongoDB instance). Set `JWT_SECRET` to your own long random string:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/appointment_booking
JWT_SECRET=change_this_to_a_long_random_secret_key
JWT_EXPIRES_IN=7d
```

Make sure MongoDB is running, then start the backend:

```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start        # plain node
```

The API will run at `http://localhost:5000/api`.

Quick check: open `http://localhost:5000/api/health` — should return `{"status":"OK"}`.

## 2. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
ng serve
```

The app will run at `http://localhost:4200` and is already configured (see `src/environments/environment.ts`) to talk to the backend at `http://localhost:5000/api`.

## 3. Using the App

1. Go to `http://localhost:4200`, click **Register**.
2. Register one account as a **provider** and one as a **customer** (use two different browsers/incognito windows, or log out/in between).
3. As the **provider**: go to *Manage Services* to add a service, then *Manage Availability* to add time slots.
4. As the **customer**: go to *Services*, pick the provider's service, select a date, pick an open time slot, and book.
5. As the **provider**: go to *Appointments* to confirm, reject, or complete the booking.
6. As the **customer**: go to *My Appointments* to see status updates or cancel.

## Project Structure

```
appointment-booking-system/
├── backend/
│   ├── config/db.js
│   ├── controllers/        (auth, service, availability, appointment)
│   ├── middleware/          (JWT auth + role authorization, error handler)
│   ├── models/              (User, Service, Availability, Appointment)
│   ├── routes/
│   ├── .env.example       (copy to .env; .env itself is git-ignored)
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/app/
    │   ├── components/      (all pages, standalone Angular components)
    │   ├── services/        (HTTP clients: auth, service, availability, appointment)
    │   ├── guards/           (route guards: auth/customer/provider/guest)
    │   ├── interceptors/     (JWT attach + 401 handling)
    │   └── models/           (TypeScript interfaces)
    └── package.json
```

## Notes

- `node_modules`, `.env`, `dist/` and `.angular/` are not part of the submission; run `npm install` in both folders after cloning/extracting.
- Passwords are hashed with bcrypt; plain text is never stored.
- JWT is stored in `localStorage` on the frontend (acceptable for a college project).
- Booking is race-condition safe: the slot is atomically marked `isBooked` before the appointment is created, so two customers cannot book the same slot.
- No payment gateway, chat, notifications, admin panel, or other out-of-scope features were added, per the project spec.
