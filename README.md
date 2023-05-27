# NUS-Orbital-2023 
GitHub repository for NUS CP2106: Independent Software Development Project

# 1. Introduction

**Proposed Level of Achievement:**

Project Gemini

**Aim**

LifeQuest aims to be the ultimate gamified productivity app, turning daily routines into an adventure-filled path towards achieving goals and living a more fulfilling life.


**Our Motivation**

Our motivation for developing this app stems from a personal desire to improve our own daily routine and establish better habits. We believe that many people struggle with finding the motivation and discipline to stick to their goals, and that a gamified approach can provide the necessary incentives to make positive changes.

Our personal experiences with these issues have inspired us to create an app that offers a fun, engaging, and rewarding way to tackle them. By combining game mechanics with productivity tools, our app will help users set goals, track progress, and stay focused on what matters most. We hope that by providing a comprehensive approach to productivity, our app can help users achieve their full potential and lead more fulfilling lives.


**Our Vision**

Our vision for this project is to create a leading gamified productivity app that empowers individuals to achieve their goals and live their best lives. We believe that by harnessing the power of game mechanics and social support, we can create an app that is both fun and effective in improving productivity and overall well-being.

Our app will offer a variety of features, focusing on key areas such as focus and self-improvement, we aim to provide a comprehensive solution to productivity that is both practical and engaging. We envision a future where our app is the go-to solution for individuals who want to become more productive and efficient in their daily lives. By continuously improving and updating our app based on user feedback and the latest research, we hope to stay at the forefront of the gamified productivity market and make a meaningful impact on people's lives.


# 2. Setting Up

## Setting up the project on local machine
### Prerequisites:
- An IDE, eg. Visual Studio Code
- Python 3.7
- pip (Python package installer) available for download :https://pip.pypa.io/en/stable/installing/
- Node.js(for npm package manager) download at: https://nodejs.org/en/

### Setting up Project:
- Clone repository from https://github.com/RyanTDL/NUS-Orbital-2023.git
- Open the project in IDE(VSCode)
- Open new terminal and 

# 3. User Stories
**Core User Stories**
1. As a student, I want to embrace a healthy lifestyle that prioritises sleep,exercise and studying, allowing me to balance my responsibilities without sacrificing my well-being.
2. As a student who lacks enthusiasm for studying, I want to be able to make completing my assignments feel more rewarding and satisfying.
3. As a student, I want to be able to keep track of my progress to ensure I am not neglecting any important elements of my personal growth and development.
4. As an unmotivated individual, I want some healthy competition that drives me to put more effort into being productive and living a balanced lifestyle.


**Extensions**

5. As an individual who lacks the motivation to use tracking apps over a long period of time,I want to be incentivised and encouraged to use the app.
6. As a player in the game, I want to be able to personalise and customise my character/profile to enhance the overall gaming/user experience.
7. As a user who enjoys social interaction, I want to be included in a community where I can connect with like-minded individuals, share progress, and provide support and encouragement.
8. As a long-term user, I want a convenient app that can seamlessly integrate with smart devices, collecting data effortlessly as I go about my daily life.
9. As a player, seeking continuous engagement, I want LifeQuest to regularly introduce new challenges, quests, or activities to keep me motivated and invested in the app.


# 4. Components
## 4.1 Main Components
Over mobile app's frontend is made up of these main componenets:

- Signing up Page
- Signing in Page
- Home Page
- Daily Log
- Weekly Activity
- Friends List


## 4.2 Features
A **iOS mobile app** that supports 3 main features. The user will be able to input and store data on their duration of sleep, number of steps taken, duration of exercise and the time spent studying in order to upgrade their respective stats. 

**Outlined below is how the battle system will be implemented, as well as how the avatar’s character stats come into play:**
- Strength: Determines how much damage is done during each attack
- Agility: Determines the order of attack. The character with a higher agility stat will attack first
- Stamina: Determines the maximum starting health of the character
- Intellect: Determines the likelihood of an attack dealing critical damage. Critical damage deals 1.5x the damage of a normal attack

Secondly, users will be able to visualise how their daily habits change over time through the use of a line graph.

Lastly, the user will be able to find and add a specific player based on their player ID as a friend and challenge/battle their friends to earn some medals. 

**(The battle system, mechanics and animations will also be implemented in later stages.)**

### 4.2.1 Features implemented in Milestone 1

a. Login to account
- New User Sign Up
- Log in 
- Log out?

b. User Profile
- User information
  - Displays user's name and email address?
- Upgrading of Character
  - When the user updates the their progress under the daily log, the character’s progress bars will automatically re-render and update


# 5. Architecture
## 5.1 Design Diagrams
### Entity diagram

### UX Flowchart

## 5.2 Processess
### 1. Tech Stack

Frontend User Interface (Client side):
- HTML/CSS/Javascript (Languages)
- React Native

Backend (Server side):
- Firebase

Version control:
- Git & GitHub
