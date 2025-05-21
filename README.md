# Vision MCP Server

A Model Context Protocol (MCP) server that provides vision capabilities using the OpenAI API.

## Overview

This server implements the Model Context Protocol with tools for:

- Image analysis using GPT-4o vision capabilities

## Prerequisites

- Node.js (version 18 or higher)
- OpenAI API key

## Installation

Clone the repository and install dependencies:

\`\`\`bash
npm install
\`\`\`

## Usage

Run the server with your OpenAI API key:

\`\`\`bash
node server.js --openai-api-key=your_openai_api_key_here
\`\`\`

Alternatively, you can set your OpenAI API key as an environment variable:

\`\`\`bash
export OPENAI_API_KEY=your_openai_api_key_here
node server.js
\`\`\`

Connecting as an MCP Extension
To connect this server as an MCP extension, add the following configuration to your client:

\`\`\`json
"vision-mcp": {
  "command": "node",
  "args": [
    "path/to/vision-mcp/server.js",
    "--stdio",
    "--openai-api-key=OPENAI_API_KEY"
  ]
}
\`\`\`

## Tools

### Analyze Image Tool

Analyzes images using OpenAI's GPT-4o vision model.

Input:
- \`imagePath\`: Path to the image file on the host system

Output:
- Detailed description of the image content

## Development

This project uses the Model Context Protocol SDK for NodeJS to build the server.

## License

[MIT License](LICENSE)