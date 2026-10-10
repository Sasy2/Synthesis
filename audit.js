// ============================================================================
// Data
// ============================================================================

const CATEGORIES = [
  "Humanities & Social Sciences",
  "Business",
  "Mathematics & Quantitative",
  "Computing",
  "Research",
  "Non-Major Electives",
  "Required Major Courses",
  "Major Electives",
  "Capstone"
];

const GRADE_SCALE = [
  { letter: "A+", points: 4.0 },
  { letter: "A", points: 4.0 },
  { letter: "B+", points: 3.5 },
  { letter: "B", points: 3.0 },
  { letter: "C+", points: 2.5 },
  { letter: "C", points: 2.0 },
  { letter: "D+", points: 1.5 },
  { letter: "D", points: 1.0 },
  { letter: "E/F", points: 0.0 }
];

const COURSES = [
  // Humanities & Social Sciences
  { name: "Written and Oral Communication", credits: 1, minGrade: "C", category: "Humanities & Social Sciences" },
  { name: "Text and Meaning", credits: 1, minGrade: "B+", category: "Humanities & Social Sciences" },
  { name: "Leadership 1", credits: 0.5, minGrade: "B", category: "Humanities & Social Sciences" },
  { name: "Leadership 2", credits: 0.5, minGrade: "D+", category: "Humanities & Social Sciences" },
  { name: "Leadership 3", credits: 0.5, minGrade: "B", category: "Humanities & Social Sciences" },
  { name: "Leadership 4", credits: 1, minGrade: "C+", category: "Humanities & Social Sciences" },
  { name: "Principles of Economics", credits: 1, minGrade: "C", category: "Humanities & Social Sciences" },
  { name: "Ashesi Success Seminar", credits: 0, minGrade: "P", category: "Humanities & Social Sciences" },
  
  // Business
  { name: "Foundations of Design & Entrepreneurship I", credits: 1, minGrade: "B", category: "Business" },
  { name: "Foundations of Design & Entrepreneurship II", credits: 1, minGrade: "C+", category: "Business" },
  { name: "Finance for Non-Finance Managers", credits: 1, minGrade: "D+", category: "Business" },
  
  // Mathematics & Quantitative
  { name: "Calculus 1", credits: 1, minGrade: "C", category: "Mathematics & Quantitative" },
  { name: "Calculus 2", credits: 1, minGrade: "D+", category: "Mathematics & Quantitative" },
  { name: "Statistics", credits: 1, minGrade: "C", category: "Mathematics & Quantitative" },
  { name: "Linear Algebra", credits: 1, minGrade: "C", category: "Mathematics & Quantitative" },
  
  // Computing
  { name: "Introduction to Computing & IS", credits: 1, minGrade: "B+", category: "Computing" },
  
  // Research
  { name: "Research Methods", credits: 1, minGrade: "C+", category: "Research" },
  
  // Non-Major Electives
  { name: "Non-Major Elective 1", credits: 1, minGrade: "C", category: "Non-Major Electives" },
  { name: "Non-Major Elective 2", credits: 1, minGrade: "C", category: "Non-Major Electives" },
  
  // Required Major Courses
  { name: "Computer Programming for CS", credits: 1, minGrade: "C", category: "Required Major Courses" },
  { name: "Object Oriented Programming", credits: 1, minGrade: "D", category: "Required Major Courses" },
  { name: "Discrete Structures and Theory", credits: 1, minGrade: "D+", category: "Required Major Courses" },
  { name: "Data Structures and Algorithms", credits: 1, minGrade: "C", category: "Required Major Courses" },
  { name: "Computer Organization & Architecture", credits: 1, minGrade: "D+", category: "Required Major Courses" },
  { name: "Introduction to AI", credits: 1, minGrade: "C+", category: "Required Major Courses" },
  { name: "Software Engineering", credits: 1, minGrade: "C", category: "Required Major Courses" },
  { name: "Database Systems", credits: 1, minGrade: "C", category: "Required Major Courses" },
  { name: "Intermediate Computer Programming", credits: 1, minGrade: "B", category: "Required Major Courses" },
  { name: "Web Technologies", credits: 1, minGrade: "D+", category: "Required Major Courses" },
  { name: "Networks & Data Communication", credits: 1, minGrade: "D", category: "Required Major Courses" },
  { name: "Operating Systems", credits: 1, minGrade: "C", category: "Required Major Courses" },
  { name: "Algorithm Design & Analysis", credits: 1, minGrade: "D", category: "Required Major Courses" },
  { name: "Introduction to Modelling & Simulation", credits: 0.5, minGrade: "C+", category: "Required Major Courses" },
  { name: "System Fundamentals", credits: 1, minGrade: "D", category: "Required Major Courses" },
  
  // Major Electives
  { name: "CS Elective 1", credits: 1, minGrade: "C+", category: "Major Electives" },
  { name: "CS Elective 2", credits: 1, minGrade: "C+", category: "Major Electives" },
  
  // Capstone
  { name: "Capstone 1", credits: 1, minGrade: "D+", category: "Capstone" },
  { name: "Capstone 2", credits: 1, minGrade: "C+", category: "Capstone" }
];

const TOTAL_SEMESTERS = 8;
const MAX_CREDITS_PER_SEMESTER = 4.5;
const MAX_POINTS = 4.0;
const MIN_POINTS = 0.0;

// ============================================================================
// Helpers
// ============================================================================

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

// Looks up a letter grade and returns its corresponding point value.
// Parameters:
//   letter (string): The letter grade (e.g., "B+").
// Returns:
//   (number): The grade points (e.g., 3.5), or 0 if not found.
// Example:
//   getGradePoints("B+") returns 3.5
function getGradePoints(letter) {
  for (let i = 0; i < GRADE_SCALE.length; i = i + 1) {
    if (GRADE_SCALE[i].letter === letter) {
      return GRADE_SCALE[i].points;
    }
  }
  return 0.0;
}

// Retrieves the currently selected grade value from the DOM for a specific course.
// Parameters:
//   index (number): The index of the course in the COURSES array.
// Returns:
//   (string): The selected grade letter (e.g., "A", "P", or "" if not taken).
// Example:
//   getSelectedGrade(0) returns "B+"
function getSelectedGrade(index) {
  const selectElement = document.getElementById("grade" + index);
  if (selectElement) {
    return selectElement.value;
  }
  return "";
}

// ============================================================================
// Course status
// ============================================================================

// Checks if the selected grade for a course meets its minimum required grade.
// Parameters:
//   index (number): The index of the course in the COURSES array.
// Returns:
//   (boolean): true if passed, false otherwise.
// Example:
//   hasPassed(0) returns true (if course 0 requires C and grade is B)
function hasPassed(index) {
  const selectedGrade = getSelectedGrade(index);
  const minGrade = COURSES[index].minGrade;
  
  if (selectedGrade === "") {
    return false;
  }
  
  if (minGrade === "P") {
    if (selectedGrade === "P") {
      return true;
    } else {
      return false;
    }
  }
  
  if (getGradePoints(selectedGrade) >= getGradePoints(minGrade)) {
    return true;
  }
  return false;
}

// Checks if a course was taken but failed to meet the minimum grade.
// Parameters:
//   index (number): The index of the course in the COURSES array.
// Returns:
//   (boolean): true if the course has a grade but is not passed.
// Example:
//   mustRetake(0) returns true (if course 0 requires C and grade is D)
function mustRetake(index) {
  const selectedGrade = getSelectedGrade(index);
  if (selectedGrade !== "" && hasPassed(index) === false) {
    return true;
  }
  return false;
}

// ============================================================================
// Credit calculations
// ============================================================================

// Calculates the total number of credits required for the entire degree.
// Parameters: None
// Returns:
//   (number): Total required credits.
// Example:
//   getTotalCredits() returns 35.5
function getTotalCredits() {
  let total = 0;
  for (let i = 0; i < COURSES.length; i = i + 1) {
    total = total + COURSES[i].credits;
  }
  return total;
}

// Calculates the total credits earned from successfully passed courses.
// Parameters: None
// Returns:
//   (number): Credits completed.
// Example:
//   getCreditsCompleted() returns 20.0
function getCreditsCompleted() {
  let completed = 0;
  for (let i = 0; i < COURSES.length; i = i + 1) {
    if (hasPassed(i) === true) {
      completed = completed + COURSES[i].credits;
    }
  }
  return completed;
}

// Calculates the total required credits for a specific category.
// Parameters:
//   category (string): The category name.
// Returns:
//   (number): Required credits in that category.
// Example:
//   getCategoryRequired("Business") returns 3.0
function getCategoryRequired(category) {
  let total = 0;
  for (let i = 0; i < COURSES.length; i = i + 1) {
    if (COURSES[i].category === category) {
      total = total + COURSES[i].credits;
    }
  }
  return total;
}

// Calculates the total earned credits for a specific category from passed courses.
// Parameters:
//   category (string): The category name.
// Returns:
//   (number): Completed credits in that category.
// Example:
//   getCategoryCompleted("Business") returns 1.0
function getCategoryCompleted(category) {
  let completed = 0;
  for (let i = 0; i < COURSES.length; i = i + 1) {
    if (COURSES[i].category === category && hasPassed(i) === true) {
      completed = completed + COURSES[i].credits;
    }
  }
  return completed;
}

// Computes the current CGPA based on all courses taken with a letter grade.
// Parameters: None
// Returns:
//   (number): The current CGPA (or 0 if no letter grades).
// Example:
//   calculateCurrentCgpa() returns 3.00
function calculateCurrentCgpa() {
  let totalGradePoints = 0;
  let totalAttemptedCredits = 0;
  
  for (let i = 0; i < COURSES.length; i = i + 1) {
    const grade = getSelectedGrade(i);
    const credits = COURSES[i].credits;
    
    // Exclude empty, exclude P grades, and exclude 0-credit courses
    if (grade !== "" && grade !== "P" && credits > 0) {
      const points = getGradePoints(grade);
      totalGradePoints = totalGradePoints + (points * credits);
      totalAttemptedCredits = totalAttemptedCredits + credits;
    }
  }
  
  if (totalAttemptedCredits === 0) {
    return 0.0;
  }
  return roundTo2(totalGradePoints / totalAttemptedCredits);
}

// ============================================================================
// Semester planning
// ============================================================================

// Calculates the absolute minimum number of semesters needed for remaining credits.
// Parameters:
//   creditsLeft (number): Total credits still needed.
// Returns:
//   (number): Number of semesters required.
// Example:
//   getSemestersNeeded(10) returns 3
function getSemestersNeeded(creditsLeft) {
  let semestersCount = 0;
  let remaining = creditsLeft;
  
  while (remaining > 0) {
    remaining = remaining - MAX_CREDITS_PER_SEMESTER;
    semestersCount = semestersCount + 1;
  }
  
  return semestersCount;
}

// Builds an array showing how to spread remaining credits evenly across remaining semesters.
// Parameters:
//   creditsLeft (number): Total credits still needed.
//   semestersLeft (number): How many semesters the student has left.
// Returns:
//   (array): Array of numbers representing credits per semester.
// Example:
//   buildSemesterPlan(17, 4) returns [4.5, 4.5, 4.5, 3.5]
function buildSemesterPlan(creditsLeft, semestersLeft) {
  const plan = [];
  let remaining = creditsLeft;
  
  for (let i = 0; i < semestersLeft; i = i + 1) {
    if (remaining <= 0) {
      break;
    }
    
    if (remaining > MAX_CREDITS_PER_SEMESTER) {
      plan.push(MAX_CREDITS_PER_SEMESTER);
      remaining = remaining - MAX_CREDITS_PER_SEMESTER;
    } else {
      plan.push(remaining);
      remaining = 0;
    }
  }
  
  return plan;
}

// ============================================================================
// GPA target
// ============================================================================

// Calculates the required average on remaining credits to hit a target CGPA.
// Parameters:
//   currentGpa (number): The CGPA achieved so far.
//   creditsCompleted (number): Total credits completed so far.
//   creditsRemaining (number): Total credits left to take.
//   targetGpa (number): The CGPA the student wants to reach.
// Returns:
//   (number): The required average.
// Example:
//   calculateRequiredAverage(3.0, 20, 15, 3.3) returns 3.70
function calculateRequiredAverage(currentGpa, creditsCompleted, creditsRemaining, targetGpa) {
  const totalCredits = creditsCompleted + creditsRemaining;
  const targetTotalPoints = targetGpa * totalCredits;
  const currentPoints = currentGpa * creditsCompleted;
  
  return roundTo2((targetTotalPoints - currentPoints) / creditsRemaining);
}

// Calculates the maximum possible CGPA assuming 4.0 on all remaining credits.
// Parameters:
//   currentGpa (number): The CGPA achieved so far.
//   creditsCompleted (number): Total credits completed so far.
//   creditsRemaining (number): Total credits left to take.
// Returns:
//   (number): The highest possible CGPA.
// Example:
//   calculateHighestPossible(3.0, 20, 15) returns 3.43
function calculateHighestPossible(currentGpa, creditsCompleted, creditsRemaining) {
  const totalCredits = creditsCompleted + creditsRemaining;
  const currentPoints = currentGpa * creditsCompleted;
  const maxFuturePoints = MAX_POINTS * creditsRemaining;
  
  return roundTo2((currentPoints + maxFuturePoints) / totalCredits);
}

// Finds the lowest letter grade that meets or exceeds the required average.
// Parameters:
//   requiredAverage (number): The target grade points average.
// Returns:
//   (object): The matching grade object from GRADE_SCALE.
// Example:
//   findTargetLetterGrade(3.20) returns { letter: "B+", points: 3.5 }
function findTargetLetterGrade(requiredAverage) {
  let bestMatch = GRADE_SCALE[0];
  for (let i = GRADE_SCALE.length - 1; i >= 0; i = i - 1) {
    if (GRADE_SCALE[i].points >= requiredAverage) {
      bestMatch = GRADE_SCALE[i];
      break;
    }
  }
  return bestMatch;
}

// ============================================================================
// Display
// ============================================================================

// Builds the entire checklist form dynamically from data.
// Parameters: None
// Returns: None
// Example:
//   buildChecklist()
function buildChecklist() {
  const checklistDiv = document.getElementById("checklist");
  
  for (let i = 0; i < CATEGORIES.length; i = i + 1) {
    const category = CATEGORIES[i];
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = category;
    fieldset.appendChild(legend);
    
    for (let j = 0; j < COURSES.length; j = j + 1) {
      if (COURSES[j].category === category) {
        const course = COURSES[j];
        
        const formGroup = document.createElement("div");
        formGroup.className = "form-group";
        
        const label = document.createElement("label");
        label.setAttribute("for", "grade" + j);
        
        let labelText = course.name;
        if (course.credits === 0.5) {
          labelText = labelText + " (0.5)";
        }
        labelText = labelText + " (min. " + course.minGrade + ")";
        label.textContent = labelText;
        
        const select = document.createElement("select");
        select.id = "grade" + j;
        
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Not taken yet";
        select.appendChild(defaultOption);
        
        if (course.name === "Ashesi Success Seminar") {
          const pOption = document.createElement("option");
          pOption.value = "P";
          pOption.textContent = "P";
          select.appendChild(pOption);
        } else {
          for (let k = 0; k < GRADE_SCALE.length; k = k + 1) {
            const gradeOption = document.createElement("option");
            gradeOption.value = GRADE_SCALE[k].letter;
            gradeOption.textContent = GRADE_SCALE[k].letter;
            select.appendChild(gradeOption);
          }
        }
        
        formGroup.appendChild(label);
        formGroup.appendChild(select);
        fieldset.appendChild(formGroup);
      }
    }
    
    checklistDiv.appendChild(fieldset);
  }
}

// Validates input, calculates degree progress, and displays it.
// Parameters: None
// Returns: None
// Example:
//   showAuditResults()
function showAuditResults() {
  const resultsDiv = document.getElementById("auditResults");
  resultsDiv.innerHTML = "";
  
  const semestersInput = document.getElementById("semestersCompleted").value;
  const semestersCompleted = parseInt(semestersInput, 10);
  
  if (isNaN(semestersCompleted) || semestersCompleted < 0 || semestersCompleted > 8 || semestersInput !== semestersCompleted.toString()) {
    const errorP = document.createElement("p");
    errorP.className = "error-msg";
    errorP.textContent = "Please enter a valid whole number of semesters completed (0 to 8).";
    resultsDiv.appendChild(errorP);
    return;
  }
  
  const totalCredits = getTotalCredits();
  const completedCredits = getCreditsCompleted();
  const creditsLeft = totalCredits - completedCredits;
  const currentCgpa = calculateCurrentCgpa();
  
  const summaryP = document.createElement("p");
  summaryP.innerHTML = "You have completed " + completedCredits + " of " + totalCredits + " credits. <strong>" + creditsLeft + " credits left.</strong><br>Your current CGPA is <strong>" + currentCgpa.toFixed(2) + "</strong>.";
  resultsDiv.appendChild(summaryP);
  
  const semestersLeft = TOTAL_SEMESTERS - semestersCompleted;
  const adviceP = document.createElement("p");
  
  if (creditsLeft === 0) {
    adviceP.textContent = "You have completed all your courses. You can graduate.";
  } else if (semestersLeft === 0 && creditsLeft > 0) {
    const needed = getSemestersNeeded(creditsLeft);
    adviceP.textContent = "You cannot graduate yet. You still need " + creditsLeft + " credits, which takes at least " + needed + " more semester(s).";
  } else if ((creditsLeft / semestersLeft) <= MAX_CREDITS_PER_SEMESTER) {
    adviceP.textContent = "You are on track to graduate.";
    const plan = buildSemesterPlan(creditsLeft, semestersLeft);
    const planList = document.createElement("ul");
    for (let i = 0; i < plan.length; i = i + 1) {
      if (plan[i] > 0) {
        const li = document.createElement("li");
        li.textContent = "Semester " + (semestersCompleted + i + 1) + ": " + plan[i] + " credits";
        planList.appendChild(li);
      }
    }
    adviceP.appendChild(planList);
  } else {
    const neededSemesters = getSemestersNeeded(creditsLeft);
    const extraSemesters = neededSemesters - semestersLeft;
    adviceP.textContent = "You cannot graduate on time. You have " + creditsLeft + " credits left but only " + semestersLeft + " semester(s), and the maximum is 4.5 credits per semester. You need about " + neededSemesters + " semesters, which is " + extraSemesters + " extra semester(s).";
  }
  resultsDiv.appendChild(adviceP);
  
  const table = document.createElement("table");
  let tableHTML = "<caption>Category Progress</caption><thead><tr><th>Category</th><th>Completed</th><th>Required</th></tr></thead><tbody>";
  for (let i = 0; i < CATEGORIES.length; i = i + 1) {
    const cat = CATEGORIES[i];
    const catCompleted = getCategoryCompleted(cat);
    const catRequired = getCategoryRequired(cat);
    tableHTML = tableHTML + "<tr><td>" + cat + "</td><td>" + catCompleted + "</td><td>" + catRequired + "</td></tr>";
  }
  tableHTML = tableHTML + "</tbody>";
  table.innerHTML = tableHTML;
  resultsDiv.appendChild(table);
  
  const retakeDiv = document.createElement("div");
  retakeDiv.innerHTML = "<h3>Courses to retake</h3>";
  const retakeUl = document.createElement("ul");
  let hasRetakes = false;
  
  for (let i = 0; i < COURSES.length; i = i + 1) {
    if (mustRetake(i)) {
      hasRetakes = true;
      const li = document.createElement("li");
      li.textContent = COURSES[i].name + " (Got: " + getSelectedGrade(i) + ", Min: " + COURSES[i].minGrade + ")";
      retakeUl.appendChild(li);
    }
  }
  if (hasRetakes === false) {
    const li = document.createElement("li");
    li.textContent = "None";
    retakeUl.appendChild(li);
  }
  retakeDiv.appendChild(retakeUl);
  resultsDiv.appendChild(retakeDiv);
  
  const stillToTakeDiv = document.createElement("div");
  stillToTakeDiv.innerHTML = "<h3>Courses still to take</h3>";
  const stillToTakeUl = document.createElement("ul");
  let hasStillToTake = false;
  
  for (let i = 0; i < COURSES.length; i = i + 1) {
    if (hasPassed(i) === false && mustRetake(i) === false) {
      hasStillToTake = true;
      const li = document.createElement("li");
      li.textContent = COURSES[i].name + " (" + COURSES[i].credits + " credits)";
      stillToTakeUl.appendChild(li);
    }
  }
  if (hasStillToTake === false) {
    const li = document.createElement("li");
    li.textContent = "None";
    stillToTakeUl.appendChild(li);
  }
  stillToTakeDiv.appendChild(stillToTakeUl);
  resultsDiv.appendChild(stillToTakeDiv);
}

// Clears all form inputs and result areas.
// Parameters: None
// Returns: None
// Example:
//   clearAll()
function clearAll() {
  for (let i = 0; i < COURSES.length; i = i + 1) {
    const select = document.getElementById("grade" + i);
    if (select) {
      select.value = "";
    }
  }
  document.getElementById("semestersCompleted").value = "";
  document.getElementById("targetGpa").value = "";
  document.getElementById("auditResults").innerHTML = "";
  document.getElementById("gpaResults").innerHTML = "";
}

// Calculates the required average to hit a target CGPA and displays it.
// Parameters: None
// Returns: None
// Example:
//   showGpaResults()
function showGpaResults() {
  const gpaResultsDiv = document.getElementById("gpaResults");
  gpaResultsDiv.innerHTML = "";
  
  const targetInput = document.getElementById("targetGpa").value;
  const targetGpa = parseFloat(targetInput);
  
  if (isNaN(targetGpa) || targetGpa < 0 || targetGpa > 4 || targetInput === "") {
    const errorP = document.createElement("p");
    errorP.className = "error-msg";
    errorP.textContent = "Please enter a valid Target CGPA between 0 and 4.";
    gpaResultsDiv.appendChild(errorP);
    return;
  }
  
  let hasLetterGrades = false;
  for (let i = 0; i < COURSES.length; i = i + 1) {
    const grade = getSelectedGrade(i);
    if (grade !== "" && grade !== "P") {
      hasLetterGrades = true;
      break;
    }
  }
  
  if (hasLetterGrades === false) {
    const p = document.createElement("p");
    p.textContent = "Please fill in some letter grades in Section 1 first to establish a current CGPA.";
    gpaResultsDiv.appendChild(p);
    return;
  }
  
  const currentCgpa = calculateCurrentCgpa();
  const completedCredits = getCreditsCompleted();
  const totalCredits = getTotalCredits();
  const creditsLeft = totalCredits - completedCredits;
  
  if (creditsLeft === 0) {
    const p = document.createElement("p");
    p.textContent = "You have 0 credits left. Your CGPA can no longer change.";
    gpaResultsDiv.appendChild(p);
    return;
  }
  
  const requiredAverage = calculateRequiredAverage(currentCgpa, completedCredits, creditsLeft, targetGpa);
  
  const resultP = document.createElement("p");
  resultP.textContent = "To reach a " + targetGpa.toFixed(2) + " CGPA, you need an average of " + requiredAverage.toFixed(2) + " on your remaining " + creditsLeft + " credits.";
  gpaResultsDiv.appendChild(resultP);
  
  const verdictP = document.createElement("p");
  if (requiredAverage > MAX_POINTS) {
    const highestPossible = calculateHighestPossible(currentCgpa, completedCredits, creditsLeft);
    verdictP.textContent = "This target is not achievable. The highest CGPA you can still reach is " + highestPossible.toFixed(2) + ".";
  } else if (requiredAverage <= MIN_POINTS) {
    verdictP.textContent = "Your target is already secured!";
  } else {
    const targetGrade = findTargetLetterGrade(requiredAverage);
    let gradeText = targetGrade.letter;
    if (targetGrade.letter === "A" || targetGrade.letter === "A+") {
      gradeText = "A or A+";
    }
    verdictP.textContent = "Your target is achievable! To comfortably reach this average, you should aim to get at least a " + gradeText + " in your remaining courses.";
  }
  gpaResultsDiv.appendChild(verdictP);
}

// Start-up
buildChecklist();
document.getElementById("auditBtn").addEventListener("click", showAuditResults);
document.getElementById("clearBtn").addEventListener("click", clearAll);
document.getElementById("gpaBtn").addEventListener("click", showGpaResults);
