/* Course map progress: reads localStorage "ecen224-done" (written by quiz.js
   on each lesson page) and marks module cards complete + fills the summary bar. */
(function () {
  "use strict";
  function run() {
    var done = {};
    try { done = JSON.parse(localStorage.getItem("ecen224-done") || "{}"); } catch (e) {}
    var cards = document.querySelectorAll(".module-card[data-module-id]");
    var doneCount = 0;
    cards.forEach(function (card) {
      var id = card.getAttribute("data-module-id");
      if (done[id]) {
        card.classList.add("done");
        doneCount++;
      }
    });
    var counter = document.getElementById("progressCounter");
    if (counter) counter.textContent = doneCount + " / " + cards.length + " modules completed";
    var bar = document.getElementById("progressBarFill");
    if (bar && cards.length) bar.style.width = (100 * doneCount / cards.length) + "%";
  }
  document.addEventListener("DOMContentLoaded", run);
})();
