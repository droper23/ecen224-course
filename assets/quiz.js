/* Self-check quiz widget. Markup contract:
<div class="quiz">
  <div class="quiz-q-text">Question?</div>
  <div class="quiz-opts">
    <button class="quiz-opt" data-correct="false">Wrong answer</button>
    <button class="quiz-opt" data-correct="true">Right answer</button>
  </div>
  <div class="quiz-explain">Explanation shown after answering.</div>
</div>
Also marks the current module complete in localStorage once every quiz on the
page has been answered at least once, so the course map can show a check mark. */
(function () {
  "use strict";

  function markComplete() {
    try {
      var id = document.body.getAttribute("data-module-id");
      if (!id) return;
      var done = JSON.parse(localStorage.getItem("ecen224-done") || "{}");
      done[id] = true;
      localStorage.setItem("ecen224-done", JSON.stringify(done));
    } catch (e) {}
  }

  function initQuiz(quiz) {
    var opts = quiz.querySelectorAll(".quiz-opt");
    var explain = quiz.querySelector(".quiz-explain");
    var answered = false;
    opts.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (answered) return;
        answered = true;
        var isCorrect = btn.getAttribute("data-correct") === "true";
        opts.forEach(function (b) {
          b.disabled = true;
          if (b.getAttribute("data-correct") === "true") b.classList.add("correct");
        });
        if (!isCorrect) btn.classList.add("incorrect");
        if (explain) {
          explain.classList.add("show");
          var verdict = explain.querySelector(".verdict");
          if (verdict) {
            verdict.textContent = isCorrect ? "Correct. " : "Not quite. ";
            verdict.className = "verdict " + (isCorrect ? "verdict-correct" : "verdict-incorrect");
          }
        }
        checkAllAnswered();
      });
    });
  }

  function checkAllAnswered() {
    var all = document.querySelectorAll(".quiz");
    var allDone = true;
    all.forEach(function (q) {
      var disabled = q.querySelectorAll(".quiz-opt:disabled").length;
      var total = q.querySelectorAll(".quiz-opt").length;
      if (total > 0 && disabled < total) allDone = false;
    });
    if (allDone && all.length > 0) markComplete();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".quiz").forEach(initQuiz);
  });
})();
