
**Chunking** is a productivity web app designed to help users break down large goals into smaller, manageable tasks. By visualizing progress and leveraging AI-powered chat, Chunking helps prevent overwhelm and keeps you motivated.

## Features

- **Project Management:**  
	Create, track, and complete projects with customizable goals and checklists.
- **Notes Mangement:**
	Create notes for you save anything you want to remember,edit the saved note, and delete if you prefer not to save it.

- **Task Progression:**  
	Move projects from "Current" to "Finished" automatically as you complete all tasks.

- **AI Assistant:**  
	Integrated OpenAI-powered chat to answer questions, summarize information, and provide productivity tips using Markdown formatting.

- **Modern UI:**  
	Responsive, dark-themed interface with a sidebar, chat area, and popups for project goals.

- **Rich Markdown Support:**  
	AI responses and project goals are rendered with Markdown for better readability.

## Tech Stack

- **Frontend:** React 19, Vite
- **Routing:** React Router DOM
- **AI Integration:** OpenAI API (chat completions)
- **Markdown Rendering:** react-markdown
- **State Management:** React hooks
- **Styling:** Custom CSS (dark/red theme)

## Getting Started

1. **Install dependencies:**
	 ```bash
	 npm install
	 ```

2. **Set up your OpenAI API key:**
	 - Create a `.env` file in the project root.
	 - Add your key:
		 ```
		 VITE_OPENAI_API_KEY=your_openai_key_here
		 ```

3. **Run the development server:**
	 ```bash
	 npm run dev
	 ```

4. **Build for production:**
	 ```bash
	 npm run build
	 ```

## Usage

- **Create a Project:**  
	Use the sidebar to add a new project, set goals, and select checklist items.

- **Track Progress:**  
	Check off tasks as you complete them. Projects automatically move to "Finished" when all tasks are done.

- **View Goals:**  
	Click "View Goals" on any project to see its objectives in a popup, with preserved formatting.

- **Chat with AI:**  
	Use the chat area to ask questions about productivity, chunking, or your tasks. The AI responds with formatted Markdown.

## Folder Structure

```
src/
	componets/
		Tasks.jsx         # Main project/task manager and chat
		Learnmore.jsx     # Info and AI chat about chunking
		...               # Other components
	style/
		tasks.css         # Main styles (dark/red theme)
		...               # Other styles
public/
	index.html
```

## Contributing

Pull requests and suggestions are welcome! Please open an issue to discuss changes or improvements.

## License

This project is licensed under the MIT License.
