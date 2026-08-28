# AI Workplace Companion

# AI-Powered Workplace Productivity Assistant

## Project Overview

The **AI-Powered Workplace Productivity Assistant** is a web application designed to help professionals improve workplace productivity by using Artificial Intelligence (AI) to automate common tasks.

The application provides three main AI-powered tools: an **AI Task Planner**, an **AI Research Assistant**, and an **AI Workplace Chatbot**. These features help users organise their workload, research workplace topics, and receive practical responses to workplace-related questions.

The application has a modern and professional interface using **light blue, white, and dark grey** as the main colours. It is designed to be responsive and accessible on both desktop and mobile devices.

The project does **not use a backend database or user authentication**. User information and AI-generated results are handled temporarily within the application.

---

## Features Implemented

### AI Task Planner / Scheduler

The AI Task Planner helps users organise their daily workload.

Users can enter their tasks and provide information such as:

* Task descriptions
* Work start and end times
* Break duration
* Planning date
* Task priorities

The AI analyses the provided tasks and generates a structured schedule containing:

* Task name
* Priority level
* Suggested time
* Estimated duration
* Reason for prioritisation
* AI planning notes

Users can also edit, copy, regenerate, and clear the generated schedule.

### AI Research Assistant

The AI Research Assistant allows users to research workplace topics and questions.

Users can enter a topic or question and select the desired research depth.

The AI provides:

* Summary
* Key findings
* Workplace insights
* Recommendations
* Potential risks and limitations
* Verification guidance

The generated research can be edited, copied, regenerated, or cleared.

### AI Workplace Chatbot

The AI Workplace Chatbot provides real AI-generated responses to user questions.

The chatbot can assist with:

* Managing workloads
* Prioritising tasks
* Preparing for meetings
* Managing deadlines
* Improving productivity
* Organising workplace activities
* Drafting professional communication

The chatbot uses the user's actual message to generate a relevant response rather than displaying only pre-written answers.

### Responsive Dashboard

The application includes a professional dashboard containing:

* Welcome section
* Productivity overview
* Quick action buttons
* Recent activity
* Navigation to AI features

### Responsive Sidebar Navigation

The sidebar provides access to:

* Dashboard
* AI Task Planner
* AI Research Assistant
* AI Workplace Chatbot
* Responsible AI

The sidebar changes to a mobile-friendly menu on smaller screens.

### Editable AI Outputs

Users can:

* Edit AI-generated content
* Copy responses
* Regenerate responses
* Clear results

### Responsible AI

The application includes a Responsible AI section explaining the importance of reviewing AI-generated information.

Users are reminded that AI-generated information may contain errors and that important information should be independently verified.

---

## Technologies and Tools Used

The project uses the following technologies and tools:

* **Lovable AI** – Used to assist with developing the web application.
* **React** – Used to build the user interface.
* **TypeScript** – Used for application development and type safety.
* **HTML5** – Used for structuring the application.
* **CSS3** – Used for styling.
* **Tailwind CSS** – Used for responsive and modern UI design.
* **AI Integration** – Used to generate responses for the productivity features.
* **Git** – Used for version control.
* **GitHub** – Used to host and manage the project repository.

---

## Setup Instructions

### 1. Clone the Repository

Clone the repository using Git:

```bash
git clone https://github.com/your-username/your-repository-name.git
```

### 2. Open the Project Folder

Navigate to the project directory:

```bash
cd your-repository-name
```

### 3. Install Dependencies

Install the required dependencies:

```bash
npm install
```

### 4. Configure AI Integration

If an AI API is required, configure the required API settings or environment variables.

**Do not place private API keys directly inside the source code.**

### 5. Start the Application

Run the development server:

```bash
npm run dev
```

### 6. Open the Application

Open the local development address provided in the terminal, for example:

```text
http://localhost:5173
```

The application should now be available in the web browser.

---

## Responsive Design

The application supports:

* Desktop computers
* Laptops
* Tablets
* Mobile phones

The interface automatically adjusts the layout, navigation, cards, forms, and AI output sections according to the screen size.

---

## Responsible AI Disclaimer

> **AI-generated content may contain errors. Users should review and verify important information before using it for workplace decisions.**

The application is designed to support human decision-making and should not replace qualified professional advice in areas such as legal, financial, medical, or specialised HR matters.

---

## Project Structure

```text
AI-Workplace-Productivity-Assistant/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.tsx
│
├── public/
│
├── package.json
├── README.md
└── ...
```

---

## Author

Ntokozo Sithole

---

## Project Purpose

This project demonstrates the practical application of Artificial Intelligence in a workplace environment.

The main objectives are to:

* Implement AI in a practical solution.
* Apply prompt engineering techniques.
* Solve real-world workplace productivity problems.
* Demonstrate responsible and ethical AI use.
* Develop a modern user-friendly interface.
* Create a responsive web application.
* Use Git and GitHub for version control.

