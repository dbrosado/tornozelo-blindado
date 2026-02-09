// Video mapping for exercise demonstrations
// Maps exercise ID patterns to video URLs

const VIDEO_BASE_PATH = '/videos/exercises';

// Map exercise IDs to their video files
const VIDEO_MAP: Record<string, string> = {
  // Alfabeto / Círculo tornozelo
  'alfabeto-tornozelo': `${VIDEO_BASE_PATH}/alfabeto-tornozelo.mp4`,
  'alfabeto-dir': `${VIDEO_BASE_PATH}/alfabeto-tornozelo.mp4`,
  'alfabeto-esq': `${VIDEO_BASE_PATH}/alfabeto-tornozelo.mp4`,
  
  // Knee to wall
  'knee-to-wall-bilateral': `${VIDEO_BASE_PATH}/knee-to-wall.mp4`,
  'knee-wall-dir': `${VIDEO_BASE_PATH}/knee-to-wall.mp4`,
  'knee-wall-esq': `${VIDEO_BASE_PATH}/knee-to-wall.mp4`,
  
  // Short foot
  'short-foot': `${VIDEO_BASE_PATH}/short-foot.mp4`,
  
  // Towel curl
  'towel-curl': `${VIDEO_BASE_PATH}/towel-curl.mp4`,
  
  // Calf raise
  'calf-raise-controlado': `${VIDEO_BASE_PATH}/calf-raise.mp4`,
  'calf-raise-dir': `${VIDEO_BASE_PATH}/calf-raise.mp4`,
  'calf-raise-esq': `${VIDEO_BASE_PATH}/calf-raise.mp4`,
  'iso-panturrilha-1': `${VIDEO_BASE_PATH}/calf-raise.mp4`,
  'iso-panturrilha-2': `${VIDEO_BASE_PATH}/calf-raise.mp4`,
  'iso-panturrilha-3': `${VIDEO_BASE_PATH}/calf-raise.mp4`,
  
  // Sóleo (bent knee calf raises)
  'iso-soleo-1': `${VIDEO_BASE_PATH}/isometria-soleo.mp4`,
  'iso-soleo-2': `${VIDEO_BASE_PATH}/isometria-soleo.mp4`,
  'iso-soleo-3': `${VIDEO_BASE_PATH}/isometria-soleo.mp4`,
  
  // Tibialis raise
  'toe-raise': `${VIDEO_BASE_PATH}/tibialis-raise.mp4`,
  'tibialis-raise': `${VIDEO_BASE_PATH}/tibialis-raise.mp4`,
  
  // Equilíbrio unipodal
  'equilibrio-unipodal': `${VIDEO_BASE_PATH}/equilibrio-unipodal.mp4`,
  
  // Star excursion
  'star-excursion': `${VIDEO_BASE_PATH}/equilibrio-unipodal.mp4`, // Reuse equilibrio video
  'star-excursion-dir': `${VIDEO_BASE_PATH}/equilibrio-unipodal.mp4`,
  'star-excursion-esq': `${VIDEO_BASE_PATH}/equilibrio-unipodal.mp4`,
  
  // Single leg RDL
  'sl-rdl-bilateral': `${VIDEO_BASE_PATH}/single-leg-rdl.mp4`,
  'single-leg-rdl-dir': `${VIDEO_BASE_PATH}/single-leg-rdl.mp4`,
  'single-leg-rdl-esq': `${VIDEO_BASE_PATH}/single-leg-rdl.mp4`,
  
  // SLRDL alias
  'slrdl': `${VIDEO_BASE_PATH}/single-leg-rdl.mp4`,

  // Step down
  'step-down': `${VIDEO_BASE_PATH}/step-down.mp4`,
  'mini-agachamento-unipodal': `${VIDEO_BASE_PATH}/step-down.mp4`,
  
  // Leg swing
  'leg-swing': `${VIDEO_BASE_PATH}/leg-swing.mp4`,
};

export function getExerciseVideoUrl(exerciseId: string): string | undefined {
  // Direct match
  if (VIDEO_MAP[exerciseId]) {
    return VIDEO_MAP[exerciseId];
  }
  
  // Partial match (for variations)
  const idLower = exerciseId.toLowerCase();
  for (const [key, url] of Object.entries(VIDEO_MAP)) {
    if (idLower.includes(key) || key.includes(idLower)) {
      return url;
    }
  }
  
  return undefined;
}

export const EXERCISE_VIDEOS = VIDEO_MAP;
