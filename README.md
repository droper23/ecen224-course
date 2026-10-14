# ECEn 224 — Interactive Study Companion

An unofficial, interactive study site for BYU's **ECEn 224: Introduction to
Computer Systems** (Fall 2026, Section 001), built from this section's own
posted lecture slides and organized around its actual exam schedule.

**Not affiliated with or endorsed by BYU.** Always defer to
[LearningSuite](https://learningsuite.byu.edu) for the official syllabus, due
dates, and any updates from the instructors (D. J. Lee, Scott Lloyd).

## What's here

32 interactive lesson modules, each with real explanatory content, worked
examples, and self-check quizzes, grouped into 5 units that map onto this
course's exam structure:

| Unit | Topic | Tested on |
|---|---|---|
| 1 | Data Representation | Game 1 (Midterm 1) + Final |
| 2 | C Programming | Game 1 + Final |
| 3 | Debugging, Linking & Intro Assembly | Game 1 + Final |
| 4 | x86-64 Assembly (AT&T syntax) | Game 2 (Midterm 2) + Final |
| 5 | Systems: memory, networking, concurrency | Final only |

Open `index.html` in a browser (or visit the GitHub Pages URL once deployed)
to see the full course map. Progress (which modules you've completed the
quizzes for) is tracked locally in your own browser via `localStorage` —
nothing is uploaded anywhere.

## Structure

```
index.html              course map
assets/                 shared CSS/JS (style.css, quiz.js, progress.js)
modules/NN-slug/         one lesson.html per module
```

Each `lesson.html` is fully self-contained aside from the shared assets and
a CDN-hosted copy of highlight.js for code syntax highlighting.

## What's deliberately excluded

The original lecture PDFs and their extracted text are the instructors'
copyrighted course material and are **not** part of this repo (see
`.gitignore`). The lesson content here is original synthesized teaching
material written from that source, not a copy of the slides.

## Updating as the semester progresses

This was generated from what had been posted to LearningSuite as of
**September 16, 2026** (through the Floating Point lecture, with the rest of
the semester's slides already posted in advance). A few late-semester topics
mentioned on the schedule (Unix, File I/O, Common Memory Bugs) hadn't been
posted as standalone files yet at that point — add modules for them the same
way once they're available.

## Local development

No build step — it's static HTML/CSS/JS. Serve the directory with any static
file server, e.g.:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

For the Game 1 Practice Lab's editable C terminal blocks, use the included
localhost-only study server instead:

    python3 tools/dev-server.py

Then open http://127.0.0.1:8018/game1-practice.html. The server compiles
and runs the code you enter on your own machine, so use it only for this
trusted local checkout.

### One-click macOS terminal

The GitHub Pages Practice Lab has a **Start local terminal** button. It uses
the ecen224-terminal:// URL scheme, which macOS only recognizes after this
one-time setup from a trusted local checkout:

    zsh tools/macos-launcher/build.sh
    open "tools/macos-launcher/build/ECEn 224 Terminal.app"

The first launch automatically finds this checkout; if the app is moved later,
it asks you to select the course folder. After that, the GitHub Pages button
starts the localhost-only runner and opens the interactive practice page.
