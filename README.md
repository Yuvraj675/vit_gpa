# VIT CGPA & GPA Calculator 🧮

A user-friendly web tool designed for VIT students to easily calculate their Semester GPA and update their overall CGPA. It features persistent storage to save your data, so you never lose your input on a page refresh.

![App Screenshot](preview.png)


---

## Features

-   **GPA Calculator:** Calculate your Grade Point Average (GPA) for any semester by entering the credits and grades for each subject.
-   **CGPA Calculator:** Easily update your Cumulative Grade Point Average (CGPA) by providing your previous CGPA, total earned credits, and the new semester's results.
-   **Persistent Storage:** Your form inputs are automatically saved in your browser. If you refresh the page or accidentally close the tab, your data will be right where you left it.

---

## How to Use

### Live Demo

The easiest way to use the calculator is via the live link:
**[➡️ Click here to use the calculator!](https://vit-gpa.netlify.app/)**

### Local Usage

If you want to run the project locally:
1.  Clone this repository to your machine.
2.  Open the `index.html` file in your web browser.

---

## Key Functionality Explained

-   **Calculation Logic:** The GPA and CGPA are calculated based on VIT's academic regulations. The tool handles the grade-to-point conversion and credit-weighted calculations automatically.
-   **Persistent Storage:** The tool uses the browser's `localStorage` API to save all the data you enter in the form fields. This data is retrieved and repopulated into the form every time you open or refresh the page.

---

## Technologies Used

-   **HTML5:** For the structure of the application.
-   **CSS3:** For styling and making the interface user-friendly.
-   **JavaScript:** For all the calculation logic and interactivity.
-   **localStorage API:** To enable persistent storage of data on the user's browser.

---
