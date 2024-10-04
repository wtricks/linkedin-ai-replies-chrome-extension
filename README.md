# LinkedIn AI Button Chrome Extension

This Chrome extension injects an AI button into message input boxes on LinkedIn. The AI button allows users to generate AI-powered responses, insert them into message inputs, and manage modals for generating and inserting dynamic text.

## Features

- **AI Button Injection:** Automatically adds an AI button to each LinkedIn message input.
- **AI Modal:** Opens a modal to generate AI responses and inserts them into the message.
- **Dynamic Text Insertion:** Adds AI-generated text to focused message input fields.
- **Multiple Message Inputs Support:** Works seamlessly with multiple message input boxes on LinkedIn.
- **Focus Management:** Ensures the message input is focused when inserting AI-generated responses.

## Prerequisites

- Node.js (v16+)
- pnpm package manager

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/wtricks/linkedin-ai-replies-chrome-extension.git
   ```

2. Navigate to the project folder:

   ```bash
   cd linkedin-ai-replies-chrome-extension
   ```

3. Install dependencies using pnpm:

   ```bash
   pnpm install
   ```

## Running the Extension

To run the extension in development mode:

```bash
pnpm dev
```

This will start the development server.

## Loading the Extension in Chrome

1. Go to `chrome://extensions/` in Chrome.
2. Enable **Developer Mode**.
3. Click on **Load unpacked** and select the `.output` directory from your project.

## How It Works

The extension periodically checks for message input fields (every 1 second) and injects an AI button into each input field. When a user clicks the AI button, a modal appears, allowing them to generate AI responses and insert them into the message input.

## Scripts

- `pnpm dev`: Starts the development server.

## License

This project is licensed under the MIT License.
