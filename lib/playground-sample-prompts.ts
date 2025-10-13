// Sample prompts for playground quick actions
// These demonstrate various markdown formatting capabilities

export const samplePrompts = [
  {
    id: 'text-formatting',
    label: 'Text Formatting',
    prompt: 'Show me examples of text formatting including headings, bold, italic, and lists',
    response: `# Text Formatting Examples

## Basic Formatting

Here's a paragraph with **bold text** and _italic text_ for emphasis. You can also combine them as **_bold italic_**.

### Lists

#### Numbered List:
1. First item
2. Second item
3. Third item

#### Bullet List:
- Point one
- Point two
- Point three with **bold**
- Point four with _italic_

---

> **Important**: This is a blockquote showing important information.`,
  },
  {
    id: 'code-examples',
    label: 'Code Examples',
    prompt: 'Generate a Python function with proper code highlighting',
    response: `# Code Examples

## Python Function

Here's a Python function with syntax highlighting:

\`\`\`python
def calculate_fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

# Example usage
result = calculate_fibonacci(10)
print(f"The 10th Fibonacci number is: {result}")
\`\`\`

## Inline Code

You can use inline code like \`variable_name\` or \`function_call()\` within sentences.`,
  },
  {
    id: 'json-output',
    label: 'JSON Output',
    prompt: 'Show me a JSON API response with structured data',
    response: `# API Response Example

Here's a typical API response in JSON format:

\`\`\`json
{
  "status": "success",
  "data": {
    "user": {
      "id": 12345,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    },
    "permissions": [
      "read",
      "write",
      "delete"
    ],
    "metadata": {
      "lastLogin": "2024-10-13T10:30:00Z",
      "sessionTimeout": 3600,
      "preferences": {
        "theme": "dark",
        "language": "en"
      }
    }
  },
  "timestamp": "2024-10-13T10:35:00Z",
  "requestId": "req_abc123xyz"
}
\`\`\`

The JSON above is collapsible for better readability.`,
  },
  {
    id: 'tables',
    label: 'Data Tables',
    prompt: 'Create a comparison table with performance metrics',
    response: `# Performance Comparison

## Model Benchmarks

| Model | Latency (ms) | Throughput (req/s) | Cost per 1M tokens | Accuracy (%) |
|-------|-------------|-------------------|-------------------|--------------|
| GPT-4 | 250 | 120 | $30 | 95.2 |
| Claude 3 | 220 | 145 | $25 | 94.8 |
| Llama 3 | 180 | 180 | $15 | 92.5 |
| Qwen 3 | 200 | 160 | $18 | 93.7 |

### Key Observations:

> Qwen 3 offers the best balance between performance and cost, making it ideal for production workloads.`,
  },
  {
    id: 'math-latex',
    label: 'Math & LaTeX',
    prompt: 'Explain the quadratic formula with LaTeX rendering',
    response: `# Mathematical Equations

## Quadratic Formula

The solutions to a quadratic equation $ax^2 + bx + c = 0$ are given by:

$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

## Other Common Formulas

### Pythagorean Theorem
$$a^2 + b^2 = c^2$$

### Einstein's Mass-Energy Equivalence
$$E = mc^2$$

### Euler's Identity
$$e^{i\\pi} + 1 = 0$$

This is considered one of the most beautiful equations in mathematics!`,
  },
  {
    id: 'error-handling',
    label: 'Error Messages',
    prompt: 'Show me how errors and warnings are displayed',
    response: `# Error Handling Examples

## System Errors

Error: Connection timeout - Unable to reach the API server after 30 seconds.

## Common Issues

### Authentication Error
Error: Invalid API key provided. Please check your credentials and try again.

### Rate Limit
Error: Rate limit exceeded. Maximum 100 requests per minute allowed.

## Normal Messages

Success! Your request has been processed successfully.

> **Note**: Errors are automatically highlighted with red styling for better visibility.`,
  },
  {
    id: 'comprehensive',
    label: 'Comprehensive Example',
    prompt: 'Show me a complete example with all formatting types',
    response: `# Comprehensive Markdown Example

## Overview

This example demonstrates **all formatting capabilities** available in the playground.

### Basic Text Formatting

Regular paragraph with **bold text**, _italic text_, and **_bold italic_** text. You can also use inline code like \`variable_name\` within sentences.

### Lists and Structure

#### Todo List:
1. **Install dependencies** using npm or yarn
2. _Configure environment_ variables
3. Run the application
   - Development mode: \`npm run dev\`
   - Production build: \`npm run build\`

### Code Examples

\`\`\`javascript
// JavaScript example with syntax highlighting
async function fetchData(apiKey) {
  try {
    const response = await fetch('https://api.example.com/data', {
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
\`\`\`

### JSON Response

\`\`\`json
{
  "result": "success",
  "data": {
    "items": [
      {"id": 1, "name": "Item 1"},
      {"id": 2, "name": "Item 2"}
    ]
  },
  "metadata": {
    "count": 2,
    "page": 1
  }
}
\`\`\`

### Performance Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Latency | 320ms | ✓ Good |
| Throughput | 150 req/s | ✓ Excellent |
| Error Rate | 0.01% | ✓ Great |

### Mathematical Formulas

The area of a circle is calculated using:

$$A = \\pi r^2$$

### Important Notes

> **Observation**: All formatting is applied automatically based on the markdown syntax used in the response.

> **Tip**: Use code blocks with language tags for proper syntax highlighting.

### Links and References

For more information, visit [OpenAI Documentation](https://platform.openai.com/docs) or [Anthropic Claude](https://www.anthropic.com/claude).

---

## Summary

This example covered:
- Headings (H1, H2, H3)
- Text formatting (bold, italic)
- Lists (numbered, bullets)
- Code blocks with syntax highlighting
- JSON output with collapsible view
- Tables with data
- Math equations with LaTeX
- Blockquotes
- Links
- Horizontal rules`,
  },
];

// Get sample prompt by ID
export function getSamplePrompt(id: string) {
  return samplePrompts.find(prompt => prompt.id === id);
}

// Get all sample prompts
export function getAllSamplePrompts() {
  return samplePrompts;
}

