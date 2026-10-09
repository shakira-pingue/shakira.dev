export interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  analysisUrl: string;
}

export interface AnalysisData {
  tempo: number;
  beat_times: number[];
  times: number[];
  freq_bands: number[][];
  rms: number[];
  onset: number[];
}
