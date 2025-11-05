import axios from 'axios';

export type APIProvider = 'openai' | 'claude';
export interface APIProviderConfig {
  provider: APIProvider;
  apiKey: string;
  model?: string;
}

export interface ATSFormatCheck {
  isATSFormat: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
}

export interface CVAdaptationResult {
  adaptedCV: string;
  latexCode: string;
  changes: string[];
  highlightedSkills: string[];
}

class APIService {
  private config: APIProviderConfig | null = null;

  setConfig(config: APIProviderConfig) {
    this.config = config;
  }

  async checkATSFormat(cvText: string): Promise<ATSFormatCheck> {
    if (!this.config) {
      throw new Error('API configuration not set');
    }

    const prompt = `Analyze the following CV/resume text and determine if it's in ATS (Applicant Tracking System) format. 
    ATS-friendly resumes should:
    1. Use standard section headings (Experience, Education, Skills, etc.)
    2. Avoid tables, columns, graphics, or complex formatting
    3. Use simple, keyword-rich text
    4. Have clear, chronological work history
    5. Use standard fonts and formatting
    
    CV Text:
    ${cvText}
    
    Respond in JSON format with:
    {
      "isATSFormat": boolean,
      "score": number (0-100),
      "issues": [list of issues found],
      "suggestions": [list of suggestions to improve ATS compatibility]
    }`;

    const response = await this.callAPI(prompt);
    return this.parseATSResponse(response);
  }

  async adaptCVToJob(cvText: string, jobDescription: string): Promise<CVAdaptationResult> {
    if (!this.config) {
      throw new Error('API configuration not set');
    }

    const prompt = `Compare the following CV with the job description and create an adapted version that highlights relevant skills and experiences.

    Original CV:
    ${cvText}

    Job Description:
    ${jobDescription}

    Create an adapted CV that:
    1. Highlights skills and experiences most relevant to the job
    2. Reorders sections to emphasize relevant qualifications
    3. Adds relevant keywords from the job description naturally
    4. Maintains ATS-friendly format
    5. Generates LaTeX code for the adapted CV

    Respond in JSON format with:
    {
      "adaptedCV": "the adapted CV text",
      "latexCode": "complete LaTeX document code for the CV",
      "changes": ["list of key changes made"],
      "highlightedSkills": ["list of skills that were highlighted"]
    }`;

    const response = await this.callAPI(prompt);
    return this.parseAdaptationResponse(response);
  }

  private async callAPI(prompt: string): Promise<string> {
    if (!this.config) {
      throw new Error('API configuration not set');
    }

    if (this.config.provider === 'openai') {
      return this.callOpenAI(prompt);
    } else {
      return this.callClaude(prompt);
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    if (!this.config) {
      throw new Error('API configuration not set');
    }

    const model = this.config.model || 'gpt-4-turbo-preview';
    
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional CV/resume analyzer and adapter. Always respond with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      throw new Error(`OpenAI API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  private async callClaude(prompt: string): Promise<string> {
    if (!this.config) {
      throw new Error('API configuration not set');
    }

    const model = this.config.model || 'claude-3-5-sonnet-20241022';
    
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: model,
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          system: 'You are a professional CV/resume analyzer and adapter. Always respond with valid JSON.'
        },
        {
          headers: {
            'x-api-key': this.config.apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.content[0].text;
    } catch (error: any) {
      throw new Error(`Claude API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  private parseATSResponse(response: string): ATSFormatCheck {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          isATSFormat: parsed.isATSFormat ?? false,
          score: parsed.score ?? 0,
          issues: parsed.issues ?? [],
          suggestions: parsed.suggestions ?? []
        };
      }
      throw new Error('No JSON found in response');
    } catch (error) {
      console.error('Error parsing ATS response:', error);
      // Return a default response if parsing fails
      return {
        isATSFormat: false,
        score: 0,
        issues: ['Failed to parse API response'],
        suggestions: ['Please check the API response format']
      };
    }
  }

  private parseAdaptationResponse(response: string): CVAdaptationResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          adaptedCV: parsed.adaptedCV || '',
          latexCode: parsed.latexCode || this.generateDefaultLaTeX(parsed.adaptedCV || ''),
          changes: parsed.changes || [],
          highlightedSkills: parsed.highlightedSkills || []
        };
      }
      throw new Error('No JSON found in response');
    } catch (error) {
      console.error('Error parsing adaptation response:', error);
      return {
        adaptedCV: '',
        latexCode: this.generateDefaultLaTeX(''),
        changes: ['Failed to parse API response'],
        highlightedSkills: []
      };
    }
  }

  private generateDefaultLaTeX(cvText: string): string {
    // Escape special LaTeX characters in the CV text
    const escapedText = cvText
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/#/g, '\\#')
      .replace(/\$/g, '\\$')
      .replace(/%/g, '\\%')
      .replace(/&/g, '\\&')
      .replace(/\^/g, '\\textasciicircum{}')
      .replace(/_/g, '\\_')
      .replace(/~/g, '\\textasciitilde{}');

    return `\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{classic}
\\moderncvcolor{blue}

\\usepackage[utf8]{inputenc}
\\usepackage[scale=0.75]{geometry}
\\usepackage[T1]{fontenc}

% Personal Data
\\name{Your}{Name}
\\address{Your Address}
\\phone[mobile]{+1~(234)~567~890}
\\email{your.email@example.com}

\\begin{document}
\\makecvtitle

\\section{Professional Summary}
${escapedText.split('\\n').slice(0, 3).join('\\n\\par')}

\\section{Experience}
${escapedText}

\\section{Education}
% Add your education here

\\section{Skills}
% Add your skills here

\\end{document}`;
  }
}

export const apiService = new APIService();
