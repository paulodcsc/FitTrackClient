import { useState } from 'react';
import { apiService } from './services/apiService';
import type { APIProviderConfig, ATSFormatCheck, CVAdaptationResult } from './services/apiService';
import './App.css';

type ViewMode = 'upload' | 'ats-check' | 'adapt' | 'results';

function App() {
  const [apiConfig, setApiConfig] = useState<APIProviderConfig>({
    provider: 'openai',
    apiKey: '',
    model: ''
  });
  const [cvText, setCvText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('upload');
  const [atsResult, setAtsResult] = useState<ATSFormatCheck | null>(null);
  const [adaptationResult, setAdaptationResult] = useState<CVAdaptationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(true);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCvText(text);
      setViewMode('ats-check');
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleCheckATS = async () => {
    if (!cvText.trim()) {
      setError('Please upload a CV first');
      return;
    }

    if (!apiConfig.apiKey) {
      setError('Please configure your API key');
      setShowConfig(true);
      return;
    }

    setLoading(true);
    setError(null);
    apiService.setConfig(apiConfig);

    try {
      const result = await apiService.checkATSFormat(cvText);
      setAtsResult(result);
      setViewMode('adapt');
    } catch (err: any) {
      setError(err.message || 'Failed to check ATS format');
    } finally {
      setLoading(false);
    }
  };

  const handleAdaptCV = async () => {
    if (!cvText.trim() || !jobDescription.trim()) {
      setError('Please provide both CV and job description');
      return;
    }

    if (!apiConfig.apiKey) {
      setError('Please configure your API key');
      setShowConfig(true);
      return;
    }

    setLoading(true);
    setError(null);
    apiService.setConfig(apiConfig);

    try {
      const result = await apiService.adaptCVToJob(cvText, jobDescription);
      setAdaptationResult(result);
      setViewMode('results');
    } catch (err: any) {
      setError(err.message || 'Failed to adapt CV');
    } finally {
      setLoading(false);
    }
  };

  const downloadLaTeX = () => {
    if (!adaptationResult?.latexCode) return;

    const blob = new Blob([adaptationResult.latexCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'adapted-cv.tex';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    if (!adaptationResult?.latexCode) return;

    // For now, we'll download the LaTeX file
    // In a production environment, you'd compile this to PDF on a backend
    // or use a service like Overleaf API
    setError('PDF compilation requires backend service. LaTeX file downloaded instead.');
    downloadLaTeX();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>CV/Resume ATS Optimizer</h1>
        <p className="subtitle">Optimize your CV for ATS systems and job applications</p>
      </header>

      {showConfig && (
        <div className="config-panel">
          <div className="config-header">
            <h2>API Configuration</h2>
            <button className="close-btn" onClick={() => setShowConfig(false)}>×</button>
          </div>
          <div className="config-form">
            <div className="form-group">
              <label>API Provider</label>
              <select
                value={apiConfig.provider}
                onChange={(e) => setApiConfig({ ...apiConfig, provider: e.target.value as 'openai' | 'claude' })}
              >
                <option value="openai">OpenAI</option>
                <option value="claude">Claude (Anthropic)</option>
              </select>
            </div>
            <div className="form-group">
              <label>API Key</label>
              <input
                type="password"
                value={apiConfig.apiKey}
                onChange={(e) => setApiConfig({ ...apiConfig, apiKey: e.target.value })}
                placeholder="Enter your API key"
              />
            </div>
            <div className="form-group">
              <label>Model (Optional)</label>
              <input
                type="text"
                value={apiConfig.model}
                onChange={(e) => setApiConfig({ ...apiConfig, model: e.target.value })}
                placeholder={apiConfig.provider === 'openai' ? 'gpt-4-turbo-preview' : 'claude-3-5-sonnet-20241022'}
              />
            </div>
            <button className="save-btn" onClick={() => setShowConfig(false)}>Save & Close</button>
          </div>
        </div>
      )}

      {!showConfig && (
        <button className="config-toggle" onClick={() => setShowConfig(true)}>
          ⚙️ Configure API
        </button>
      )}

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <main className="app-main">
        {viewMode === 'upload' && (
          <div className="upload-section">
            <div className="upload-card">
              <h2>Upload Your CV/Resume</h2>
              <p>Upload your CV as a text file (.txt) or paste the content below</p>
              <input
                type="file"
                accept=".txt,.doc,.docx"
                onChange={handleFileUpload}
                className="file-input"
              />
              <div className="divider">OR</div>
              <textarea
                className="cv-textarea"
                placeholder="Paste your CV content here..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                rows={15}
              />
              {cvText && (
                <button className="primary-btn" onClick={handleCheckATS}>
                  Check ATS Format
                </button>
              )}
            </div>
          </div>
        )}

        {viewMode === 'ats-check' && atsResult && (
          <div className="ats-results">
            <div className="result-card">
              <h2>ATS Format Check Results</h2>
              <div className={`score-badge ${atsResult.isATSFormat ? 'pass' : 'fail'}`}>
                <span className="score-label">ATS Score</span>
                <span className="score-value">{atsResult.score}/100</span>
                <span className="score-status">
                  {atsResult.isATSFormat ? '✓ ATS-Friendly' : '✗ Needs Improvement'}
                </span>
              </div>
              
              {atsResult.issues.length > 0 && (
                <div className="issues-section">
                  <h3>Issues Found</h3>
                  <ul>
                    {atsResult.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {atsResult.suggestions.length > 0 && (
                <div className="suggestions-section">
                  <h3>Suggestions</h3>
                  <ul>
                    {atsResult.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="action-buttons">
                <button className="secondary-btn" onClick={() => setViewMode('upload')}>
                  ← Back
                </button>
                <button className="primary-btn" onClick={() => setViewMode('adapt')}>
                  Continue to Adaptation →
                </button>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'adapt' && (
          <div className="adapt-section">
            <div className="adapt-card">
              <h2>Adapt CV to Job Description</h2>
              <div className="job-description-input">
                <label>Job Description</label>
                <textarea
                  className="job-textarea"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={10}
                />
              </div>
              <div className="action-buttons">
                <button className="secondary-btn" onClick={() => setViewMode('ats-check')}>
                  ← Back
                </button>
                <button 
                  className="primary-btn" 
                  onClick={handleAdaptCV}
                  disabled={loading || !jobDescription.trim()}
                >
                  {loading ? 'Adapting CV...' : 'Adapt CV'}
                </button>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'results' && adaptationResult && (
          <div className="results-section">
            <div className="results-header">
              <h2>Adapted CV Results</h2>
              <div className="download-buttons">
                <button className="primary-btn" onClick={downloadLaTeX}>
                  📄 Download LaTeX
                </button>
                <button className="primary-btn" onClick={downloadPDF}>
                  📥 Download PDF
                </button>
              </div>
            </div>

            <div className="results-content">
              <div className="results-tabs">
                <button className="tab active">LaTeX Code</button>
              </div>
              
              <div className="latex-preview">
                <pre className="latex-code">
                  <code>{adaptationResult.latexCode}</code>
                </pre>
              </div>

              {adaptationResult.changes.length > 0 && (
                <div className="changes-section">
                  <h3>Key Changes Made</h3>
                  <ul>
                    {adaptationResult.changes.map((change, idx) => (
                      <li key={idx}>{change}</li>
                    ))}
                  </ul>
                </div>
              )}

              {adaptationResult.highlightedSkills.length > 0 && (
                <div className="skills-section">
                  <h3>Highlighted Skills</h3>
                  <div className="skills-tags">
                    {adaptationResult.highlightedSkills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="action-buttons">
                <button className="secondary-btn" onClick={() => setViewMode('adapt')}>
                  ← Back
                </button>
                <button className="primary-btn" onClick={() => setViewMode('upload')}>
                  Start Over
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Processing...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;