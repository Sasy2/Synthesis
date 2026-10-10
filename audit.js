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
