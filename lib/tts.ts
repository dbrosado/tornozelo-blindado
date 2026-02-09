// Text-to-Speech wrapper for exercise announcements

let speechSynthesis: SpeechSynthesis | null = null;
let preferredVoice: SpeechSynthesisVoice | null = null;

// Initialize TTS
export function initTTS() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    speechSynthesis = window.speechSynthesis;
    
    // Wait for voices to load
    const loadVoices = () => {
      const voices = speechSynthesis!.getVoices();
      // Prefer Portuguese (Brazil) voice
      preferredVoice = voices.find(v => v.lang === 'pt-BR') 
        || voices.find(v => v.lang.startsWith('pt'))
        || voices.find(v => v.lang === 'en-US')
        || voices[0];
    };
    
    if (speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }
}

// Speak text
export function speak(text: string, options?: { rate?: number; pitch?: number }) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set voice
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  // Set properties
  utterance.lang = 'pt-BR';
  utterance.rate = options?.rate ?? 0.95; // Slightly slower for clarity
  utterance.pitch = options?.pitch ?? 1;
  utterance.volume = 1;
  
  window.speechSynthesis.speak(utterance);
}

// Stop speaking
export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// Check if TTS is supported
export function isTTSSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Initialize on module load
if (typeof window !== 'undefined') {
  initTTS();
}
