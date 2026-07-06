// ======================
// N1 Master App System 完成版
// ======================

const quizButtons = document.querySelectorAll(".quiz-btn");
const startBtn = document.getElementById("startBtn");

let selectedCategory = localStorage.getItem("selectedCategory") || null;

// カテゴリ選択
quizButtons.forEach(button => {

    button.addEventListener("click", () => {

        quizButtons.forEach(btn => {
            btn.style.background = "";
            btn.style.color = "";
            btn.style.border = "";
        });

        button.style.background = "#2563eb";
        button.style.color = "white";
        button.style.border = "3px solid #1d4ed8";

        selectedCategory = button.dataset.category;

        localStorage.setItem("selectedCategory", selectedCategory);
    });

});

// 学習開始
startBtn?.addEventListener("click", () => {

    if (!selectedCategory) {
        alert("カテゴリを選択してください");
        return;
    }

    location.href = "quiz.html?mode=" + selectedCategory;
});

// ダブルクリックで即開始
quizButtons.forEach(button => {

    button.addEventListener("dblclick", () => {
        const category = button.dataset.category;
        localStorage.setItem("selectedCategory", category);
        location.href = "quiz.html?mode=" + category;
    });

});

// サイドバー用
function startQuiz(category) {
    localStorage.setItem("selectedCategory", category);
    location.href = "quiz.html?mode=" + category;
}

// ホーム
document.getElementById("homeBtn")?.addEventListener("click", () => {
    location.href = "index.html";
});

// 数字表示
const vocabularyCount =
    typeof vocabularyQuestions !== "undefined" ? vocabularyQuestions.length : 0;

const kanjiCount =
    typeof kanjiQuestions !== "undefined" ? kanjiQuestions.length : 0;

const grammarCount =
    typeof grammarQuestions !== "undefined" ? grammarQuestions.length : 0;

const readingCount =
    (typeof readingShortQuestions !== "undefined" ? readingShortQuestions.length : 0) +
    (typeof readingMediumQuestions !== "undefined" ? readingMediumQuestions.length : 0) +
    (typeof readingLongQuestions !== "undefined" ? readingLongQuestions.length : 0) +
    (typeof readingCompareQuestions !== "undefined" ? readingCompareQuestions.length : 0) +
    (typeof readingSearchQuestions !== "undefined" ? readingSearchQuestions.length : 0);

document.getElementById("vocabularyCount") &&
    (document.getElementById("vocabularyCount").textContent = vocabularyCount);

document.getElementById("kanjiCount") &&
    (document.getElementById("kanjiCount").textContent = kanjiCount);

document.getElementById("grammarCount") &&
    (document.getElementById("grammarCount").textContent = grammarCount);

document.getElementById("readingCount") &&
    (document.getElementById("readingCount").textContent = readingCount);

document.getElementById("totalCount") &&
    (document.getElementById("totalCount").textContent =
        vocabularyCount + kanjiCount + grammarCount + readingCount);
