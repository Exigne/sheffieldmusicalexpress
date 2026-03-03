"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

// --- SYNTHESIS ENGINE (Generates sounds mathematically, no files needed!) ---
const createAudioContext = () => new (window.AudioContext || (window as any).webkitAudioContext)();

const playKick = (ctx: AudioContext, time: number) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(0.001, time + 0.5);
  gain.gain.setValueAtTime(1, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
  osc.start(time);
  osc.stop(time + 0.5);
};

const playSnare = (ctx: AudioContext, time: number) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  // Noise buffer for the "snap"
  const noiseSize = ctx.sampleRate * 0.5;
  const noiseBuffer = ctx.createBuffer(1, noiseSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseSize; i++) output[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  const noiseFilter = ctx.createBiquadFilter();
  const noiseGain = ctx.createGain();

  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 1000;
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  osc.type = 'triangle';
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(250, time);
  gain.gain.setValueAtTime(1, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
  noiseGain.gain.setValueAtTime(1, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

  osc.start(time);
  noise.start(time);
  osc.stop(time + 0.2);
  noise.stop(time + 0.2);
};

const playHiHat = (ctx: AudioContext, time: number) => {
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const noiseSize = ctx.sampleRate * 0.5;
  const noiseBuffer = ctx.createBuffer(1, noiseSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseSize; i++) output[i] = Math.random() * 2 - 1;
  
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  filter.type = 'highpass';
  filter.frequency.value = 7000;
  
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  gain.gain.setValueAtTime(0.5, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
  
  noise.start(time);
  noise.stop(time + 0.1);
};

const playPerc = (ctx: AudioContext, time: number) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(600, time);
  gain.gain.setValueAtTime(0.3, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
  osc.start(time);
  osc.stop(time + 0.1);
};

// --- COMPONENT ---
export default function DrumMachine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentStepRef = useRef(0);
  const timerIDRef = useRef<NodeJS.Timeout | null>(null);

  // Default Track Setup
  const [tracks, setTracks] = useState([
    { id: 'kick', name: 'KICK', color: 'var(--rust)', steps: Array(16).fill(false), muted: false },
    { id: 'snare', name: 'SNARE', color: 'var(--ink)', steps: Array(16).fill(false), muted: false },
    { id: 'hihat', name: 'HI-HAT', color: 'var(--gold)', steps: Array(16).fill(false), muted: false },
    { id: 'perc', name: 'PERC', color: 'var(--steel)', steps: Array(16).fill(false), muted: false }
  ]);

  // Use refs for the scheduler to read latest state without re-rendering loops
  const tracksRef = useRef(tracks);
  useEffect(() => { tracksRef.current = tracks; }, [tracks]);

  // Scheduler Logic (Web Audio API scheduling for tight timing)
  const scheduleNote = useCallback((stepNumber: number, time: number) => {
    // Update the visual UI
    setCurrentStep(stepNumber);

    // Play the sounds
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    tracksRef.current.forEach(track => {
      if (track.steps[stepNumber] && !track.muted) {
        if (track.id === 'kick') playKick(ctx, time);
        if (track.id === 'snare') playSnare(ctx, time);
        if (track.id === 'hihat') playHiHat(ctx, time);
        if (track.id === 'perc') playPerc(ctx, time);
      }
    });
  }, []);

  const scheduler = useCallback(() => {
    if (!audioCtxRef.current) return;
    const scheduleAheadTime = 0.1; 
    const lookahead = 25.0; 

    while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + scheduleAheadTime) {
      scheduleNote(currentStepRef.current, nextNoteTimeRef.current);
      
      // Advance time and step
      const secondsPerBeat = 60.0 / bpm;
      nextNoteTimeRef.current += 0.25 * secondsPerBeat; // 16th notes
      currentStepRef.current = (currentStepRef.current + 1) % 16;
    }
    timerIDRef.current = setTimeout(scheduler, lookahead);
  }, [bpm, scheduleNote]);

  useEffect(() => {
    if (isPlaying) {
      if (!audioCtxRef.current) audioCtxRef.current = createAudioContext();
      if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
      
      currentStepRef.current = 0;
      nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.05;
      scheduler();
    } else {
      if (timerIDRef.current) clearTimeout(timerIDRef.current);
      setCurrentStep(0);
    }
    return () => { if (timerIDRef.current) clearTimeout(timerIDRef.current); };
  }, [isPlaying, scheduler]);

  // Toggle a step on or off
  const toggleStep = (trackIndex: number, stepIndex: number) => {
    const newTracks = [...tracks];
    newTracks[trackIndex].steps[stepIndex] = !newTracks[trackIndex].steps[stepIndex];
    setTracks(newTracks);
  };

  // Toggle Mute
  const toggleMute = (trackIndex: number) => {
    const newTracks = [...tracks];
    newTracks[trackIndex].muted = !newTracks[trackIndex].muted;
    setTracks(newTracks);
  };

  const clearAll = () => {
    setTracks(tracks.map(t => ({ ...t, steps: Array(16).fill(false) })));
  };

  // A classic house beat to get them started
  const loadPreset = () => {
    setTracks([
      { ...tracks[0], steps: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
      { ...tracks[1], steps: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] },
      { ...tracks[2], steps: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false] },
      { ...tracks[3], steps: [false, false, false, false, false, false, false, true, false, true, false, false, false, false, false, false] }
    ]);
  };

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', padding: '60px 20px', overflowX: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <header style={{ borderBottom: '12px solid var(--ink)', paddingBottom: '20px', marginBottom: '40px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px' }}>
          <div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(4rem, 10vw, 7rem)', margin: 0, lineHeight: '0.8', color: 'var(--ink)' }}>
              STEEL CITY <span style={{ color: 'var(--rust)' }}>SEQ</span>
            </h1>
            <p style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--ink)', marginTop: '10px' }}>
              16-STEP BROWSER SYNTHESIZER
            </p>
          </div>
          
          {/* TRANSPORT CONTROLS */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', background: 'white', padding: '15px', border: '4px solid var(--ink)', boxShadow: '8px 8px 0px var(--aged)' }}>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              style={{ background: isPlaying ? 'var(--ink)' : 'var(--rust)', color: 'white', border: '3px solid var(--ink)', padding: '10px 30px', fontFamily: 'Bebas Neue', fontSize: '2rem', cursor: 'pointer', minWidth: '120px' }}
            >
              {isPlaying ? 'STOP ⬛' : 'PLAY ▶'}
            </button>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', fontWeight: 'bold' }}>BPM: {bpm}</label>
              <input 
                type="range" min="60" max="200" value={bpm} onChange={(e) => setBpm(Number(e.target.value))}
                style={{ cursor: 'pointer', accentColor: 'var(--rust)' }}
              />
            </div>
          </div>
        </header>

        {/* CONTROLS */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <button onClick={loadPreset} className="btn-submit" style={{ fontSize: '1rem', padding: '8px 15px' }}>LOAD PRESET BEAT</button>
          <button onClick={clearAll} style={{ background: 'white', border: '2px solid var(--ink)', fontFamily: 'Bebas Neue', fontSize: '1.2rem', padding: '8px 15px', cursor: 'pointer' }}>CLEAR GRID</button>
        </div>

        {/* THE SEQUENCER GRID */}
        <div style={{ 
          background: 'white', 
          border: '6px solid var(--ink)', 
          boxShadow: '15px 15px 0px var(--aged)', 
          padding: '20px',
          overflowX: 'auto' /* Crucial for mobile! Lets users scroll the 16 steps horizontally */
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '800px' /* Forces the grid to stay wide */ }}>
            
            {/* PLAYHEAD INDICATOR ROW */}
            <div style={{ display: 'flex', paddingLeft: '140px', gap: '8px', marginBottom: '10px' }}>
              {Array(16).fill(null).map((_, i) => (
                <div key={i} style={{ 
                  flex: 1, height: '10px', 
                  background: isPlaying && currentStep === i ? 'var(--rust)' : 'transparent',
                  transition: 'background 0.05s'
                }} />
              ))}
            </div>

            {/* TRACK ROWS */}
            {tracks.map((track, trackIndex) => (
              <div key={track.id} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                
                {/* TRACK HEADER */}
                <div style={{ width: '120px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--ink)', color: 'white', padding: '10px', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', letterSpacing: '2px', color: track.muted ? 'var(--muted)' : 'white' }}>
                    {track.name}
                  </span>
                  <button 
                    onClick={() => toggleMute(trackIndex)}
                    style={{ background: track.muted ? 'var(--rust)' : 'transparent', color: 'white', border: '1px solid white', fontSize: '0.6rem', padding: '3px 6px', cursor: 'pointer', fontFamily: 'IBM Plex Mono' }}
                  >
                    {track.muted ? 'M' : 'ON'}
                  </button>
                </div>

                {/* 16 STEPS */}
                <div style={{ display: 'flex', gap: '8px', flexGrow: 1 }}>
                  {track.steps.map((isActive, stepIndex) => {
                    const isCurrent = isPlaying && currentStep === stepIndex;
                    return (
                      <button
                        key={stepIndex}
                        onClick={() => toggleStep(trackIndex, stepIndex)}
                        style={{
                          flex: 1,
                          aspectRatio: '1/1.2', /* Rectangular pads like an 808 */
                          background: isActive ? track.color : 'var(--paper)',
                          border: `3px solid ${isCurrent ? 'var(--ink)' : 'var(--aged)'}`,
                          boxShadow: isActive ? `3px 3px 0px var(--ink)` : 'none',
                          transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
                          cursor: 'pointer',
                          transition: 'transform 0.05s, border 0.05s',
                          opacity: track.muted ? 0.3 : 1
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
