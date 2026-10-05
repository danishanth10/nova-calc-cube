# Aura Calculator

Build a modern, premium-looking 3D Calculator mobile application using the following technology stack:

Technology Stack

Frontend: React Native + Expo

Styling: Tailwind CSS using NativeWind

Backend: Node.js + Express.js

Database: MongoDB

Additional backend/calculation services: Python

API communication: REST API

Use JavaScript/TypeScript with clean and modular architecture.

Main Goal

Create a beautiful, responsive and interactive 3D Calculator App for mobile devices.

The application should look like a premium futuristic calculator, not like a basic calculator.

UI / UX Design

Create a dark futuristic UI with:

3D calculator buttons

Glassmorphism effects

Soft shadows

Depth and elevation

Smooth button press animations

Subtle 3D rotation/scale effects

Rounded corners

Modern typography

Smooth transitions

Responsive layout for different phone screen sizes

The calculator should feel like a real physical 3D calculator.

Calculator Screen

At the top:

Large calculation/result display

Show the current expression

Show the final result

Allow long expressions with horizontal scrolling

Add a clear button

Add backspace/delete functionality

Calculator buttons should include:

Numbers:
0, 1, 2, 3, 4, 5, 6, 7, 8, 9

Operators:




+

×




÷




%

.
+/-

Scientific functions:
sin
cos
tan
log
ln
√
x²
xʸ
π
e
factorial (!)
brackets ( )

Use proper mathematical precedence.

Example:
2 + 5 × 3
should return 17, not 21.

3D Interaction

Make the calculator visually 3D.

When a user presses a button:

Button should move slightly downward

Add scale animation

Add shadow/depth effect

Provide haptic feedback if supported

Smoothly return to its original position

Add subtle 3D tilt/parallax effects where appropriate, but do not make the UI difficult to use.

Calculator Modes

Include two modes:

Basic Calculator

Scientific Calculator

Add a toggle or swipe interaction to switch between them.

Calculation History

Create a History screen.

Store:

Expression

Result

Date/time

Example:

2 + 5 × 3 = 17

Users should be able to:

View previous calculations

Delete individual history items

Clear all history

Tap a previous calculation to reuse it

Backend

Create a Node.js + Express backend.

Create REST APIs for:

Saving calculation history

Getting calculation history

Deleting a calculation

Clearing calculation history

Use MongoDB for persistent storage.

Create a clean database model such as:

CalculationHistory:

id

expression

result

createdAt

Python Service

Create a separate Python calculation service using FastAPI.

The Python service should handle advanced mathematical calculations such as:

Scientific calculations

Trigonometry

Logarithms

Powers

Square roots

Factorials

Complex expressions

The Node.js backend can communicate with the Python FastAPI service when advanced calculations are required.

Make sure errors from the Python service are handled properly.

API Structure

Use a structure similar to:

POST /api/calculate
GET /api/history
DELETE /api/history/:id
DELETE /api/history

Python service:

POST /calculate

Do not expose MongoDB credentials or API secrets in frontend code.

Use environment variables for:

MongoDB URI

Backend URL

Python service URL

Other secrets

Navigation

Create:

Calculator

Scientific Calculator

History

Settings

Use a clean bottom navigation bar.

Settings

Create a Settings screen with:

Dark/Light theme

Haptic feedback ON/OFF

Sound ON/OFF

Clear calculation history

About the app

App version

Error Handling

Handle:

Division by zero

Invalid expressions

Invalid mathematical operations

Empty expressions

Very large numbers

Network errors

Backend errors

Python calculation service errors

Show friendly error messages instead of crashing.

Performance

The application should:

Load quickly

Have smooth animations

Avoid unnecessary API requests

Use reusable components

Keep calculation logic modular

Work smoothly on mid-range Android devices

Project Structure

Create a clean project structure similar to:

/mobile
/components
/screens
/navigation
/services
/utils
/hooks
/assets

/backend
/controllers
/routes
/models
/services
/middleware
server.js

/python-service
main.py
/services
/utils

Important

Do NOT create a simple flat calculator.

The main focus is a premium 3D mobile calculator experience.

Use reusable components and clean code.

Make the UI production-quality.

Make sure the calculator actually works, not just a visual mockup.

Implement the frontend, Node.js backend, MongoDB integration and Python FastAPI calculation service.

Also provide clear instructions for:

Installing dependencies

Setting environment variables

Starting React Native/Expo

Starting Node.js backend

Starting Python FastAPI service

Connecting MongoDB

Testing the complete application

Before finishing, test the main calculator operations and make sure there are no broken buttons, navigation errors, API errors or console errors.


## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
