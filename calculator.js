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
