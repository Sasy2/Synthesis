# Ashesi Degree Audit Study Notes

## 1. File Structure
- **index.html**: The Home page. Provides a high-level overview of the audit tool, instructions on how to use it, and what results to expect.
- **grading-scale.html**: The rules page. Shows the official Ashesi grading system, explains minimum grade requirements, credit load limits, and how CGPA is mathematically calculated.
- **audit.html**: The main application page. Contains the empty `#checklist` container for the dynamic form, the semesters and target GPA inputs, and buttons to calculate or clear. Includes `audit.js` at the bottom of the body.
- **style.css**: Shared stylesheet providing layout, the Ashesi colour scheme (maroon, white, light grey, dark grey), and responsive design using a mobile-first approach (CSS Grid for larger screens).
- **audit.js**: The core logic file. Contains all degree data, pure helper functions for calculations, and DOM manipulation functions to build the checklist and display dynamic results.

## 2. Function Trace & Details

### `roundTo2(number)`
- **What it does:** Rounds a number to exactly two decimal places to avoid floating-point math errors.
- **Inputs:** `number` (decimal)
- **Outputs:** Number rounded to 2 decimal places.
- **Trace Example:** `roundTo2(3.14159)` -> `3.14159.toFixed(2)` yields `"3.14"` (string) -> `parseFloat("3.14")` -> returns `3.14`.

### `getGradePoints(letter)`
- **What it does:** Looks up the numeric grade points for a given letter grade.
- **Inputs:** `letter` (e.g. "B+")
- **Outputs:** Grade points (e.g. 3.5), or 0 if not found.
- **Trace Example:** `getGradePoints("C+")` -> loop finds `{ letter: "C+", points: 2.5 }` -> returns `2.5`.

### `getSelectedGrade(index)`
- **What it does:** Reads the `<select>` element for a specific course and returns the chosen grade.
- **Inputs:** `index` (index of course in `COURSES` array)
- **Outputs:** The selected string value ("A", "P", or "").
- **Trace Example:** `getSelectedGrade(0)` -> gets element `"grade0"` -> returns `"B"`.

### `hasPassed(index)`
- **What it does:** Evaluates if the selected grade meets or exceeds the required minimum grade for the course.
- **Inputs:** `index` (course index)
- **Outputs:** `true` if passed, `false` otherwise.
- **Trace Example:** `hasPassed(0)` (Written Comm, min "C", selected "B"). `getGradePoints("B")` is 3.0. `getGradePoints("C")` is 2.0. `3.0 >= 2.0` -> returns `true`.

### `mustRetake(index)`
- **What it does:** Identifies courses that have been taken but failed.
- **Inputs:** `index` (course index)
- **Outputs:** `true` if grade exists but `hasPassed` is false.
- **Trace Example:** `mustRetake(0)` (selected "D", min "C"). `getSelectedGrade` returns "D" (!== ""). `hasPassed(0)` returns false. Returns `true`.

### `getTotalCredits()`, `getCreditsCompleted()`, `getCategoryRequired(category)`, `getCategoryCompleted(category)`
- **What they do:** Standard array loops that accumulate course credit values based on conditions (e.g., if `hasPassed` is true, or if the category matches).
- **Inputs:** Category name (for category functions), none (for total functions).
- **Outputs:** Number representing sum of credits.
- **Trace Example:** `getCategoryRequired("Research")` -> loops through COURSES, matches "Research Methods" -> adds 1 -> returns `1`.

### `calculateCurrentCgpa()`
- **What it does:** Calculates the credit-weighted average for all taken courses.
- **Inputs:** None.
- **Outputs:** Current CGPA (number).
- **Trace Example:** Passed Calculus 1 (1 credit, "B" -> 3.0 points). Passed Success Seminar (0 credits, "P").
  - Loop 1 (Calc): 1 * 3.0 = 3.0. Attempted = 1.
  - Loop 2 (Seminar): Ignored because `grade === "P"` and `credits === 0`.
  - returns `3.0 / 1` = `3.00`.

### `getSemestersNeeded(creditsLeft)`
- **What it does:** Calculates the minimum semesters required to clear remaining credits (max 4.5 per semester).
- **Inputs:** `creditsLeft` (number).
- **Outputs:** Semesters count (number).
- **Trace Example:** (See section 4 below).

### `buildSemesterPlan(creditsLeft, semestersLeft)`
- **What it does:** Generates an array showing how to distribute remaining credits across remaining semesters.
- **Inputs:** `creditsLeft`, `semestersLeft`
- **Outputs:** Array of floats.
- **Trace Example:** `buildSemesterPlan(10, 3)` -> `[4.5, 4.5, 1.0]`.

### `calculateRequiredAverage` & `calculateHighestPossible`
- **What they do:** Uses the standard GPA formula to find required grade point averages based on points earned vs points available.
- **Inputs:** Current GPA, completed credits, remaining credits, target GPA.
- **Outputs:** Number representing required or maximum CGPA.

### `findTargetLetterGrade(requiredAverage)`
- **What it does:** Works backwards through the `GRADE_SCALE` array to find the lowest letter grade that provides enough points to meet the required average.
- **Inputs:** `requiredAverage` (number).
- **Outputs:** Grade object (e.g. `{ letter: "B+", points: 3.5 }`).
- **Trace Example:** `findTargetLetterGrade(3.20)` -> loops backwards from E/F, finding that `B+` (3.5) is the first grade where points >= 3.20. Returns the `B+` object.

### `buildChecklist`, `showAuditResults`, `clearAll`, `showGpaResults`
- **What they do:** DOM manipulation functions. `buildChecklist` dynamically generates the forms using nested loops. `showAuditResults` calculates status and builds output paragraphs and tables. `clearAll` zeroes everything out.

## 3. Nested Loops in `buildChecklist`
The `buildChecklist` function groups the checklist by category. It uses nested loops to achieve this:
1. **Outer Loop**: Iterates through the `CATEGORIES` array. For each category, it creates a new `<fieldset>` and `<legend>`.
2. **Inner Loop**: Iterates over the entire `COURSES` array. If the current course's `category` matches the outer loop's category, it creates a label and a `<select>` dropdown, populating the options from `GRADE_SCALE`, and appends them to the category's `<fieldset>`.

## 4. While Loop in `getSemestersNeeded`
**Scenario**: `creditsLeft = 10`. Max credits per semester = 4.5.
- Loop Initialization: `semestersCount = 0`, `remaining = 10`.
- **Iteration 1**: `10 > 0` is true. `remaining = 10 - 4.5 = 5.5`. `semestersCount = 1`.
- **Iteration 2**: `5.5 > 0` is true. `remaining = 5.5 - 4.5 = 1.0`. `semestersCount = 2`.
- **Iteration 3**: `1.0 > 0` is true. `remaining = 1.0 - 4.5 = -3.5`. `semestersCount = 3`.
- **Iteration 4**: `-3.5 > 0` is false. Loop ends.
- **Result**: Returns `3` semesters.

## 5. How `hasPassed` Compares Grades
The function uses a hierarchical check:
1. If the selected grade is empty `""`, the course hasn't been taken (`return false`).
2. If the minimum required grade is exactly `"P"`, it completely ignores grade points and simply checks if the user selected `"P"` (`return true` if yes, `false` otherwise).
3. For all standard letter grades, it converts both the user's selected letter and the course's minimum letter into numerical points via `getGradePoints(letter)`. It then simply evaluates `if (selectedPoints >= minPoints)` to return true or false.

## 6. Test Cases Results

| # | Scenario | Expected | Actual Results Achieved |
|---|---|---|---|
| 1 | No grades, semesters completed 4 | Cannot graduate on time, needs 8 semesters (4 extra) | Validated exactly. "You cannot graduate on time... You need about 8 semesters, which is 4 extra semester(s)." |
| 2 | All courses A, semesters 8 | All credits completed, can graduate | Validated exactly. "You have completed all your courses. You can graduate." |
| 3 | Written & Oral Comm D (min C) | Listed under retakes, points count in CGPA but not in completed | Validated. Completed credits remain unchanged. Course listed in retake list. CGPA includes the 1.0 points. |
| 4 | Ashesi Success Seminar set to P | Passed, 0 credits, excluded from CGPA | Validated. Completed credits untouched, CGPA unaffected, marked as passed. |
| 5 | 18 credits passed, semesters 4 | 17 left over 4 sems, on track. Plan: `[4.5, 4.5, 4.5, 3.5]` | Validated exactly. Plan lists Semesters 5 through 8 with exact credit values. |
| 6 | 10 credits passed, semesters 6 | 25 left over 2 sems, cannot graduate; needs 6 sems (4 extra) | Validated exactly. "You need about 6 semesters, which is 4 extra semester(s)." |
| 7 | Semesters completed = 9 or empty | Error message | Validated. Red text error blocks execution. |
| 8 | Target CGPA 4.5 | Validation error | Validated. Red text error blocks execution. |

## 7. Exam Preparation: 10 Likely Questions & Answers

1. **Q: Why is `parseInt()` necessary when reading the semesters completed input?**
   **A:** The `.value` property of an HTML input always returns a string, even if the input `type` is "number". `parseInt(..., 10)` securely converts it into an integer so it can be safely used in math equations without risking string concatenation errors.

2. **Q: Explain why `parseFloat()` is used in `roundTo2`.**
   **A:** The `toFixed(2)` method rounds a number, but it outputs a string (e.g. `"3.50"`). Wrapping it in `parseFloat()` turns it back into a true numeric data type so it can continue to be evaluated mathematically.

3. **Q: In `showAuditResults`, why do we set `resultsDiv.innerHTML = ""` at the start?**
   **A:** To clear out any previous results. If the user clicks "Check my progress" multiple times, failing to clear the container first would result in the new text repeatedly stacking beneath the old text indefinitely.

4. **Q: What is the purpose of the `for` loop in `getGradePoints`?**
   **A:** It iterates linearly through the `GRADE_SCALE` array, comparing the requested letter grade against each object's `letter` property. Once a match is found, it immediately returns the corresponding `points` property, avoiding the need for a massive block of `if...else` statements.

5. **Q: Why did we use `document.createElement("select")` instead of hardcoding HTML strings?**
   **A:** Building DOM nodes via `createElement` is cleaner, safer from injection, and allows us to easily dynamically attach event listeners or property values inside loops without complex string manipulations.

6. **Q: Explain the `hasPassed` logic for the Ashesi Success Seminar.**
   **A:** The seminar requires a "P" (Pass). Our logic specifically intercepts any course whose `minGrade === "P"`, completely bypassing the standard numeric grade points check to prevent errors since "P" does not exist in the numerical `GRADE_SCALE`.

7. **Q: How does `mustRetake` prevent marking un-taken courses as failed?**
   **A:** It first checks `if (selectedGrade !== "")`. Only if a grade has actively been chosen does it proceed to check `hasPassed(index) === false`.

8. **Q: Why is CSS `box-sizing: border-box` important for form layout?**
   **A:** It forces the browser to calculate padding and borders within the total width of the element. Without it, inputs might overflow their fieldsets or break the CSS grid layout.

9. **Q: What is a "pure function", and give an example from our code.**
   **A:** A pure function takes inputs and returns an output without modifying external state (like the DOM). `getSemestersNeeded` is pure. `showAuditResults` is not, because it manipulates the DOM.

10. **Q: How does the CSS media query `@media (min-width: 48rem)` change the layout on desktop?**
    **A:** It acts as a breakpoint. By default, the `#checklist` is a flex column (stacking). Once the viewport hits 48rem (approx 768px), the media query triggers, switching `#checklist` to a CSS Grid with `grid-template-columns: 1fr 1fr`, creating a two-column layout.
