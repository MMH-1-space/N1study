// ==========================
// N1 Master Ver.4 Quiz System
// 語彙・漢字・文法・読解 完全対応
// ==========================

const params = new URLSearchParams(window.location.search);

let category =
    params.get("mode") ||
    localStorage.getItem("selectedCategory") ||
    "random";

// ==========================
// 問題データ登録
// ==========================
const questions = {
    vocabulary: typeof vocabularyQuestions !== "undefined" ? vocabularyQuestions : [],
    kanji: typeof kanjiQuestions !== "undefined" ? kanjiQuestions : [],
    grammar: typeof grammarQuestions !== "undefined" ? grammarQuestions : [],

    "reading-short": typeof readingShortQuestions !== "undefined" ? readingShortQuestions : [],
    "reading-medium": typeof readingMediumQuestions !== "undefined" ? readingMediumQuestions : [],
    "reading-long": typeof readingLongQuestions !== "undefined" ? readingLongQuestions : [],
    "reading-compare": typeof readingCompareQuestions !== "undefined" ? readingCompareQuestions : [],
    "reading-search": typeof readingSearchQuestions !== "undefined" ? readingSearchQuestions : []
};

// ==========================
// ランダムカテゴリ
// ==========================
const normalCategories = [
    "vocabulary",
    "kanji",
    "grammar",
    "reading-short",
    "reading-medium",
    "reading-long",
    "reading-compare",
    "reading-search"
];

const readingCategories = [
    "reading-short",
    "reading-medium",
    "reading-long",
    "reading-compare",
    "reading-search"
];

if (category === "random") {
    category = normalCategories[Math.floor(Math.random() * normalCategories.length)];
}

if (category === "reading-random") {
    category = readingCategories[Math.floor(Math.random() * readingCategories.length)];
}

localStorage.setItem("selectedCategory", category);

// ==========================
// HTML取得
// ==========================
const categoryTitle = document.getElementById("categoryTitle");
const questionElement = document.getElementById("question");
const passageElement = document.getElementById("passage");
const readingTitle = document.getElementById("readingTitle");
const choicesElement = document.getElementById("choices");
const progressElement = document.getElementById("progress");
const progressFill = document.getElementById("progressFill");
const scoreText = document.getElementById("scoreText");
const explanation = document.getElementById("explanation");
const nextBtn = document.getElementById("nextBtn");

// ==========================
// カテゴリ名
// ==========================
const categoryNames = {
    vocabulary: "📚 語彙クイズ",
    kanji: "🈶 漢字クイズ",
    grammar: "📝 文法クイズ",
    "reading-short": "📖 短文読解",
    "reading-medium": "📘 中文読解",
    "reading-long": "📚 長文読解",
    "reading-compare": "⚖️ 比較読解",
    "reading-search": "🔍 情報検索"
};

categoryTitle.textContent = categoryNames[category] || "🎲 クイズ";

// ==========================
// データ形式を統一する
// 対応形式①:
// { passage, question, choices, answer, explanation }
//
// 対応形式②:
// { document, questions:[...] }
// ==========================
let questionList = [];

if (questions[category]) {

    questions[category].forEach(item => {

        if (
    (item.document || (item.passageA && item.passageB))
    && Array.isArray(item.questions)
) {

            item.questions.forEach(q => {
                questionList.push({
                    passage:
    item.document
    || "【文章A】\n\n" +
       item.passageA +
       "\n\n-----------------------------\n\n【文章B】\n\n" +
       item.passageB,
                    question: q.question,
                    choices: q.choices,
                    answer: q.answer,
                    explanation: q.explanation
                });
            });

        } else {

            questionList.push({
                passage: item.passage || "",
                question: item.question,
                choices: item.choices,
                answer: item.answer,
                explanation: item.explanation
            });

        }

    });

}

// ==========================
// 問題がない場合
// ==========================
if (questionList.length === 0) {
    questionElement.textContent = "問題データがありません。";
    choicesElement.innerHTML = "<p>JSファイル名・変数名・読み込み順を確認してください。</p>";
    throw new Error("No question data");
}

// ==========================
// 問題シャッフル
// ==========================
questionList.sort(() => Math.random() - 0.5);

// 全問出す
const questionCount = questionList.length;
questionList = questionList.slice(0, questionCount);

let currentQuestionIndex = 0;
let score = 0;
let answered = false;

// ==========================
// 問題表示
// ==========================
function showQuestion() {

    answered = false;

    const q = questionList[currentQuestionIndex];

    progressElement.textContent =
        `問題 ${currentQuestionIndex + 1} / ${questionList.length}`;

    progressFill.style.width =
        `${((currentQuestionIndex + 1) / questionList.length) * 100}%`;

    scoreText.textContent = `Score : ${score}`;

    explanation.classList.add("hidden");
    explanation.innerHTML = "";
    nextBtn.classList.add("hidden");

    // 本文表示
    if (q.passage && q.passage.trim() !== "") {
        readingTitle.classList.remove("hidden");
        passageElement.classList.remove("hidden");
        passageElement.textContent = q.passage;
    } else {
        readingTitle.classList.add("hidden");
        passageElement.classList.add("hidden");
        passageElement.textContent = "";
    }

    // 問題文
    questionElement.textContent = q.question || "問題文がありません。";

    // 選択肢
    choicesElement.innerHTML = "";

    if (!Array.isArray(q.choices)) {
        choicesElement.innerHTML = "<p>選択肢データがありません。</p>";
        return;
    }

    const shuffledChoices = q.choices.map((choice, index) => {
        return {
            text: choice,
            originalIndex: index
        };
    });

    shuffledChoices.sort(() => Math.random() - 0.5);

    shuffledChoices.forEach(choiceObj => {

        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = choiceObj.text;

        btn.onclick = () => {
            checkAnswer(choiceObj.originalIndex);
        };

        choicesElement.appendChild(btn);

    });
}

// ==========================
// 回答判定
// ==========================
function checkAnswer(selectedIndex) {

    if (answered) return;

    answered = true;

    const q = questionList[currentQuestionIndex];
    const buttons = document.querySelectorAll(".choice-btn");

    buttons.forEach(btn => {

        btn.disabled = true;

        if (btn.textContent === q.choices[q.answer]) {
            btn.classList.add("correct");
        }

        if (
            selectedIndex !== q.answer &&
            btn.textContent === q.choices[selectedIndex]
        ) {
            btn.classList.add("wrong");
        }

    });

    if (selectedIndex === q.answer) {
        score++;
    }

    scoreText.textContent = `Score : ${score}`;

    explanation.classList.remove("hidden");

    if (selectedIndex === q.answer) {
        explanation.innerHTML = `
            <h3>⭕ 正解</h3>
            <p>${q.explanation || "解説はありません。"}</p>
        `;
    } else {
        explanation.innerHTML = `
            <h3>❌ 不正解</h3>
            <p><strong>正解：</strong>${q.choices[q.answer]}</p>
            <p>${q.explanation || "解説はありません。"}</p>
        `;
    }

    nextBtn.classList.remove("hidden");

    nextBtn.textContent =
        currentQuestionIndex === questionList.length - 1
            ? "結果を見る"
            : "次の問題へ";
}

// ==========================
// 次の問題
// ==========================
function nextQuestion() {

    currentQuestionIndex++;

    if (currentQuestionIndex < questionList.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
}

// ==========================
// 終了処理
// ==========================
function finishQuiz() {

    const total = questionList.length;
    const rate = Math.round((score / total) * 100);

    localStorage.setItem("score", score);
    localStorage.setItem("totalQuestions", total);
    localStorage.setItem("lastCategory", category);
    localStorage.setItem("correctRate", rate);

    const bestScore = Number(localStorage.getItem("bestScore")) || 0;

    if (score > bestScore) {
        localStorage.setItem("bestScore", score);
    }

    const playCount = Number(localStorage.getItem("playCount")) || 0;
    localStorage.setItem("playCount", playCount + 1);

    window.location.href = "result.html";
}

// ==========================
// 次へボタン
// ==========================
nextBtn.addEventListener("click", nextQuestion);

// ==========================
// サイドバー
// ==========================
document.querySelectorAll(".sidebar a").forEach(link => {

    link.addEventListener("click", function (e) {

        const text = this.textContent;

        if (text.includes("語彙")) {
            e.preventDefault();
            window.location.href = "quiz.html?mode=vocabulary";
        }

        if (text.includes("漢字")) {
            e.preventDefault();
            window.location.href = "quiz.html?mode=kanji";
        }

        if (text.includes("文法")) {
            e.preventDefault();
            window.location.href = "quiz.html?mode=grammar";
        }

        if (text.includes("読解")) {
            e.preventDefault();
            window.location.href = "reading.html";
        }

        if (text.includes("ホーム")) {
            e.preventDefault();
            window.location.href = "index.html";
        }

        if (text.includes("成績")) {
            e.preventDefault();
            window.location.href = "result.html";
        }

        if (text.includes("設定")) {
            e.preventDefault();
            window.location.href = "settings.html";
        }

    });

});

// ==========================
// 開始
// ==========================
showQuestion();