# MathCapy+

**A Chrome Extension for Converting Screen-Captured Math Formulas into LaTeX**

## Overview

MathCapy+ is a Chrome extension that allows users to capture mathematical formulas directly from the screen and convert them into **LaTeX format automatically**.

When reading PDFs, slides, or online textbooks, copying mathematical expressions often breaks formatting or loses structure. MathCapy+ solves this problem by allowing users to **select a region containing a formula, run OCR recognition, and instantly obtain a clean LaTeX expression**.

The extension is designed to integrate smoothly with academic workflows, enabling users to paste the result directly into **LaTeX documents, Overleaf, or Markdown environments**.

---

## Features

* 🖱 **Region Selection**

  * Draw a selection box to capture formulas on the screen.

* 🔎 **Mathematical OCR Recognition**

  * Recognizes mathematical expressions using OCR tools (e.g., Mathpix).

* ✏️ **Automatic LaTeX Conversion**

  * Converts recognized formulas into valid LaTeX expressions.

* 📋 **Clipboard Integration**

  * Automatically copies the LaTeX expression to the clipboard.

* ⚙️ **Keyboard Shortcuts**

  * `Shift + C` → Capture formula
  * `Shift + V` → Paste LaTeX expression

* 📚 **Context-Aware Formatting**

  * Automatically wraps formulas with LaTeX math delimiters:

```latex
\( ... \)
```

so that the result can be pasted directly into LaTeX environments.

* 🚫 **Exclude Chemical Formulas**

  * Designed specifically for **mathematical expressions** rather than chemical formulas.

---

## Example Workflow

1. Open a PDF or webpage containing a formula.

2. Press:

```
Shift + C
```

3. Drag to select the formula.

Example input:

```
(x + y)^3 = x^3 + 3x^2y + 3xy^2 + y^3
```

4. MathCapy+ recognizes the formula and converts it into:

```latex
\( (x + y)^3 = x^3 + 3x^2y + 3xy^2 + y^3 \)
```

5. Press:

```
Shift + V
```

6. Paste directly into your LaTeX document.

---

## System Architecture

```
User Screen
     │
     ▼
Selection Tool
     │
     ▼
Screen Capture
(chrome.tabs.captureVisibleTab)
     │
     ▼
OCR Recognition
(Math OCR / AI model)
     │
     ▼
Formula Parsing
     │
     ▼
LaTeX Conversion
     │
     ▼
Clipboard Output
```

---

## Installation (Developer Mode)

1. Clone the repository

```bash
git clone https://github.com/yourname/mathcapy.git
```

2. Open Chrome Extensions

```
chrome://extensions
```

3. Enable **Developer Mode**

4. Click

```
Load unpacked
```

5. Select the project folder.

---

## Usage

### Capture Formula

```
Shift + C
```

Draw a selection box around the formula.

### Paste LaTeX

```
Shift + V
```

The recognized LaTeX will be pasted into the current input field.

---

## Project Structure (Example)

```
mathcapy/
│
├── manifest.json
├── background.js
├── content.js
├── capture.js
├── latex_converter.js
│
├── icons/
│   └── icon128.png
│
└── README.md
```

---

## Technologies

* **Chrome Extension API**
* `chrome.tabs.captureVisibleTab()`
* OCR (Mathpix)
* JavaScript
* LaTeX parsing

---

## Future Improvements

Planned features:

* Support **multi-line formulas**
* Improve **OCR accuracy for integrals and matrices**
* Add **formula preview panel**
* Support **direct Overleaf integration**
* Improve detection of **superscripts and subscripts**

---

## Motivation

MathCapy+ was created to solve a common problem for students and researchers:

> Mathematical expressions copied from PDFs often lose their structure and must be rewritten manually.

By combining **screen capture + OCR + LaTeX conversion**, this extension dramatically reduces the time required to transfer formulas into academic documents.
