import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { ArrowLeft, Loader, Mic, FileQuestion, Lightbulb } from 'lucide-react';
import { fetchTranscript } from '../../lib/youtube';
import { summarizeTranscript } from '../../lib/gemini';

const VideoPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();

  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(true);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (videoId) {
      const getTranscript = async () => {
        setIsLoadingTranscript(true);
        setError('');
        try {
          const fetchedTranscript = await fetchTranscript(videoId);
          setTranscript(fetchedTranscript);
        } catch (err) {
          setError('Failed to load transcript.');
          console.error(err);
        } finally {
          setIsLoadingTranscript(false);
        }
      };
      getTranscript();
    }
  }, [videoId]);

  const handleSummarize = async () => {
    if (!transcript || transcript === 'Transcript not available for this video.') {
      alert('Cannot summarize without a transcript.');
      return;
    }
    setIsSummarizing(true);
    setError('');
    try {
      const summarizedText = await summarizeTranscript(transcript);
      setSummary(summarizedText);
    } catch (err) {
      setError('Failed to summarize the video.');
      console.error(err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleListenToSummary = () => {
    alert('Text-to-speech functionality coming soon!');
  };

  const handleTakeQuiz = () => {
    // Assuming the quiz is related to the tile, not just the video.
    // Navigating back to the roadmap might be a better user experience
    // than trying to link a specific video to a specific quiz.
    navigate('/roadmap');
    alert('You will be able to take a quiz on this topic soon!');
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-300 hover:text-white mb-8">
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="aspect-video w-full max-w-4xl mx-auto bg-neutral-800 rounded-lg mb-8 overflow-hidden">
        {videoId ? (
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${videoId}`}
            width="100%"
            height="100%"
            controls
          />
        ) : <p className="text-center p-8">Video not found.</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-4">Transcript</h2>
          <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-lg h-96 overflow-y-auto">
            {isLoadingTranscript ? (
              <div className="flex items-center justify-center h-full">
                <Loader className="animate-spin text-blue-500" size={32} />
              </div>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : (
              <p className="text-neutral-300 whitespace-pre-wrap">{transcript}</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Actions</h2>
          <div className="space-y-4">
            <button
              onClick={handleSummarize}
              disabled={isSummarizing || isLoadingTranscript || !!error}
              className="w-full px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-neutral-600"
            >
              {isSummarizing ? <Loader className="animate-spin" size={20} /> : <Lightbulb size={20} />}
              <span>{isSummarizing ? 'Summarizing...' : 'Summarize Video'}</span>
            </button>
            <button
              onClick={handleListenToSummary}
              disabled={!summary}
              className="w-full px-6 py-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:bg-neutral-600"
            >
              <Mic size={20} />
              <span>Listen to Summary</span>
            </button>
            <button
              onClick={handleTakeQuiz}
              className="w-full px-6 py-3 bg-purple-600 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <FileQuestion size={20} />
              <span>Take Topic Quiz</span>
            </button>
          </div>

          {summary && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-3">Summary</h3>
              <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-lg">
                <p className="text-neutral-200">{summary}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;