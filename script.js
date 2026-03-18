let currentQuizQuestions = [];
let currentQuestionIndex = 0;
let currentMode = null;
let answeredCurrentQuestion = false;
let score = 0;

const menuSection = document.getElementById("menuSection");
const quizSection = document.getElementById("quizSection");
const resultSection = document.getElementById("resultSection");

const categoriesContainer = document.getElementById("categoriesContainer");
const startFullQuizBtn = document.getElementById("startFullQuizBtn");

const progressText = document.getElementById("progressText");
const questionMeta = document.getElementById("questionMeta");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const feedbackContainer = document.getElementById("feedbackContainer");

const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const backToMenuBtn = document.getElementById("backToMenuBtn");
const resultBackToMenuBtn = document.getElementById("resultBackToMenuBtn");
const restartSameModeBtn = document.getElementById("restartSameModeBtn");
const resultText = document.getElementById("resultText");

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getCategories() {
  const map = new Map();

  QUESTIONS.forEach((q) => {
    if (!map.has(q.categoryId)) {
      map.set(q.categoryId, q.categoryName);
    }
  });

  return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
}

function renderCategoryButtons() {
  const categories = getCategories();
  categoriesContainer.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.addEventListener("click", () => startQuizByCategory(category.id));
    categoriesContainer.appendChild(button);
  });
}

function showMenu() {
  menuSection.classList.remove("hidden");
  quizSection.classList.add("hidden");
  resultSection.classList.add("hidden");
}

function showQuiz() {
  menuSection.classList.add("hidden");
  quizSection.classList.remove("hidden");
  resultSection.classList.add("hidden");
}

function showResult() {
  menuSection.classList.add("hidden");
  quizSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
}

function startFullQuiz() {
  currentMode = {
    type: "all"
  };
  currentQuizQuestions = shuffleArray(QUESTIONS);
  resetQuizState();
  showQuiz();
  renderQuestion();
}

function startQuizByCategory(categoryId) {
  currentMode = {
    type: "category",
    categoryId
  };
  currentQuizQuestions = QUESTIONS.filter(q => q.categoryId === categoryId);
  resetQuizState();
  showQuiz();
  renderQuestion();
}

function restartCurrentMode() {
  if (!currentMode) {
    showMenu();
    return;
  }

  if (currentMode.type === "all") {
    startFullQuiz();
    return;
  }

  if (currentMode.type === "category") {
    startQuizByCategory(currentMode.categoryId);
  }
}

function resetQuizState() {
  currentQuestionIndex = 0;
  answeredCurrentQuestion = false;
  score = 0;
  nextQuestionBtn.disabled = true;
}

function renderQuestion() {
  const questionData = currentQuizQuestions[currentQuestionIndex];
  answeredCurrentQuestion = false;
  nextQuestionBtn.disabled = true;
  feedbackContainer.innerHTML = "";

  progressText.textContent = `Questão ${currentQuestionIndex + 1} de ${currentQuizQuestions.length}`;
  questionMeta.textContent = `Categoria: ${questionData.categoryName} | Questão ${questionData.id}`;
  questionText.textContent = questionData.question;

  optionsContainer.innerHTML = "";

  Object.entries(questionData.options).forEach(([letter, text]) => {
    const label = document.createElement("label");
    label.className = "option";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = letter;
    radio.style.marginRight = "8px";

    radio.addEventListener("change", () => handleAnswer(letter));

    label.appendChild(radio);
    label.appendChild(document.createTextNode(`${letter}) ${text}`));
    optionsContainer.appendChild(label);
  });
}

function handleAnswer(selectedLetter) {
  if (answeredCurrentQuestion) return;

  answeredCurrentQuestion = true;
  nextQuestionBtn.disabled = false;

  const questionData = currentQuizQuestions[currentQuestionIndex];
  const isCorrect = selectedLetter === questionData.correctAnswer;

  if (isCorrect) {
    score++;
  }

  disableOptions();

  feedbackContainer.innerHTML = `
    <div class="feedback ${isCorrect ? "correct" : "wrong"}">
      <strong>${isCorrect ? "Você acertou." : "Você errou."}</strong>
      <div style="margin-top: 6px;">
        Resposta correta: ${questionData.correctAnswer}
      </div>
      <div class="explanation">
        ${questionData.explanation}
      </div>
    </div>
  `;
}

function disableOptions() {
  const radios = document.querySelectorAll('input[name="answer"]');
  radios.forEach(radio => {
    radio.disabled = true;
  });
}

function nextQuestion() {
  if (!answeredCurrentQuestion) return;

  currentQuestionIndex++;

  if (currentQuestionIndex >= currentQuizQuestions.length) {
    finishQuiz();
    return;
  }

  renderQuestion();
}

function finishQuiz() {
  resultText.textContent = `Você acertou ${score} de ${currentQuizQuestions.length} questão(ões).`;
  showResult();
}

startFullQuizBtn.addEventListener("click", startFullQuiz);
nextQuestionBtn.addEventListener("click", nextQuestion);
backToMenuBtn.addEventListener("click", showMenu);
resultBackToMenuBtn.addEventListener("click", showMenu);
restartSameModeBtn.addEventListener("click", restartCurrentMode);

renderCategoryButtons();
showMenu();