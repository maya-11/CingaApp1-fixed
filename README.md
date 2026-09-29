# Cingaphambile — Project Management Mobile App

A React Native (Expo) app that brings a project's scattered information — tasks, updates, budget, payments and messages — into one place for both **project managers** and their **clients**.

The REST API behind it lives in [cinga-backend](https://github.com/maya-11/cinga-backend).

<!-- Add 3–4 phone screenshots here: welcome/role selection, manager dashboard, client project view, payments -->

## Tech stack

- **React Native 0.81 + Expo 54**, **TypeScript**
- **React Navigation** (native stack, drawer, material top tabs)
- **Firebase Authentication** (email/password, password reset)
- **Axios** client for the Express + MySQL backend

## Features

**Managers**
- Dashboard of their projects with progress and status
- Create and edit projects, assign clients
- Task management and budget tracking
- Notifications on project activity

**Clients**
- Dashboard of the projects they're part of
- Project detail with tabs for **Overview**, **Tasks**, **Updates** and **Chat**
- Payment tracking per project
- Feedback and support screen

**Shared**
- Sign up, log in, forgot password, and role selection (manager or client)
- Auth state kept in a React context and shared across the app

## Project structure

```
src/
  contexts/     AuthContext (Firebase auth state)
  navigation/   stack and tab navigators
  screens/      manager screens, client/ screens, client/projectTabs/
  services/     API client, Firebase, manager and user services
  theme/        shared colours and styles
  types/        TypeScript types
```

## Running locally

```bash
npm install
npx expo start
```

Open it with Expo Go on your phone, or an Android/iOS emulator. The backend must be running and reachable from your device (see `src/utils/constants.ts` for the API URL).

## Status

University team project (2025).
