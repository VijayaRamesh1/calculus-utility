# Content Creation Guide

## Content Structure

All content is stored in JSON files in the `js/content/topics/` directory. Each topic has its own JSON file with the following structure:

```json
{
    "title": "Topic Title",
    "description": "Brief description of the topic",
    "sections": [
        {
            "title": "Section Title",
            "content": "Section content..."
        }
    ],
    "examples": [
        {
            "title": "Example Title",
            "problem": "Problem statement...",
            "solution": "Solution steps..."
        }
    ]
}
```

## Writing Guidelines

- Use clear, concise language
- Include relevant examples
- Break complex concepts into smaller, digestible parts
- Use mathematical notation where appropriate (will be rendered using KaTeX)
- Include references to other related topics where relevant

## Adding a New Topic

1. Create a new JSON file in the appropriate directory under `js/content/topics/`
2. Create a new HTML page in the appropriate directory under `calculus/`
3. Update the navigation links as needed
4. Create any needed visualizations
