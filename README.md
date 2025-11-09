# 🎬 Movie Booking System

A real-time movie seat booking application built with **MERN stack** and **Socket.IO**.  
Users can reserve, book, and cancel seats in real time. Expired reservations automatically release seats and notify the user.

**Note:** I have often faced an issue where i had selected some seats and had to exit the site due to some reason. But when i immediately go back to book same seats, they are shown as booked even to me. So i have implemented a feature that shows pending seat bookings so that you can pick up from where you left. Even directly selecting the movie will show the existing selections.

## Features: 
- Real-time seat selection and updates

- Seat reservation with automatic expiry

- Seats reserved by others are disabled and have different color than the seats that are already booked

- Private notification when your reserved seats expire

- Debounced api calls for reserving seats to avoid too many calls to the backend

### To run the project, use the following commands:

1. to install the dependencies:
```bash
npm i
```
or if you are using yarn :
```bash
yarn
```

2. to run the app:
```bash
npm start
```
or 

```bash
yarn start
```

The command runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.