import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Percent, Download, Loader } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { analyzeResume, enhanceResume } from '../../lib/gemini';
import { cn } from '../../lib/utils';

const sampleResumeMarkdown = `
# John Doe
john.doe@email.com | (555) 123-4567 | [linkedin.com/in/johndoe](https://linkedin.com)

---

### Education
**University of Technology**, Anytown, USA
*B.S. in Computer Science*, 2020 - 2024

---

### Experience
**Software Engineer Intern**, Tech Solutions Inc.
*June 2023 - August 2023*
- Developed and maintained features for a large-scale web application using React and Node.js.
- Collaborated with a team of 10 engineers in an agile environment.

---

### Skills
- **Languages:** JavaScript, Python, Java, SQL
- **Frameworks:** React, Node.js, Express
- **Tools:** Git, Docker, AWS
`;

const RESUME_STORAGE_KEY = 'khalari-resume-markdown';

type AnalysisStatus = 'idle' | 'analyzing' | 'enhancing' | 'complete' | 'error';

const ResumeBuilder: React.FC = () => {
  const [markdown, setMarkdown] = useState(sampleResumeMarkdown);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [analysisMessage, setAnalysisMessage] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMarkdown = localStorage.getItem(RESUME_STORAGE_KEY);
    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(RESUME_STORAGE_KEY, markdown);
    }, 500);
    return () => clearTimeout(handler);
  }, [markdown]);

  const handleAnalyze = async () => {
    setAnalysisStatus('analyzing');
    setAnalysisMessage('Analyzing your resume for ATS compatibility...');
    setAtsScore(null);
    setFeedback([]);
    
    try {
        let bestResume = markdown;
        let bestScore = 0;
        let finalFeedback: string[] = [];

        // Initial Analysis
        const initialAnalysis = await analyzeResume(markdown);
        bestScore = initialAnalysis.atsScore;
        finalFeedback = initialAnalysis.feedback;
        setAtsScore(bestScore);
        setFeedback(finalFeedback);

        if (bestScore < 90) {
            setAnalysisStatus('enhancing');
            let currentResume = markdown;
            let currentFeedback = initialAnalysis.feedback;

            for (let i = 1; i <= 5; i++) {
                setAnalysisMessage(`Enhancing resume... Attempt ${i}/5`);
                const enhancementResult = await enhanceResume(currentResume, currentFeedback);
                currentResume = enhancementResult.enhancedMarkdown;
                
                const newAnalysis = await analyzeResume(currentResume);
                if (newAnalysis.atsScore > bestScore) {
                    bestScore = newAnalysis.atsScore;
                    bestResume = currentResume;
                    finalFeedback = newAnalysis.feedback;
                }

                currentFeedback = newAnalysis.feedback;

                if (bestScore >= 90) {
                    setAnalysisMessage("Enhancement successful!");
                    break;
                }
            }
        }
        
        setMarkdown(bestResume);
        setAtsScore(bestScore);
        setFeedback(finalFeedback);
        setAnalysisStatus('complete');
        setAnalysisMessage('Analysis complete.');

    } catch (error) {
        console.error(error);
        setAnalysisStatus('error');
        setAnalysisMessage('An error occurred during analysis. Please try again.');
    }
  };

  const handleDownloadPdf = () => {
    const input = previewRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2, backgroundColor: '#171717' })
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps= pdf.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('resume.pdf');
      });
  };

  const renderPreview = (text: string) => {
    let processedText = text
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">$1</a>');
    processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    processedText = processedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    const lines = processedText.split('\n');
    
    return lines.map((line, index) => {
      if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold mb-2 text-white" dangerouslySetInnerHTML={{ __html: line.substring(2) }}></h1>;
      if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-semibold mt-4 mb-2 border-b border-neutral-700 pb-1 text-blue-300" dangerouslySetInnerHTML={{ __html: line.substring(4) }}></h3>;
      if (line.trim().startsWith('- ')) return <li key={index} className="ml-5 list-disc text-neutral-300" dangerouslySetInnerHTML={{ __html: line.substring(line.indexOf('- ') + 2) }}></li>;
      if (line.trim() === '---') return <hr key={index} className="my-4 border-neutral-700" />;
      
      return <p key={index} className="text-neutral-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: line }}></p>;
    });
  };

  const isAnalyzing = analysisStatus === 'analyzing' || analysisStatus === 'enhancing';

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-neutral-900 border border-neutral-800 rounded-xl p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3"><FileText /> Resume Editor</h2>
        <div className="flex items-center gap-3">
           <button 
               onClick={handleDownloadPdf}
               className="px-5 py-2 bg-neutral-700 rounded-lg font-semibold hover:bg-neutral-600 transition-colors flex items-center gap-2"
           >
               <Download size={16} />
               Download PDF
           </button>
           <button 
               onClick={handleAnalyze}
               disabled={isAnalyzing}
               className="px-5 py-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-neutral-600 disabled:cursor-wait"
           >
               {isAnalyzing ? <Loader size={16} className="animate-spin" /> : <Sparkles size={16} />}
               {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[80vh]">
        <div className="flex flex-col">
           <h3 className="text-lg font-semibold mb-2 text-neutral-300">Markdown Editor</h3>
           <textarea
             value={markdown}
             onChange={(e) => setMarkdown(e.target.value)}
             className="w-full h-full flex-grow bg-neutral-950 border border-neutral-700 rounded-lg p-4 font-mono text-sm text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
             placeholder="Start writing your resume here..."
           />
        </div>

        <div className="flex flex-col gap-6">
            <div className="flex-grow flex flex-col min-h-0">
                <h3 className="text-lg font-semibold mb-2 text-neutral-300">Live Preview</h3>
                <div ref={previewRef} className="w-full h-full flex-grow bg-neutral-800 border border-neutral-700 rounded-lg p-8 overflow-y-auto text-base">
                    {renderPreview(markdown)}
                </div>
            </div>
            {(analysisStatus !== 'idle') && (
                <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">AI Analysis</h4>
                    {isAnalyzing ? (
                        <div className="flex items-center gap-3 text-sm text-neutral-400">
                           <Loader size={16} className="animate-spin" />
                           <span>{analysisMessage}</span>
                        </div>
                    ) : (
                       atsScore !== null && (
                           <div className={cn(analysisStatus === 'error' && 'text-red-400')}>
                            {analysisStatus === 'error' ? <p>{analysisMessage}</p> : (
                               <>
                                 <div className="flex items-center gap-3 mb-3">
                                    <Percent size={18} className="text-blue-400"/>
                                    <p className="font-bold text-lg text-white">ATS Score: {atsScore}%</p>
                                 </div>
                                 <div className="w-full bg-neutral-700 rounded-full h-2.5">
                                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${atsScore}%` }}></div>
                                 </div>
                                 <ul className="mt-4 space-y-2 text-sm text-neutral-300">
                                    {feedback.map((item, i) => <li key={i} className="flex items-start gap-2"><Sparkles size={14} className="text-blue-400 mt-1 flex-shrink-0"/><span>{item}</span></li>)}
                                 </ul>
                               </>
                            )}
                           </div>
                       )
                    )}
                </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeBuilder;