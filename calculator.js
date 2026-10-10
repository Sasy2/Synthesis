// 7.1 Constants

const GRADE_SCALE = [
  { letter: "E/F", minPercent: 0, points: 0.0 },
  { letter: "D", minPercent: 50, points: 1.0 },
  { letter: "D+", minPercent: 55, points: 1.5 },
  { letter: "C", minPercent: 60, points: 2.0 },
  { letter: "C+", minPercent: 65, points: 2.5 },
  { letter: "B", minPercent: 70, points: 3.0 },
  { letter: "B+", minPercent: 75, points: 3.5 },
  { letter: "A or A+", minPercent: 80, points: 4.0 }
];

const MAX_POINTS = 4.0;
const MIN_POINTS = 0.0;
const MAX_COMBINATIONS = 5;


// 7.2 Helper

// Rounds a number to exactly two decimal places and returns it as a number.
// Parameters:
//   number (number): The number to round.
// Returns:
//   (number): The rounded number.
// Example:
//   roundTo2(3.14159) returns 3.14
function roundTo2(number) {
  return parseFloat(number.toFixed(2));
}


// 7.3 Calculation functions

// Calculates the average grade point needed on remaining credits to hit the target.
// Parameters:
//   currentGpa (number): The CGPA achieved so far.
//   creditsCompleted (number): Total credits completed so far.
//   creditsRemaining (number): Total credits left to take.
//   targetGpa (number): The CGPA the student wants to reach.
// Returns:
//   (number): The required average on the remaining credits.
// Example:
//   calculateRequiredAverage(3.0, 20, 15, 3.3) returns 3.70
function calculateRequiredAverage(currentGpa, creditsCompleted, creditsRemaining, targetGpa) {
  const pointsSoFar = currentGpa * creditsCompleted;
  const totalCredits = creditsCompleted + creditsRemaining;
  const pointsNeeded = targetGpa * totalCredits;
  const pointsStillNeeded = pointsNeeded - pointsSoFar;
  return roundTo2(pointsStillNeeded / creditsRemaining);
}

// Calculates the highest possible CGPA a student can get assuming they score 4.0 on all remaining credits.
// Parameters:
//   currentGpa (number): The CGPA achieved so far.
//   creditsCompleted (number): Total credits completed so far.
//   creditsRemaining (number): Total credits left to take.
// Returns:
//   (number): The maximum possible CGPA.
// Example:
//   calculateHighestPossible(3.0, 30, 10) returns 3.25
function calculateHighestPossible(currentGpa, creditsCompleted, creditsRemaining) {
  const totalCredits = creditsCompleted + creditsRemaining;
  return roundTo2((currentGpa * creditsCompleted + MAX_POINTS * creditsRemaining) / totalCredits);
}

// Determines if the required average is mathematically achievable, already secured, or impossible.
// Parameters:
//   requiredAverage (number): The average grade point needed on remaining credits.
// Returns:
//   (string): "notAchievable", "secured", or "achievable".
// Example:
//   getVerdict(3.70) returns "achievable"
//   getVerdict(4.20) returns "notAchievable"
function getVerdict(requiredAverage) {
  // Check if the required average is more than the maximum possible (4.0).
  // If it is, the student cannot reach the target even with perfect grades.
  if (requiredAverage > MAX_POINTS) {
    return "notAchievable";
  } 
  // Check if the required average is less than or equal to the minimum possible (0.0).
  // If it is, the student will reach the target even if they fail all remaining courses.
  else if (requiredAverage <= MIN_POINTS) {
    return "secured";
  } 
  // If neither of the above, the target is achievable with the right grades.
  else {
    return "achievable";
  }
}

// Finds the lowest letter grade on the scale that provides at least the required average.
// Parameters:
//   requiredAverage (number): The average grade point needed.
// Returns:
//   (object): The grade object from GRADE_SCALE.
// Example:
//   findLetterGrade(3.20) returns { letter: "B+", minPercent: 75, points: 3.5 }
function findLetterGrade(requiredAverage) {
  // Loop through the GRADE_SCALE array from index 0 to the end.
  // Because the scale is ordered from lowest to highest, the first grade we find
  // that meets or exceeds the required average is the minimum grade needed.
  for (let index = 0; index < GRADE_SCALE.length; index = index + 1) {
    if (GRADE_SCALE[index].points >= requiredAverage) {
      return GRADE_SCALE[index];
    }
  }
}

// Generates combinations of A, B+, and B grades that will meet or exceed the required average.
// Parameters:
//   creditsRemaining (number): Total credits left to take.
//   requiredAverage (number): The average grade point needed.
// Returns:
//   (array): An array of combination objects.
// Example:
//   findCombinations(1, 3.50) returns [{ aCredits: 0, bPlusCredits: 1, bCredits: 0, average: 3.5 }, { aCredits: 0.5, bPlusCredits: 0, bCredits: 0.5, average: 3.5 }]
function findCombinations(creditsRemaining, requiredAverage) {
  const combinations = [];
  const totalHalves = creditsRemaining * 2;
  
  // Flag to control when to stop the outer loop
  let stopLoops = false;

  // The outer loop iterates over the possible number of A grades (in half-credits).
  // It starts at 0 and goes up to the total remaining half-credits.
  for (let aHalves = 0; aHalves <= totalHalves; aHalves = aHalves + 1) {
    
    // Check if we already found the maximum number of combinations
    if (stopLoops) {
      break;
    }

    // The inner loop iterates over the possible number of B+ grades (in half-credits).
    // It starts at 0 and goes up to whatever half-credits are left after taking aHalves.
    for (let bPlusHalves = 0; bPlusHalves <= (totalHalves - aHalves); bPlusHalves = bPlusHalves + 1) {
      
      const bHalves = totalHalves - aHalves - bPlusHalves;
      const average = roundTo2((aHalves * 4.0 + bPlusHalves * 3.5 + bHalves * 3.0) / totalHalves);
      
      // If this combination of grades yields an average that is high enough, we save it.
      if (average >= requiredAverage) {
        combinations.push({
          aCredits: aHalves / 2,
          bPlusCredits: bPlusHalves / 2,
          bCredits: bHalves / 2,
          average: average
        });
      }
      
      // If we have reached the maximum allowed combinations, we set the flag to true
      // and break out of the inner loop immediately.
      if (combinations.length === MAX_COMBINATIONS) {
        stopLoops = true;
        break;
      }
    }
  }
  
  return combinations;
}

// ============================================================================
// 7.4 Validation
// ============================================================================

// Validates the four user inputs according to business rules.
// Parameters:
//   currentGpa (number): The CGPA achieved so far.
//   creditsCompleted (number): Total credits completed so far.
//   creditsRemaining (number): Total credits left to take.
//   targetGpa (number): The CGPA the student wants to reach.
// Returns:
//   (array): An array of error message strings. Empty if all inputs are valid.
// Example:
//   validateInputs(3.0, 20, 15, 4.5) returns ["Target CGPA must be between 0 and 4."]
function validateInputs(currentGpa, creditsCompleted, creditsRemaining, targetGpa) {
  const errors = [];

  // Check if any input is missing or invalid
  if (isNaN(currentGpa) || isNaN(creditsCompleted) || isNaN(creditsRemaining) || isNaN(targetGpa)) {
    errors.push("Please enter a valid number in all fields.");
  } else {
    if (currentGpa < 0 || currentGpa > 4) {
      errors.push("Current CGPA must be between 0 and 4.");
    }
    if (targetGpa < 0 || targetGpa > 4) {
      errors.push("Target CGPA must be between 0 and 4.");
    }
    if (creditsCompleted < 0 || creditsCompleted > 60) {
      errors.push("Credits completed must be between 0 and 60.");
    }
    if (creditsRemaining < 0.5 || creditsRemaining > 60) {
      errors.push("Credits remaining must be between 0.5 and 60.");
    }
    // Check if credits are multiples of 0.5
    if ((creditsCompleted * 2) % 1 !== 0 || (creditsRemaining * 2) % 1 !== 0) {
      errors.push("Credits must be in steps of 0.5.");
    }
  }

  return errors;
}

// ============================================================================
// 7.5 Display functions
// ============================================================================

// Empties all result and error areas on the page.
// Parameters: None
// Returns: None
// Example:
//   clearOutput()
function clearOutput() {
  document.getElementById("errors").innerHTML = "";
  document.getElementById("requiredAverage").textContent = "";
  document.getElementById("letterGrade").textContent = "";
  document.getElementById("verdict").textContent = "";
  document.getElementById("combinations").innerHTML = "";
}

// Displays validation errors in a bulleted list on the page.
// Parameters:
//   errors (array): An array of error message strings.
// Returns: None
// Example:
//   showErrors(["Target CGPA must be between 0 and 4."])
function showErrors(errors) {
  const errorsDiv = document.getElementById("errors");
  const ul = document.createElement("ul");
  
  for (let i = 0; i < errors.length; i = i + 1) {
    const li = document.createElement("li");
    li.textContent = errors[i];
    ul.appendChild(li);
  }
  
  errorsDiv.appendChild(ul);
}

// Fills the results section with the required average, letter grade, and verdict.
// Parameters:
//   requiredAverage (number): The average grade point needed.
//   verdict (string): "notAchievable", "secured", or "achievable".
//   highestPossible (number): The maximum possible CGPA.
//   gradeObject (object): The lowest required letter grade object (only for "achievable").
// Returns: None
// Example:
//   showResults(3.70, "achievable", 4.00, { letter: "A or A+", minPercent: 80, points: 4.0 })
function showResults(requiredAverage, verdict, highestPossible, gradeObject) {
  const reqAvgP = document.getElementById("requiredAverage");
  const letterGradeP = document.getElementById("letterGrade");
  const verdictP = document.getElementById("verdict");
  
  reqAvgP.textContent = "You need an average of " + requiredAverage.toFixed(2) + " on your remaining credits.";
  
  if (verdict === "achievable") {
    letterGradeP.textContent = "Minimum required grade: " + gradeObject.letter + " (aim for at least " + gradeObject.minPercent + "%).";
    verdictP.textContent = "Your target is achievable!";
  } else if (verdict === "secured") {
    verdictP.textContent = "Your target is already secured, even with the lowest grades.";
  } else if (verdict === "notAchievable") {
    verdictP.textContent = "Your required average is above 4.00, so this target is mathematically impossible. The highest CGPA you can still reach is " + highestPossible.toFixed(2) + ".";
  }
}

// Builds a table showing the generated combinations of A, B+, and B grades.
// Parameters:
//   combinations (array): An array of combination objects.
// Returns: None
// Example:
//   showCombinations([{ aCredits: 0.5, bPlusCredits: 0, bCredits: 0.5, average: 3.5 }])
function showCombinations(combinations) {
  const combinationsDiv = document.getElementById("combinations");
  
  if (combinations.length === 0) {
    return;
  }
  
  const table = document.createElement("table");
  const caption = document.createElement("caption");
  caption.textContent = "Grade combinations that reach your target";
  table.appendChild(caption);
  
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  
  const th1 = document.createElement("th");
  th1.textContent = "Credits of A";
  const th2 = document.createElement("th");
  th2.textContent = "Credits of B+";
  const th3 = document.createElement("th");
  th3.textContent = "Credits of B";
  const th4 = document.createElement("th");
  th4.textContent = "Average";
  
  headerRow.appendChild(th1);
  headerRow.appendChild(th2);
  headerRow.appendChild(th3);
  headerRow.appendChild(th4);
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  const tbody = document.createElement("tbody");
  
  for (let i = 0; i < combinations.length; i = i + 1) {
    const combo = combinations[i];
    const row = document.createElement("tr");
    
    const tdA = document.createElement("td");
    tdA.textContent = combo.aCredits;
    const tdBPlus = document.createElement("td");
    tdBPlus.textContent = combo.bPlusCredits;
    const tdB = document.createElement("td");
    tdB.textContent = combo.bCredits;
    const tdAvg = document.createElement("td");
    tdAvg.textContent = combo.average.toFixed(2);
    
    row.appendChild(tdA);
    row.appendChild(tdBPlus);
    row.appendChild(tdB);
    row.appendChild(tdAvg);
    
    tbody.appendChild(row);
  }
  
  table.appendChild(tbody);
  combinationsDiv.appendChild(table);
}

// ============================================================================
// 7.6 Main function and event wiring
// ============================================================================

// Reads inputs, coordinates the calculation logic, and handles the display.
// Parameters: None
// Returns: None
// Example:
//   handleCalculate()
function handleCalculate() {
  clearOutput();
  
  const currentGpa = parseFloat(document.getElementById("currentGpa").value);
  const creditsCompleted = parseFloat(document.getElementById("creditsCompleted").value);
  const creditsRemaining = parseFloat(document.getElementById("creditsRemaining").value);
  const targetGpa = parseFloat(document.getElementById("targetGpa").value);
  
  const errors = validateInputs(currentGpa, creditsCompleted, creditsRemaining, targetGpa);
  
  if (errors.length > 0) {
    showErrors(errors);
    return;
  }
  
  try {
    const requiredAverage = calculateRequiredAverage(currentGpa, creditsCompleted, creditsRemaining, targetGpa);
    const highestPossible = calculateHighestPossible(currentGpa, creditsCompleted, creditsRemaining);
    const verdict = getVerdict(requiredAverage);
    
    let gradeObject;
    let combinations = [];
    
    if (verdict === "achievable") {
      gradeObject = findLetterGrade(requiredAverage);
      combinations = findCombinations(creditsRemaining, requiredAverage);
    }
    
    showResults(requiredAverage, verdict, highestPossible, gradeObject);
    showCombinations(combinations);
    
  } catch (error) {
    const errorDiv = document.getElementById("errors");
    errorDiv.textContent = "An unexpected error occurred: " + error;
  }
}

// Resets all form inputs and clears the display.
// Parameters: None
// Returns: None
// Example:
//   handleReset()
function handleReset() {
  document.getElementById("currentGpa").value = "";
  document.getElementById("creditsCompleted").value = "";
  document.getElementById("creditsRemaining").value = "";
  document.getElementById("targetGpa").value = "";
  clearOutput();
}

document.getElementById("calculateBtn").addEventListener("click", handleCalculate);
document.getElementById("resetBtn").addEventListener("click", handleReset);
