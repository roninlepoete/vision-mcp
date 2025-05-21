import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from 'fs/promises';
import { OpenAI } from 'openai';
import path from 'path';

// Parse command line arguments
function getOpenAIKeyFromArgs() {
  const args = process.argv;
  for (const arg of args) {
    if (arg.startsWith('--openai-api-key=')) {
      return arg.split('=')[1];
    }
  }
  return process.env.OPENAI_API_KEY; // Fallback to environment variable
}

// Create OpenAI client with key from command line arguments
const openai = new OpenAI({
  apiKey: getOpenAIKeyFromArgs(),
});

// Create an MCP server
const server = new McpServer({
  name: "vision-mcp",
  version: "1.0.0"
});

// Add an addition tool
server.tool("add",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
  })
);

// Add image analysis tool
server.tool("analyzeImage",
  { imagePath: z.string().describe("Path to the image file on the host system") },
  async ({ imagePath }) => {
    try {
      // Read the image file
      const imageBuffer = await fs.readFile(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const mimeType = path.extname(imagePath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';

      // Send to OpenAI for analysis
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Describe this image in detail." },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                }
              }
            ]
          }
        ],
        max_tokens: 300,
      });

      return {
        content: [{ type: "text", text: response.choices[0].message.content }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error analyzing image: ${error.message}` }]
      };
    }
  }
);

// Add a dynamic greeting resource
// server.resource(
//   "greeting",
//   new ResourceTemplate("greeting://{name}", { list: undefined }),
//   async (uri, { name }) => ({
//     contents: [{
//       uri: uri.href,
//       text: `Hello, ${name}!`
//     }]
//   })
// );

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);