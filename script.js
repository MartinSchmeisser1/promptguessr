const guessInput = document.getElementById("guessInput");
const submitGuess = document.getElementById("submitGuess");
const revealedWordsElement = document.getElementById("revealedWords");

let prompts = []; // Loaded from prompts.json
let currentPromptIndex = 0;
let revealedWords = [];
let remainingWords = [];

// Fetch prompts.json
fetch('./prompts.json')
  .then(response => response.json())
  .then(data => {
    prompts = data;
    loadPrompt(currentPromptIndex);
  })
  .catch(error => console.error("Error loading prompts.json:", error));

// Load the current prompt
function loadPrompt(index) {
  const prompt = prompts[index];
  remainingWords = prompt.prompt.map(word => word.toLowerCase()); // Normalize all words to lowercase
  revealedWords = Array(remainingWords.length).fill("_"); // Create underscores for each word
  updateRevealedWords();
  document.body.style.background = `url(${prompt.image}) no-repeat center center`;
  document.body.style.backgroundSize = "cover";
}

// Update the revealed words display
function updateRevealedWords() {
  revealedWordsElement.textContent = revealedWords.join(" ");
}

// Check if the guess is correct
function checkGuess(guess) {
  const wordIndex = remainingWords.indexOf(guess); // Check if the guessed word exists in the remaining words
  if (wordIndex !== -1) {
    revealedWords[wordIndex] = remainingWords[wordIndex]; // Reveal the guessed word
    remainingWords[wordIndex] = null; // Mark the word as guessed
    updateRevealedWords();

    // Check if all words have been guessed
    if (remainingWords.every(word => word === null)) {
      guessInput.disabled = true;
      submitGuess.disabled = true;

      setTimeout(() => {
        currentPromptIndex++;
        if (currentPromptIndex < prompts.length) {
          loadPrompt(currentPromptIndex);
          guessInput.disabled = false;
          submitGuess.disabled = false;
          guessInput.value = ""; // Clear input for the next round
        } else {
          revealedWordsElement.textContent = "Congratulations! You've completed all prompts!";
        }
      }, 1000);
    }
  } else {
    alert("Incorrect guess! Try again.");
    guessInput.value = ""; // Clear input for another attempt
  }
}

// Add event listener for the "Submit Guess" button
submitGuess.addEventListener("click", () => {
  const guess = guessInput.value.trim().toLowerCase();
  if (guess) {
    checkGuess(guess);
  }
});