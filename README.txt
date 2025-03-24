Tower of Hanoi - Interactive Game
A 3D interactive Tower of Hanoi game built with p5.js in JavaScript. The game supports drag-and-drop animations, a move counter, a timer, and a leaderboard to track the fastest completions!



Features
✅ Select Disk Count (3 to 7) before starting the game
✅ Drag & Drop Animation for moving disks
✅ Move Counter (only counts valid moves)
✅ Timer to track completion time
✅ Leaderboard (saves fastest times with name, moves, and disk count)
✅ 3D Visuals using WebGL in p5.js
✅ Confetti Animation on winning 🎉

Installation & Setup
Clone the Repository
Open index.html in a Browser

Run a local server (for best performance):


How to Play?
Enter your name & select the number of disks

Click "Start Game" to begin

Drag & Drop disks onto another rod

Follow the Tower of Hanoi rules:

A larger disk cannot be placed on a smaller disk

Move all disks to the last tower in the fewest moves possible

Win the game to enter the leaderboard!

📌 Project Structure

/tower-of-hanoi
│── index.html        # Main menu (name input & disk selection)
│── game.html         # Game window (Tower of Hanoi UI)
│── sketch.js         # Main game logic (p5.js)
│── styles.css        # Styling for UI
│── images/           # Wood textures & assets
│── README.md         # Project documentation

📊 Leaderboard System
Scores are saved in local storage

Tracks fastest times & least moves

View leaderboard anytime from index.html