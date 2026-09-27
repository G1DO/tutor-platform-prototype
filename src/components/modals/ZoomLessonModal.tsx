import React, { useState } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Share2,
  MessageSquare,
  Users,
  Shield,
  Sparkles,
  Info,
} from 'lucide-react';
import { Booking } from '../../types';
import { Avatar } from '../common/Avatar';

interface ZoomLessonModalProps {
  isOpen: boolean;
  booking: Booking | null;
  currentUserName: string;
  onClose: () => void;
  onMarkCompleted?: () => void;
  canMarkCompleted?: boolean;
}

export const ZoomLessonModal: React.FC<ZoomLessonModalProps> = ({
  isOpen,
  booking,
  currentUserName,
  onClose,
  onMarkCompleted,
  canMarkCompleted = false,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeTab, setActiveTab] = useState<'video' | 'chat' | 'whiteboard'>('video');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'System', text: 'Connected to secure classroom session.', time: '00:01' },
    {
      sender: booking?.tutorName || 'Tutor',
      text: 'Hello! Welcome to our session. I have the problem set ready on the whiteboard.',
      time: '00:02',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  if (!isOpen || !booking) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: currentUserName,
        text: chatInput.trim(),
        time: timeStr,
      },
    ]);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
      <div
        className="w-full max-w-5xl h-[90vh] bg-slate-900 text-slate-100 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="zoom-modal-title"
      >
        {/* Top bar */}
        <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-blue-600/30 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold">
              <Video className="w-4 h-4 text-blue-400" />
              Demo Zoom Classroom
            </div>
            <div>
              <h2 id="zoom-modal-title" className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                {booking.subject} Lesson with {booking.tutorName}
              </h2>
              <p className="text-xs text-slate-400">
                Meeting ID: <span className="font-mono text-slate-300">{booking.zoomMeetingId}</span> • Passcode: <span className="font-mono text-slate-300">{booking.zoomPasscode}</span> • Timezone: {booking.timezone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canMarkCompleted && onMarkCompleted && (
              <button
                type="button"
                onClick={onMarkCompleted}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                title="Simulate wrapping up this tutoring session"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Finish & Mark Completed
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              Leave Room
            </button>
          </div>
        </div>

        {/* Prototype notice bar */}
        <div className="bg-blue-950/60 border-b border-blue-900/40 px-4 py-1.5 text-xs text-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>Prototype Simulation:</strong> Demonstrating Zoom classroom flow. Audio and video streams are simulated locally.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('video')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                activeTab === 'video' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Classroom View
            </button>
            <button
              onClick={() => setActiveTab('whiteboard')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                activeTab === 'whiteboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Whiteboard
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                activeTab === 'chat' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              In-Session Chat
            </button>
          </div>
        </div>

        {/* Main Stage */}
        <div className="flex-1 bg-slate-950 flex flex-col md:flex-row overflow-hidden relative">
          {/* Central Workspace */}
          <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
            {activeTab === 'video' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 items-stretch">
                {/* Tutor Feed */}
                <div className="relative bg-slate-800 rounded-2xl border border-slate-700 flex flex-col items-center justify-center p-6 min-h-[220px] overflow-hidden">
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-medium text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {booking.tutorName} (Tutor)
                  </div>
                  <Avatar name={booking.tutorName} size="xl" avatarColor="bg-blue-600 text-white" />
                  <p className="mt-3 text-sm font-medium text-slate-300">Live Video Stream</p>
                  <p className="text-xs text-slate-500">Audio connected • 1080p HD</p>
                </div>

                {/* Student Feed */}
                <div className="relative bg-slate-800 rounded-2xl border border-slate-700 flex flex-col items-center justify-center p-6 min-h-[220px] overflow-hidden">
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-medium text-slate-200 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isVideoOff ? 'bg-slate-500' : 'bg-emerald-500'}`}></span>
                    {currentUserName} (You)
                  </div>
                  {isVideoOff ? (
                    <div className="text-center text-slate-400">
                      <VideoOff className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                      <p className="text-sm font-medium">Your camera is turned off</p>
                    </div>
                  ) : (
                    <>
                      <Avatar name={currentUserName} size="xl" avatarColor="bg-indigo-600 text-white" />
                      <p className="mt-3 text-sm font-medium text-slate-300">Your Video Feed</p>
                      <p className="text-xs text-slate-500">Microphone {isMuted ? 'Muted' : 'Active'}</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'whiteboard' && (
              <div className="flex-1 bg-white text-slate-900 rounded-2xl p-6 border border-slate-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <span className="font-bold text-slate-800 text-sm">
                      Interactive Whiteboard: {booking.subject} Notes
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      Simulated Collaborative Canvas
                    </span>
                  </div>
                  <div className="space-y-3 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="text-indigo-700 font-bold"># Topic: {booking.subject} Core Principles</div>
                    <div className="text-slate-700">1. Problem Formulation and given parameters</div>
                    <div className="text-slate-700">2. Step-by-step derivation:</div>
                    <div className="text-slate-800 font-semibold pl-4">
                      f(x) = ∫ [2x + 3] dx = x² + 3x + C
                    </div>
                    <div className="text-emerald-700 pl-4">
                      ✓ Boundary condition: f(0) = 5 ➔ C = 5
                    </div>
                    <div className="text-blue-700 pl-4">
                      ➔ Final Solution: f(x) = x² + 3x + 5
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4 text-center">
                  In production, this area embeds the Zoom Meeting SDK or Zoom Web Client iframe.
                </p>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="flex-1 bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
                <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs ${
                        msg.sender === currentUserName
                          ? 'bg-blue-600/30 border border-blue-500/40 text-blue-100 ml-8'
                          : 'bg-slate-800 border border-slate-700 text-slate-200 mr-8'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1 text-[11px] text-slate-400">
                        <span className="font-semibold">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendChat} className="flex gap-2 mt-4 pt-3 border-t border-slate-800">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type message to tutor..."
                    className="flex-1 bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="bg-slate-950 border-t border-slate-800 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                isVideoOff
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-4 h-4 text-rose-400" /> : <Video className="w-4 h-4 text-emerald-400" />}
              <span>{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('whiteboard')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-blue-400" />
              <span>Share Screen / Board</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Chat ({chatMessages.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Leave Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
