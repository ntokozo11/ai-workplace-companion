# AI Workplace Companion

# AI-Powered Workplace Productivity Assistant — Lovable Build Prompt



Build a complete, modern, responsive web application called **“AI Workplace Productivity Assistant”**.



This is a front-end AI productivity application designed to help professionals automate everyday workplace tasks. The application must demonstrate practical use of AI, effective prompt engineering, responsible AI use, and a professional user experience.



## IMPORTANT DEVELOPMENT REQUIREMENTS



* Build the application as a **front-end application only**.

* **Do NOT create or use a backend database.**

* Do NOT add Supabase, Firebase, MongoDB, PostgreSQL, MySQL, or any other database.

* Do NOT create user authentication or account registration.

* Do NOT require users to log in.

* Do NOT store personal user information permanently.

* Use local component state and temporary browser/local state only where necessary.

* The application must work immediately when opened.

* AI features must produce **real, meaningful AI-generated responses**, not placeholder text or generic hard-coded responses.

* If an AI API integration is required, structure it so that the application can connect to an AI API securely without creating a database.

* Never expose a secret API key directly in the client-side source code.

* Include loading states, error handling, and empty states for all AI features.



# DESIGN AND BRANDING



Use a consistent professional SaaS-style design.



### Required colour palette:



* Light blue as the primary colour.

* White as the main background.

* Dark grey for text, navigation elements, and important UI components.

* Use subtle light-blue backgrounds and borders.

* Avoid excessive colours.



The interface should look clean, modern, professional, and suitable for a workplace environment.



### Typography:



* Use **ONE consistent font throughout the entire application**.

* Use different font weights and sizes for hierarchy, but never switch between different font families.



### UI style:



* Clean cards.

* Rounded corners.

* Subtle shadows.

* Professional icons.

* Good spacing.

* Clear visual hierarchy.

* Modern buttons.

* Accessible contrast.

* Smooth but subtle transitions.

* Avoid excessive animations.



# APPLICATION STRUCTURE



Create a dashboard application with the following structure:



## 1. SIDEBAR NAVIGATION



Create a responsive sidebar containing:



* Logo / application name

* Dashboard

* AI Task Planner

* AI Research Assistant

* AI Workplace Chatbot

* About / Responsible AI



On desktop, display a full sidebar.



On mobile, convert the sidebar into a hamburger menu/drawer.



The currently selected page should be visually highlighted.



At the bottom of the sidebar include:



**AI Workplace Productivity Assistant**



“Work smarter. Plan better. Research faster.”



# 2. DASHBOARD



Create a professional dashboard homepage.



Include:



### Welcome section



Display:



**Good evening! 👋**



**Your AI Workplace Productivity Assistant**



Subtitle:



“Use AI to plan your work, research information, and get practical workplace assistance.”



### Productivity overview cards



Create cards showing:



* Tasks Planned

* High Priority Tasks

* Research Requests

* AI Conversations



These values can be based on the current browser session and do not need to be stored in a database.



### Quick Action section



Create three large action cards:



**Plan My Day**

“Create an organised schedule based on your tasks and priorities.”



Button: **Start Planning**



**Research a Topic**

“Summarise information and generate useful workplace insights.”



Button: **Start Research**



**Ask the AI Assistant**

“Get practical answers to workplace questions.”



Button: **Open Chat**



### Recent Activity



Display temporary session activity such as:



* Task plan generated

* Research completed

* AI question answered



If there is no activity, display a professional empty state.



# 3. AI TASK PLANNER



Create a fully functional AI Task Planner.



The user should be able to enter workplace tasks.



Include fields such as:



### Task description



Large text area where the user can enter multiple tasks.



Example:



“Finish the monthly report, respond to client emails, prepare for tomorrow's meeting, update the project spreadsheet and review the team's progress.”



### Optional settings



Include:



* Work start time

* Work end time

* Break duration

* Planning date

* Priority preference



Allow the user to choose:



* High

* Medium

* Low



Include a button:



**Generate My Schedule**



When clicked, send a structured AI prompt that asks the AI to:



1. Identify all tasks.

2. Determine task priority.

3. Estimate realistic completion time.

4. Arrange tasks logically.

5. Consider deadlines and importance.

6. Include reasonable breaks.

7. Avoid unrealistic scheduling.

8. Explain why high-priority tasks were placed first.



### AI OUTPUT



Display the generated schedule in a professional timeline/table.



Each task should show:



* Task name

* Priority

* Suggested time

* Estimated duration

* Reason for priority



Use visual priority indicators:



* High

* Medium

* Low



Include buttons:



* Edit

* Regenerate

* Copy Schedule

* Clear



The AI output must be editable by the user.



Include a section:



**AI Planning Notes**



where the AI explains the reasoning behind the schedule.



# 4. AI RESEARCH ASSISTANT



Create a functional AI Research Assistant.



The user should be able to enter a topic, question, or article text.



Include:



### Research topic



Example:



“Explain how artificial intelligence is changing workplace productivity.”



Include a larger text area.



Add a research depth selector:



* Quick Overview

* Standard

* Detailed



Add a button:



**Research with AI**



The AI should provide a useful, structured response.



### AI RESPONSE STRUCTURE



Display:



**Summary**



A concise explanation of the topic.



**Key Findings**



Important points presented as bullet points.



**Workplace Insights**



Explain how the information applies to a professional workplace.



**Recommendations**



Provide practical recommendations.



**Potential Risks / Limitations**



Identify uncertainty, limitations, or areas requiring verification.



**Sources / Verification**



If external sources are actually available through the implemented AI/search integration, show them clearly.



If no external source retrieval is available, clearly state:



“AI-generated information should be independently verified before being used for important decisions.”



Do not invent citations or sources.



Include:



* Copy

* Edit

* Regenerate

* Clear



The response must be generated dynamically by AI based on the user's actual research question.



# 5. AI WORKPLACE CHATBOT



Create a fully functional AI chatbot interface.



This must NOT simply display pre-written generic answers.



The chatbot must respond dynamically to the user's actual message.



The interface should look similar to a modern professional AI chat application.



### Chat interface



Include:



* Conversation area

* User messages

* AI messages

* Message timestamps

* Loading indicator while AI is responding

* Text input

* Send button

* Clear conversation button



The user should be able to ask workplace questions such as:



“What is the best way to prepare for a team meeting?”



“How should I prioritise competing deadlines?”



“Help me write a professional email requesting an extension.”



“What can I do to improve productivity during a busy workday?”



The AI should understand the user's message and provide a relevant, practical response.



### Chatbot system behaviour



Configure the AI as a professional workplace productivity assistant.



The AI should:



* Give clear and useful answers.

* Ask clarifying questions when necessary.

* Provide step-by-step guidance where appropriate.

* Help with workplace planning.

* Help draft professional communication.

* Help organise ideas.

* Help analyse workplace problems.

* Avoid pretending to know information it does not know.

* Clearly identify uncertainty.

* Avoid making important legal, financial, medical, or HR decisions on behalf of the user.

* Encourage appropriate professional verification for high-stakes matters.



The chatbot should maintain the current conversation context during the active browser session so that follow-up questions make sense.



# 6. PROMPT ENGINEERING



Use structured prompts behind each AI feature.



Do not simply send the user's text directly to the AI.



Each feature should have a dedicated system instruction that defines:



* AI role

* Task objective

* User input

* Required output format

* Tone

* Accuracy expectations

* Safety requirements



For example, the Task Planner should instruct the AI to return structured scheduling information rather than an unorganised paragraph.



The Research Assistant should return clearly separated sections.



The Chatbot should behave as a professional workplace assistant.



# 7. RESPONSIVE DESIGN



The entire application must be responsive.



### Desktop:



* Fixed/collapsible sidebar.

* Main content area.

* Multi-column dashboard cards.

* Spacious professional layout.



### Tablet:



* Adapt cards and content appropriately.

* Maintain readable spacing.



### Mobile:



* Hamburger navigation.

* Single-column cards.

* Full-width inputs.

* Chat interface optimised for mobile.

* Tables/timelines should become mobile-friendly cards where necessary.

* Buttons must remain easy to tap.

* No horizontal overflow.



Test the layout conceptually for desktop, tablet, and mobile screen sizes.



# 8. INPUT AND OUTPUT EXPERIENCE



Every AI page must clearly separate:



**USER INPUT**



from



**AI-GENERATED OUTPUT**



Use cards or panels to make the distinction obvious.



While AI is generating a response, display a professional loading state such as:



“AI is analysing your request…”



Do not freeze the interface.



If the AI request fails, show a helpful error message such as:



“We couldn't generate a response right now. Please check your connection and try again.”



Provide a **Try Again** button.



# 9. EDITABLE AI OUTPUTS



AI-generated results must not be locked.



Allow users to:



* Edit generated text.

* Copy results.

* Regenerate responses.

* Clear results.



For schedules, allow individual task details to be edited.



# 10. RESPONSIBLE AI



Create a dedicated **Responsible AI** section accessible from the sidebar.



Explain that:



* AI-generated content may contain mistakes.

* Users should verify important information.

* AI should support human decision-making rather than replace appropriate human judgement.

* Sensitive personal or confidential company information should not be entered into the application.

* AI responses should be reviewed before being used professionally.

* The system should not be treated as a substitute for qualified legal, medical, financial, HR, or other professional advice.



Add a small disclaimer in the footer of the application:



**“AI-generated content may contain errors. Review and verify important information before using it for workplace decisions.”**



# 11. ACCESSIBILITY



Make the application accessible and professional.



Include:



* Proper labels for inputs.

* Keyboard-friendly navigation.

* Accessible buttons.

* Good colour contrast.

* Visible focus states.

* Meaningful error messages.

* Responsive text sizing.

* Icons should have accessible labels where necessary.



# 12. EMPTY STATES



Create professional empty states.



Examples:



Task Planner:



“No schedule created yet. Add your tasks above to generate an AI-powered plan.”



Research Assistant:



“Enter a topic or question to begin your research.”



Chatbot:



“Start a conversation with your AI Workplace Assistant.”



# 13. SAMPLE DATA



Do not rely on a database.



Where appropriate, provide example prompts or sample tasks that users can click to populate the input fields.



Example Task Planner data:



* Complete monthly report

* Respond to client emails

* Prepare presentation

* Attend team meeting

* Review project progress



Example Research topic:



“How can AI improve productivity in modern workplaces?”



Example chatbot prompts:



* “Help me prioritise my workload.”

* “Help me prepare for a team meeting.”

* “Draft a professional email.”

* “Give me strategies for managing deadlines.”



# 14. TECHNICAL REQUIREMENTS



Build a polished working application rather than a static mock-up.



Use reusable components where appropriate.



Ensure:



* Navigation works.

* Buttons work.

* Forms work.

* AI requests work.

* Loading states work.

* Error states work.

* Copy buttons work.

* Clear buttons work.

* Edit functionality works.

* Mobile navigation works.

* Chat conversation works.

* Session data is handled only temporarily in the browser.



**DO NOT ADD A BACKEND DATABASE.**



The project must remain simple enough to demonstrate and explain as a student project.



# 15. FINAL QUALITY CHECK



Before considering the application complete, verify that:



1. The dashboard works.

2. Sidebar navigation works.

3. Task Planner generates actual AI responses.

4. Research Assistant generates actual AI responses.

5. Chatbot gives actual contextual AI responses.

6. AI responses are based on the user's input.

7. AI outputs can be edited.

8. Users can copy generated content.

9. Loading and error states work.

10. The application works

 on mobile and desktop.

11. The entire application uses one consistent font.

12. The colour scheme consistently uses light blue, white, and dark grey.

13. There is no backend database.

14. There is no login requirement.

15. There are no fake AI responses presented as real AI.

16. Responsible AI guidance is clearly visible.

17. The overall interface looks like a professional modern SaaS productivity application.



The final result should feel like a **real AI-powered workplace productivity product**, not simply a collection of static pages.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3bec43dd-fd91-4342-b0ff-485d410eddf2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
