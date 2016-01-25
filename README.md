Performer
=========

##What it does
Performer takes any MIDI file and determines the best piano fingering to use for that particular song. It then visualizes two virtual hands performing the piece in 3D.

##How it works
- Performer has sophisticated cost algorithms to determine the "price" of any of the ~200k piano movement options. That is, it answers the question, "What does it 'cost' to move from note A with finger X to note B with finger Y."

- When a MIDI file is uploaded, it parses the file to know what notes are in the song.

- It then uses **Viterbi's algorithm** to determine the lowest cost path among the trillions of possible fingering choices. Thanks to Viterbi's, this process runs in linear time as a function of the number of notes in a song.

- Once the path has been determined, the data is processed and used to orchestrate the 'fingers' moving in sync with the audio playback 

##The tech behind it
- **JavaScript** powered all the algorithms

- MIDI file parsing and playback is done with the help of a slightly modified version of the **MIDI.js** library

- **Three.js** in conjunction with **Tween.js** to create and animate the 3D hands and piano

- The backend was done doing using **Node**, **Express**, and **MongoDB**
