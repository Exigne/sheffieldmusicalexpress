"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

// --- SYNTHESIS ENGINE (Now with custom parameters!) ---
const createAudioContext = () => new (window.AudioContext || (window as any).webkitAudioContext)();

const playKick = (ctx: AudioContext, time: number, params: any) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(params.pitch, time);
  osc.frequency.exponentialRampToValueAtTime(0.001, time + params.decay);
  gain.gain.setValueAtTime(1, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + params.decay);
  osc.start(time);
  osc.stop(time + params.decay);
};

const playSnare = (ctx: AudioContext, time: number, params: any) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const noiseSize = ctx.sampleRate * params.decay;
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

  osc.frequency.setValueAtTime(params.pitch, time);
  gain.gain.setValueAtTime(1, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + (params.decay * 0.5));
  
  // The 'Snap' parameter controls the white noise volume
  noiseGain.gain.setValueAtTime(params.snap, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + params.decay);

  osc.start(time);
  noise.start(time);
  osc.stop(time + params.decay);
  noise.stop(time + params.decay);
};

const playHiHat = (ctx: AudioContext, time: number, params: any) => {
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const noiseSize = ctx.sampleRate * params.decay;
  const noiseBuffer = ctx.createBuffer(1, noiseSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseSize; i++) output[i] = Math.random() * 2 - 1;
  
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  filter.type = 'highpass';
  filter.frequency.value = params.cutoff; // Brightness control
  
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  gain.gain.setValueAtTime(0.5, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + params.decay);
  
  noise.start(time);
  noise.stop(time + params.decay);
};

const playPerc = (ctx: AudioContext, time: number, params: any) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  // LFO SETUP!
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  
  lfo.type = 'sine';
  lfo.frequency.value = params.lfoRate; // Speed of the wobble
  lfoGain.gain.value = params.lfoDepth; // How hard it pulls the pitch
  
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency); // Connect LFO to the pitch of the main synth
  
  osc.type = 'square';
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.frequency.setValueAtTime(params.pitch, time);
  gain.gain.setValueAtTime(0.3, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + params.decay);
  
  lfo.start(time);
  osc.start(time);
  lfo.stop(time + params.decay);
  osc.stop(time + params.decay);
};

// --- COMPONENT ---
export default function DrumMachine() {
  const [user, setUser] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Save/Load State
  const [beatName, setBeatName] = useState("");
  const [savedBeats, setSavedBeats] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentStepRef = useRef(0);
  const timerIDRef = useRef<NodeJS.Timeout | null>(null);

  // Track State (Now with params and an 'expanded' UI state)
  const [tracks, setTracks] = useState([
    { id: 'kick', name: 'KICK', color: 'var(--rust)', steps: Array(16).fill(false), muted: false, expanded: false, params: { pitch: 150, decay: 0.5 } },
    { id: 'snare', name: 'SNARE', color: 'var(--ink)', steps: Array(16).fill(false), muted: false, expanded: false, params: { pitch: 250, decay: 0.2, snap: 1 } },
    { id: 'hihat', name: 'HI-HAT', color: 'var(--gold)', steps: Array(16).fill(false), muted: false, expanded: false, params: { cutoff: 7000, decay: 0.1 } },
    { id: 'perc', name: 'PERC', color: 'var(--steel)', steps: Array(16).fill(false), muted: false, expanded: false, params: { pitch: 600, decay: 0.3, lfoRate: 20, lfoDepth: 200 } }
  ]);

  const tracksRef = useRef(tracks);
  useEffect(() => { tracksRef.current = tracks; }, [tracks]);

  // Auth & Fetch Saved Beats
  useEffect(() => {
    const loggedInUser = localStorage.getItem('sme_user');
    setUser(loggedInUser);
    if (loggedInUser) fetchUserBeats(loggedInUser);
  }, []);

  const fetchUserBeats = async (username: string) => {
    try {
      const res = await fetch(`/api/beats?username=${username}`);
      const data = await res.json();
      if (Array.isArray(data)) setSavedBeats(data);
    } catch (e) { console.error("Failed to load beats"); }
  };

  // Scheduler Logic
  const scheduleNote = useCallback((stepNumber: number, time: number) => {
    setCurrentStep(stepNumber);
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    tracksRef.current.forEach(track => {
      if (track.steps[stepNumber] && !track.muted) {
        if (track.id === 'kick') playKick(ctx, time, track.params);
        if (track.id === 'snare') playSnare(ctx, time, track.params);
        if (track.id === 'hihat') playHiHat(ctx, time, track.params);
        if (track.id === 'perc') playPerc(ctx, time, track.params);
      }
    });
  }, []);

  const scheduler = useCallback(() => {
    if (!audioCtxRef.current) return;
    const scheduleAheadTime = 0.1; 
    const lookahead = 25.0; 

    while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + scheduleAheadTime) {
      scheduleNote(currentStepRef.current, nextNoteTimeRef.current);
      const secondsPerBeat = 60.0 / bpm;
      nextNoteTimeRef.current += 0.25 * secondsPerBeat;
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

  // Interactions
  const toggleStep = (trackIndex: number, stepIndex: number) => {
    const newTracks = [...tracks];
    newTracks[trackIndex].steps[stepIndex] = !newTracks[trackIndex].steps[stepIndex];
    setTracks(newTracks);
  };

  const toggleMute = (trackIndex: number) => {
    const newTracks = [...tracks];
    newTracks[trackIndex].muted = !newTracks[trackIndex].muted;
    setTracks(newTracks);
  };

  const toggleExpand = (trackIndex: number) => {
    const newTracks = [...tracks];
    newTracks[trackIndex].expanded = !newTracks[trackIndex].expanded;
    setTracks(newTracks);
  };

  const updateParam = (trackIndex: number, paramKey: string, val: number) => {
    const newTracks = [...tracks];
    newTracks[trackIndex].params = { ...newTracks[trackIndex].params, [paramKey]: val };
    setTracks(newTracks);
  };

  const clearAll = () => setTracks(tracks.map(t => ({ ...t, steps: Array(16).fill(false) })));

  const loadPreset = () => {
    const defaultParams = [
      { pitch: 150, decay: 0.5 },
      { pitch: 250, decay: 0.2, snap: 1 },
      { cutoff: 7000, decay: 0.1 },
      { pitch: 600, decay: 0.3, lfoRate: 20, lfoDepth: 200 }
    ];
    setTracks(tracks.map((t, i) => ({
      ...t, 
      params: defaultParams[i],
      steps: i === 0 ? [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] :
             i === 1 ? [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] :
             i === 2 ? [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false] :
                       [false, false, false, false, false, false, false, true, false, true, false, false, false, false, false, false]
    })));
    setBpm(125);
  };

  const handleSaveBeat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !beatName.trim()) return;
    setIsSaving(true);
    try {
      await fetch('/api/beats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, name: beatName, bpm, tracks })
      });
      setBeatName("");
      fetchUserBeats(user);
    } catch (err) { alert("Failed to save beat."); } finally { setIsSaving(false); }
  };

  const handleLoadBeat = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const beatId = e.target.value;
    if (!beatId) return;
    const selectedBeat = savedBeats.find(b => b.id.toString() === beatId);
    if (selectedBeat) {
      setBpm(selectedBeat.bpm);
      setTracks(selectedBeat.tracks.map((t: any) => ({ ...t, expanded: false }))); // Ensure menus are closed on load
    }
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
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', background: 'white', padding: '15px', border: '4px solid var(--ink)', boxShadow: '8px 8px 0px var(--aged)' }}>
            <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: isPlaying ? 'var(--ink)' : 'var(--rust)', color: 'white', border: '3px solid var(--ink)', padding: '10px 30px', fontFamily: 'Bebas Neue', fontSize: '2rem', cursor: 'pointer', minWidth: '120px' }}>
              {isPlaying ? 'STOP ⬛' : 'PLAY ▶'}
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', fontWeight: 'bold' }}>BPM: {bpm}</label>
              <input type="range" min="60" max="200" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} style={{ cursor: 'pointer', accentColor: 'var(--rust)' }} />
            </div>
          </div>
        </header>

        {/* CONTROLS & SAVE MODULE */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px', alignItems: 'center', background: 'white', padding: '20px', border: '4px solid var(--ink)' }}>
          <div style={{ display: 'flex', gap: '10px', borderRight: '2px dashed var(--aged)', paddingRight: '20px' }}>
            <button onClick={loadPreset} className="btn-submit" style={{ fontSize: '1rem', padding: '8px 15px' }}>PRESET</button>
            <button onClick={clearAll} style={{ background: 'white', border: '2px solid var(--ink)', fontFamily: 'Bebas Neue', fontSize: '1.2rem', padding: '8px 15px', cursor: 'pointer' }}>CLEAR</button>
          </div>

          <div style={{ flexGrow: 1, display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
            {user ? (
              <>
                <form onSubmit={handleSaveBeat} style={{ display: 'flex', gap: '5px' }}>
                  <input type="text" placeholder="NAME YOUR BEAT..." value={beatName} onChange={e => setBeatName(e.target.value)} style={{ padding: '8px', border: '2px solid var(--ink)', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem' }} required />
                  <button type="submit" disabled={isSaving} style={{ background: 'var(--ink)', color: 'white', border: 'none', padding: '0 15px', fontFamily: 'Bebas Neue', cursor: 'pointer' }}>{isSaving ? '...' : 'SAVE'}</button>
                </form>
                {savedBeats.length > 0 && (
                  <select onChange={handleLoadBeat} style={{ padding: '8px', border: '2px solid var(--ink)', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', background: 'var(--paper)', cursor: 'pointer' }}>
                    <option value="">-- LOAD SAVED BEAT --</option>
                    {savedBeats.map(beat => (
                      <option key={beat.id} value={beat.id}>{beat.name} ({beat.bpm} BPM)</option>
                    ))}
                  </select>
                )}
              </>
            ) : (
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', color: 'var(--rust)', fontWeight: 'bold' }}>LOGIN TO SAVE YOUR BEATS</div>
            )}
          </div>
        </div>

        {/* THE SEQUENCER GRID */}
        <div style={{ background: 'white', border: '6px solid var(--ink)', boxShadow: '15px 15px 0px var(--aged)', padding: '20px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '800px' }}>
            
            {/* PLAYHEAD */}
            <div style={{ display: 'flex', paddingLeft: '170px', gap: '8px', marginBottom: '10px' }}>
              {Array(16).fill(null).map((_, i) => (
                <div key={i} style={{ flex: 1, height: '10px', background: isPlaying && currentStep === i ? 'var(--rust)' : 'transparent', transition: 'background 0.05s' }} />
              ))}
            </div>

            {/* TRACK ROWS */}
            {tracks.map((track, trackIndex) => (
              <div key={track.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  {/* TRACK HEADER WITH TWEAK BUTTON */}
                  <div style={{ width: '150px', display: 'flex', flexDirection: 'column', gap: '5px', background: 'var(--ink)', color: 'white', padding: '10px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', letterSpacing: '2px', color: track.muted ? 'var(--muted)' : 'white' }}>{track.name}</span>
                      <button onClick={() => toggleMute(trackIndex)} style={{ background: track.muted ? 'var(--rust)' : 'transparent', color: 'white', border: '1px solid white', fontSize: '0.6rem', padding: '3px 6px', cursor: 'pointer', fontFamily: 'IBM Plex Mono' }}>{track.muted ? 'M' : 'ON'}</button>
                    </div>
                    {/* NEW TWEAK TOGGLE */}
                    <button onClick={() => toggleExpand(trackIndex)} style={{ background: track.expanded ? 'var(--rust)' : 'transparent', color: 'white', border: '1px solid var(--aged)', fontSize: '0.7rem', padding: '4px', cursor: 'pointer', fontFamily: 'IBM Plex Mono', width: '100%' }}>
                      {track.expanded ? '▲ HIDE PARAMS' : '▼ TWEAK'}
                    </button>
                  </div>

                  {/* 16 STEPS */}
                  <div style={{ display: 'flex', gap: '8px', flexGrow: 1 }}>
                    {track.steps.map((isActive, stepIndex) => {
                      const isCurrent = isPlaying && currentStep === stepIndex;
                      return (
                        <button key={stepIndex} onClick={() => toggleStep(trackIndex, stepIndex)}
                          style={{ flex: 1, aspectRatio: '1/1.2', background: isActive ? track.color : 'var(--paper)', border: `3px solid ${isCurrent ? 'var(--ink)' : 'var(--aged)'}`, boxShadow: isActive ? `3px 3px 0px var(--ink)` : 'none', transform: isCurrent ? 'scale(1.05)' : 'scale(1)', cursor: 'pointer', transition: 'transform 0.05s, border 0.05s', opacity: track.muted ? 0.3 : 1 }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* SLIDER DROP DOWN MENU */}
                {track.expanded && (
                  <div style={{ display: 'flex', gap: '20px', padding: '15px', marginLeft: '170px', background: 'var(--paper)', border: '2px dashed var(--aged)' }}>
                    {Object.entries(track.params).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '120px' }}>
                        <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {key}: {val.toString().substring(0, 5)}
                        </label>
                        <input 
                          type="range" 
                          min={key === 'decay' ? "0.05" : key === 'snap' ? "0" : key === 'cutoff' ? "1000" : "0"} 
                          max={key === 'decay' ? "1" : key === 'snap' ? "2" : key === 'cutoff' ? "15000" : key === 'lfoRate' ? "50" : "1000"} 
                          step={key === 'decay' ? "0.01" : key === 'snap' ? "0.1" : "1"}
                          value={val} 
                          onChange={(e) => updateParam(trackIndex, key, Number(e.target.value))}
                          style={{ accentColor: track.color }}
                        />
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
