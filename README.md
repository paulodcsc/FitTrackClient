# CV/Resume ATS Optimizer

A modern web application that helps you optimize your CV/resume for Applicant Tracking Systems (ATS) and adapt it to specific job descriptions. Built with React, TypeScript, and Vite.

## Features

1. **ATS Format Checking**: Upload your CV and get an instant analysis of its ATS compatibility
   - ATS compatibility score (0-100)
   - Identified issues and formatting problems
   - Actionable suggestions for improvement

2. **CV Adaptation**: Compare your CV with a job description and get an optimized version
   - Highlights relevant skills and experiences
   - Reorders sections to emphasize qualifications
   - Adds relevant keywords naturally
   - Maintains ATS-friendly format

3. **LaTeX Generation**: Get professionally formatted LaTeX code for your adapted CV
   - Complete LaTeX document ready to compile
   - Preview the LaTeX code
   - Download the .tex file

4. **Multi-Provider Support**: Works with both OpenAI and Claude (Anthropic) APIs
   - Easy switching between providers
   - Configurable model selection

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- An API key from either:
  - [OpenAI](https://platform.openai.com/api-keys) (for GPT models)
  - [Anthropic](https://console.anthropic.com/) (for Claude models)

### Installation

1. Clone the repository and navigate to the project directory:
```bash
cd FitTrack
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Configure API**: Click the "Configure API" button in the top right and enter your API key
   - Select your provider (OpenAI or Claude)
   - Optionally specify a model (defaults are provided)
   - Save the configuration

2. **Upload CV**: 
   - Upload a text file containing your CV/resume, or
   - Paste your CV content directly into the text area

3. **Check ATS Format**: 
   - Click "Check ATS Format" to analyze your CV
   - Review the score, issues, and suggestions
   - Continue to adaptation when ready

4. **Adapt to Job Description**:
   - Paste the job description in the text area
   - Click "Adapt CV" to generate an optimized version
   - Wait for the AI to process and generate results

5. **Download Results**:
   - Review the generated LaTeX code
   - Check the highlighted skills and changes
   - Download the LaTeX file using the "Download LaTeX" button
   - Note: PDF compilation requires a LaTeX compiler (like Overleaf or local LaTeX installation)

## API Configuration

### OpenAI
- **Default Model**: `gpt-4-turbo-preview`
- **API Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Get API Key**: [OpenAI Platform](https://platform.openai.com/api-keys)

### Claude (Anthropic)
- **Default Model**: `claude-3-5-sonnet-20241022`
- **API Endpoint**: `https://api.anthropic.com/v1/messages`
- **Get API Key**: [Anthropic Console](https://console.anthropic.com/)

## Project Structure

```
src/
├── App.tsx              # Main application component
├── App.css              # Application styles
├── services/
│   └── apiService.ts    # API abstraction layer for OpenAI/Claude
├── types/
│   └── index.ts         # TypeScript type definitions
└── main.tsx             # Application entry point
```

## Technologies Used

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Axios**: HTTP client for API calls
- **Modern CSS**: Gradient designs and responsive layout

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Future Enhancements

- [ ] PDF compilation backend integration
- [ ] Support for more file formats (PDF, DOCX)
- [ ] CV templates library
- [ ] Save and load CV drafts
- [ ] Batch job description processing
- [ ] Advanced ATS optimization suggestions

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, please open an issue on the repository.# FitTrackClient
