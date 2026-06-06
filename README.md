👑 Queen Ascent
Queen Ascent is a classic N × N chessboard backtracking visualizer designed to help you understand how the N-Queens problem is solved step by step using recursion and backtracking.
This project focuses on learning through visualization, making it easier to understand how the algorithm explores, places, and backtracks while trying to find valid configurations.

📸 Screenshot

![Queen Ascent](./assets/overview-of-n-queen.png)

🧠 About the Problem
The N-Queens problem is a classic backtracking challenge where the goal is to place N queens on an N × N chessboard such that no two queens attack each other.
A queen can attack in:
- Horizontal direction
- Vertical direction
- Diagonal direction
The objective is to place all queens safely without conflicts.

🔁 Backtracking Algorithm (N-Queens)
The solution is based on recursive backtracking:
1. Start from the first row.
2. Try placing a queen in each column of the row.
3. For each position, check if it is safe.
4. If safe:
   - Place the queen
   - Move to the next row
5. If no valid position exists in a row:
   - Backtrack (remove the previously placed queen)
   - Try the next possible position
6. Repeat until all queens are placed or all possibilities are exhausted.

📊 Complexity
- Time Complexity: O(N!)
- Space Complexity: O(N) (recursion stack)

🚀 About Queen Ascent
Queen Ascent provides a real-time visualization of the backtracking process with interactive controls and system metrics to enhance learning.

📊 System Metrics
During execution, the app displays real-time metrics:
- Number of attempts
- Number of backtracks
- Current active row
- Number of solutions found
These metrics help you understand how the algorithm is performing internally.

🎮 Features
- Custom N × N board generation
- Manual board size input
- Animated queen placement and removal
- Step-by-step execution control
- Pause, Resume, and Reset options
- Speed control for learning:
  - Slow
  - Medium
  - Fast
- Step button for controlled exploration (one move at a time)
- Real time visualization of backtracking process

⚙️ How to Use
1. Enter the board size (N)
2. Click Generate Board
3. Click Solve to start visualization
4. Use controls to interact:
   - Pause the process anytime
   - Resume execution
   - Reset board
   - Step through each placement manually
5. Adjust speed based on your learning preference

🛠 Tech Stack
- React
- TypeScript
- Vite
- Tailwind CSS
  
🎯 Learning Outcome
This project helps you visually understand:
- Backtracking algorithms
- Recursive problem solving
- Constraint satisfaction problems
- Decision tree exploration
- How algorithms explore and undo decisions
  
👑 Project Goal
The goal of Queen Ascent is to make abstract recursion and backtracking concepts intuitive by turning them into a visual, interactive learning experience.
