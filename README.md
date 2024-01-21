# Audi Recorder and Player

## Setup and Run

### Step 1: Browse to appropriate directory

For server side solution browse to `/node-audio-recorder/server-side-solution`

### Step 2: Install dependencies

Run command `npm i`

### Step 3: Run the application

Run command `npm run dev`

### Step 4: Open the application in the browser

Visit `http://localhost:3001` for client-side-solution, and/or visit `http://localhost:3009` for the server-side-solution

## How to Use

1. Click on the `Record` button. (Don't release it!) It will listen for the audio.
2. Say something to record.
3. Release the button. It will save the record in the file system (under /audioFiles directory) and play the audio.
4. Click `Play Audio` button if you want to listen to the latest recorded audio.

> [!NOTE] > [Sox](https://sourceforge.net/projects/sox/) must be installed in your system for the `server-side-solution` to work properly.
