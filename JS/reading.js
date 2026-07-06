// ==========================
// N1 Master Reading Menu
// ==========================

function startReading(mode) {
    localStorage.setItem("selectedCategory", mode);
    window.location.href = "quiz.html?mode=" + mode;
}
