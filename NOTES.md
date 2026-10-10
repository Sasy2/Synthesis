# GPA Goal Calculator Study Notes

## 1. File Structure & Connectivity
- **index.html**: The Home page. It explains how the calculator works and what the user will find out. It connects to the Calculator page via a "Start calculating" button and contains the shared navigation bar.
- **grading-scale.html**: The Grading Scale page. It displays the Ashesi grading scale and explains the math behind calculating a credit-weighted CGPA.
- **calculator.html**: The main Calculator page. It contains the form inputs and empty placeholder sections for displaying results and errors. It loads `calculator.js` at the very end of its `<body>` to ensure the DOM is ready before the script runs.
- **style.css**: The shared stylesheet linked in the `<head>` of all three HTML files. It defines the layout, Ashesi colors, typography, and mobile-first responsiveness.
- **calculator.js**: The JavaScript logic, linked only from `calculator.html`. It handles all math, validates inputs, dynamically manipulates the DOM to show results, and wires up button click events.

## 2. JavaScript Functions Traced

### `roundTo2(number)`
- **What it does:** Fixes floating-point precision issues by rounding numbers exactly to two decimal places.
- **Inputs:** `number` (the raw decimal).
- **Outputs:** A number rounded to 2 decimal places.
- **Trace Example:** `roundTo2(3.14159)` -> `3.14159.toFixed(2)` yields `"3.14"` (string) -> `parseFloat("3.14")` returns `3.14` (number).

### `calculateRequiredAverage(currentGpa, creditsCompleted, creditsRemaining, targetGpa)`
- **What it does:** Calculates the exact average grade point needed on all remaining credits to hit the target CGPA.
- **Inputs:** `currentGpa`, `creditsCompleted`, `creditsRemaining`, `targetGpa`.
- **Outputs:** The required average on remaining credits.
- **Trace Example:** `(3.0, 20, 15, 3.3)`
  - `pointsSoFar` = 3.0 * 20 = 60
  - `totalCredits` = 20 + 15 = 35
  - `pointsNeeded` = 3.3 * 35 = 115.5
  - `pointsStillNeeded` = 115.5 - 60 = 55.5
  - return `roundTo2(55.5 / 15)` = 3.70

### `calculateHighestPossible(currentGpa, creditsCompleted, creditsRemaining)`
- **What it does:** Calculates the highest possible CGPA a student can achieve if they score straight A's (4.0) on all remaining credits.
- **Inputs:** `currentGpa`, `creditsCompleted`, `creditsRemaining`.
- **Outputs:** The highest achievable CGPA.
- **Trace Example:** `(3.0, 30, 10)`
  - `totalCredits` = 30 + 10 = 40
  - return `roundTo2((3.0 * 30 + 4.0 * 10) / 40)` = `roundTo2((90 + 40) / 40)` = 3.25

### `getVerdict(requiredAverage)`
- **What it does:** Determines if the mathematical target is achievable, impossible, or already secured.
- **Inputs:** `requiredAverage`.
- **Outputs:** `"notAchievable"`, `"secured"`, or `"achievable"`.
- **Trace Example:** `(5.00)`
  - `5.00 > 4.0` is true, returns `"notAchievable"`.

### `findLetterGrade(requiredAverage)`
- **What it does:** Finds the lowest letter grade that provides enough grade points to hit the required average.
- **Inputs:** `requiredAverage`.
- **Outputs:** The grade object from `GRADE_SCALE`.
- **Trace Example:** `(3.20)`
  - Loops array. Reaches `B` (3.0): 3.0 < 3.20 (false).
  - Reaches `B+` (3.5): 3.5 >= 3.20 (true). Returns `{ letter: "B+", points: 3.5, ... }`.

### `findCombinations(creditsRemaining, requiredAverage)`
- **What it does:** Uses nested loops to generate up to 5 valid combinations of A, B+, and B grades that reach the required average.
- **Inputs:** `creditsRemaining`, `requiredAverage`.
- **Outputs:** Array of combination objects.
- **Trace Example:** (See section 3 below).

### `validateInputs(...)`
- **What it does:** Validates all inputs to ensure they aren't empty and meet boundaries.
- **Inputs:** The four form numbers.
- **Outputs:** Array of error strings.
- **Trace Example:** `(3.0, 20, 2.3, 3.3)`
  - `creditsRemaining` (2.3) fails `(2.3 * 2) % 1 !== 0` check. Pushes "Credits must be in steps of 0.5."

### Display Functions (`clearOutput`, `showErrors`, `showResults`, `showCombinations`)
- **What they do:** Create HTML elements dynamically, inject text content, and append them to the DOM. They take the outputs from calculation functions as inputs and yield no return value, only side effects on the webpage.

### Event Wiring (`handleCalculate`, `handleReset`)
- **What they do:** Tie the logic together by reading DOM inputs, calling calculations inside `try...catch`, and invoking the display functions. Attached via `addEventListener`.

## 3. Nested Loops Trace (findCombinations)
**Scenario:** `creditsRemaining = 1` and `requiredAverage = 3.50`.
- `totalHalves` = 1 * 2 = 2.
- **Outer loop `aHalves` = 0**:
  - **Inner loop `bPlusHalves` = 0**: `bHalves` = 2 - 0 - 0 = 2. Average: `(0*4 + 0*3.5 + 2*3.0)/2 = 3.0`. `3.0 >= 3.5`? False.
  - **Inner loop `bPlusHalves` = 1**: `bHalves` = 2 - 0 - 1 = 1. Average: `(0*4 + 1*3.5 + 1*3.0)/2 = 3.25`. `3.25 >= 3.5`? False.
  - **Inner loop `bPlusHalves` = 2**: `bHalves` = 2 - 0 - 2 = 0. Average: `(0*4 + 2*3.5 + 0*3.0)/2 = 3.5`. `3.5 >= 3.5`? **True. Pushed!**
- **Outer loop `aHalves` = 1**:
  - **Inner loop `bPlusHalves` = 0**: `bHalves` = 2 - 1 - 0 = 1. Average: `(1*4 + 0*3.5 + 1*3.0)/2 = 3.5`. `3.5 >= 3.5`? **True. Pushed!**
  - **Inner loop `bPlusHalves` = 1**: `bHalves` = 2 - 1 - 1 = 0. Average: `(1*4 + 1*3.5 + 0*3.0)/2 = 3.75`. `3.75 >= 3.5`? **True. Pushed!**
- **Outer loop `aHalves` = 2**:
  - **Inner loop `bPlusHalves` = 0**: `bHalves` = 2 - 2 - 0 = 0. Average: `(2*4 + 0*3.5 + 0*3.0)/2 = 4.0`. `4.0 >= 3.5`? **True. Pushed!**

## 4. Test Cases

| # | Current | Completed | Remaining | Target | Actual Results |
|---|---|---|---|---|---|
| 1 | 3.0 | 20 | 15 | 3.3 | required 3.70, achievable, letter A or A+ (aim for at least 80%) |
| 2 | 3.5 | 30 | 10 | 3.6 | required 3.90, achievable, letter A or A+ (aim for at least 80%) |
| 3 | 3.0 | 30 | 10 | 3.5 | required 5.00, not achievable, highest possible 3.25 |
| 4 | 3.8 | 30 | 5 | 3.0 | required -1.80, already secured |
| 5 | 2.0 | 0 | 10 | 3.5 | required 3.50, achievable, letter B+ (aim for at least 75%) |
| 6 | 3.0 | 20 | 20 | 3.5 | required 4.00, achievable (aim for at least 80%) |
| 7 | 3.0 | 20 | 15 | 4.5 | Validation error: Target CGPA must be between 0 and 4. |
| 8 | 3.0 | 20 | 2.3 | 3.3 | Validation error: Credits must be in steps of 0.5. |
| 9 | (empty) | 20 | 15 | 3.3 | Validation error: Please enter a valid number in all fields. |

## 5. Exam Preparation: 10 Likely Questions & Answers

1. **Q: Why do we place the `<script>` tag at the very end of the `<body>`?**
   **A:** To ensure that all the HTML DOM elements (like inputs and buttons) are fully loaded and accessible before the JavaScript attempts to attach event listeners or read them using `document.getElementById`.

2. **Q: How does `document.createElement` differ from setting `innerHTML`?**
   **A:** `document.createElement` creates a single DOM node safely in memory, which you must manually attach using `appendChild`. Setting `innerHTML` parses an entire string of HTML, which is faster for simple text but can be prone to bugs or performance drops if misused heavily.

3. **Q: What does the `parseFloat()` function do when reading the form inputs?**
   **A:** Form inputs naturally return data as strings. `parseFloat()` explicitly converts these string values into decimal numbers so we can do accurate math without triggering accidental string concatenation (e.g. "2" + "2" = "22").

4. **Q: Why did we need to multiply credits by 2 in `findCombinations` before looping?**
   **A:** Because Ashesi credits exist in 0.5 steps (half-credits). `for` loops iterate most reliably on whole numbers (integers). By multiplying by 2, a 0.5 credit becomes a 1 (one half-credit), allowing the loop counter to iterate safely without missing steps.

5. **Q: Explain what the modulus operator (`%`) does in `(creditsRemaining * 2) % 1 !== 0`.**
   **A:** The modulus operator returns the remainder of a division. By taking a number, multiplying it by 2, and checking if the remainder divided by 1 is NOT 0, we definitively prove if the original number had a decimal other than exactly .0 or .5.

6. **Q: What is a "pure function", and give an example from our code?**
   **A:** A pure function is a function that produces no side effects (like modifying the DOM) and depends entirely on its inputs to return a value. `calculateRequiredAverage` is a pure function.

7. **Q: Why use a `try...catch` block in the main `handleCalculate` function?**
   **A:** It serves as a safety net. If any unexpected runtime error occurs during calculations, the `catch` block prevents the script from crashing silently and instead provides a friendly error message to the user.

8. **Q: Why did we use `box-sizing: border-box` in the CSS?**
   **A:** It forces the browser to include padding and borders within the element's specified width and height. This makes layout mathematics much easier, preventing elements from unexpectedly overflowing their containers when padding is added.

9. **Q: How does the CSS media query `@media (min-width: 48rem)` enforce a mobile-first design?**
   **A:** "Mobile-first" means the default styling outside the media query is for small screens (single column). The `@media (min-width: 48rem)` rule applies its styles (like `grid-template-columns: 1fr 1fr`) *only* when the screen is 48rem or wider, progressively enhancing the layout for larger devices rather than degrading it for smaller ones.

10. **Q: Explain the `stopLoops` flag logic inside the nested loops.**
    **A:** A standard `break` statement only exits the innermost loop it is placed in. By setting a boolean `stopLoops = true` before breaking the inner loop, and adding `if (stopLoops) { break; }` to the outer loop, we forcefully exit both nested loops simultaneously once we reach our maximum of 5 combinations.
