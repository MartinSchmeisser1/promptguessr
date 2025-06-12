document.addEventListener("DOMContentLoaded", () => {
  const imageElement = document.getElementById("image");
  const revealedWordsElement = document.getElementById("revealed-words");
  const guessInput = document.getElementById("guess-input");

  let prompts = [];
  let currentPromptIndex = 0;
  let revealedWords = [];

  // Load prompts.json
  fetch('./prompts.json')
    .then(response => response.json())
    .then(data => {
      prompts = data;
      loadPrompt(currentPromptIndex);
    })
    .catch(error => console.error("Error loading prompts.json:", error));

  // Load a specific prompt
  function loadPrompt(index) {
    const prompt = prompts[index];
    imageElement.src = prompt.image;
    revealedWords = Array(prompt.prompt.length).fill("_");
    updateRevealedWords();
  }

  // Update the revealed words display
  function updateRevealedWords() {
    revealedWordsElement.textContent = revealedWords.join(" ");
  }

  // Handle user guesses
  guessInput.addEventListener("input", () => {
    const guess = guessInput.value.trim().toLowerCase();
    if (guess) {
      const currentPrompt = prompts[currentPromptIndex].prompt;
      let isCorrect = false;

      currentPrompt.forEach((word, index) => {
        if (word === guess && revealedWords[index] === "_") {
          revealedWords[index] = word;
          isCorrect = true;
        }
      });

      if (isCorrect) {
        updateRevealedWords();
        checkCompletion();
      }

      guessInput.value = ""; // Clear the input field
    }
  });

  // Check if all words are guessed
  function checkCompletion() {
    if (!revealedWords.includes("_")) {
      // Show a transition message
      revealedWordsElement.textContent = "Correct! Loading next image...";
      guessInput.disabled = true;

      setTimeout(() => {
        currentPromptIndex++;
        if (currentPromptIndex < prompts.length) {
          loadPrompt(currentPromptIndex);
          guessInput.disabled = false;
        } else {
          revealedWordsElement.textContent = "Congratulations! You've completed all prompts!";
          guessInput.disabled = true; // Disable input after completion
        }
      }, 1000); // 1-second delay
    }
  }
});