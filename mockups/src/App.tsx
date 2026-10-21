import { useEffect, useMemo, useState } from "react";

type IconName =
  | "branch"
  | "camera"
  | "chevronLeft"
  | "chevronRight"
  | "grid"
  | "info"
  | "pause"
  | "play"
  | "reset"
  | "settings"
  | "skipBack"
  | "spark"
  | "zoom";

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    branch: <><path d="M6 3v10a3 3 0 0 0 3 3h6" /><path d="m12 13 3 3-3 3" /><circle cx="6" cy="3" r="2" /><circle cx="16" cy="6" r="2" /><path d="M6 10h7a3 3 0 0 0 3-3" /></>,
    camera: <><path d="M4 7h2l1.5-2h5L14 7h2a2 2 0 0 1 2 2v6H2V9a2 2 0 0 1 2-2Z" /><circle cx="10" cy="11" r="3" /></>,
    chevronLeft: <path d="m13 5-5 5 5 5" />,
    chevronRight: <path d="m8 5 5 5-5 5" />,
    grid: <><rect x="3" y="3" width="14" height="14" rx="1" /><path d="M3 8h14M3 13h14M8 3v14M13 3v14" /></>,
    info: <><circle cx="10" cy="10" r="8" /><path d="M10 9v5M10 6h.01" /></>,
    pause: <><path d="M7 5v10M13 5v10" /></>,
    play: <path d="m7 4 9 6-9 6Z" />,
    reset: <><path d="M5 6H2v-3" /><path d="M3 6a8 8 0 1 1-1 7" /></>,
    settings: <><circle cx="10" cy="10" r="3" /><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M15.7 4.3l-1.4 1.4M5.7 14.3l-1.4 1.4" /></>,
    skipBack: <><path d="M5 5v10" /><path d="m15 5-7 5 7 5Z" /></>,
    spark: <><path d="m10 2 1.2 4.8L16 8l-4.8 1.2L10 14l-1.2-4.8L4 8l4.8-1.2Z" /><path d="m16 14 .6 2.4L19 17l-2.4.6L16 20l-.6-2.4L13 17l2.4-.6Z" /></>,
    zoom: <><circle cx="9" cy="9" r="5" /><path d="m13 13 4 4M9 6v6M6 9h6" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 20 20"
      width={size}
    >
      {paths[name]}
    </svg>
  );
}

const steps = [
  { word: "n", name: "Nebula", production: "Axiom", detail: "Initial gas and dust cloud" },
  { word: "p d₃", name: "Collapse", production: "P1", detail: "Protostar and protoplanetary disk" },
  { word: "e D d₂", name: "Ignition", production: "P2 · P3", detail: "Star ignites; first ring is released" },
  { word: "e M D d₁", name: "Aggregation", production: "P4 · P6", detail: "First planetesimal takes shape" },
  { word: "e N M D", name: "Accretion", production: "P5 · P6 · P7", detail: "Three orbital bodies evolve in parallel" },
  { word: "e P[l][l] N M", name: "First planet", production: "P6 · P7 · P8", detail: "Inner planet forms with two moons" },
  { word: "e P[l][l] P[l][l] N", name: "System growth", production: "P7 · P8", detail: "Second planet reaches maturity" },
  { word: "e P[l][l] P[l][l] P[l][l]", name: "Stable system", production: "P8", detail: "Derivation complete — no further changes" },
];

const productions = [
  ["P1", "n", "p d₃"],
  ["P2", "p", "e"],
  ["P3", "d₃", "D d₂"],
  ["P4", "d₂", "D d₁"],
  ["P5", "d₁", "D"],
  ["P6", "D", "M"],
  ["P7", "M", "N"],
  ["P8", "N", "P[l][l]"],
];

function Button({
  children,
  className = "",
  disabled,
  label,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  label?: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={`button ${className}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function OrbitScene({ step, radius }: { step: number; radius: number }) {
  const orbitalBodies = useMemo(() => {
    const states = [
      [],
      [],
      [{ type: "ring", orbit: 1 }],
      [{ type: "m", orbit: 1 }, { type: "ring", orbit: 2 }],
      [{ type: "n", orbit: 1 }, { type: "m", orbit: 2 }, { type: "ring", orbit: 3 }],
      [{ type: "p", orbit: 1 }, { type: "n", orbit: 2 }, { type: "m", orbit: 3 }],
      [{ type: "p", orbit: 1 }, { type: "p", orbit: 2 }, { type: "n", orbit: 3 }],
      [{ type: "p", orbit: 1 }, { type: "p", orbit: 2 }, { type: "p", orbit: 3 }],
    ];
    return states[step] as { type: string; orbit: number }[];
  }, [step]);

  if (step === 0) {
    return (
      <svg className="space-scene" role="img" viewBox="0 0 800 500">
        <title>Diffuse initial nebula</title>
        <defs>
          <radialGradient id="nebula" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#7ac7ff" stopOpacity=".68" />
            <stop offset="45%" stopColor="#577bdc" stopOpacity=".28" />
            <stop offset="100%" stopColor="#2b3c6f" stopOpacity="0" />
          </radialGradient>
          <filter id="blur"><feGaussianBlur stdDeviation="18" /></filter>
        </defs>
        <ellipse cx="400" cy="250" fill="url(#nebula)" filter="url(#blur)" rx="235" ry="150" />
        {Array.from({ length: 42 }, (_, i) => {
          const angle = i * 2.399;
          const distance = 28 + ((i * 31) % 190);
          return (
            <circle
              className="dust-particle"
              cx={400 + Math.cos(angle) * distance}
              cy={250 + Math.sin(angle) * distance * 0.58}
              key={i}
              r={i % 7 === 0 ? 2.5 : 1.3}
            />
          );
        })}
        <text className="scene-label" x="400" y="440">n  ·  GAS + DUST CLOUD</text>
      </svg>
    );
  }

  const orbitScale = 58 + radius * 5;
  return (
    <svg className="space-scene" role="img" viewBox="0 0 800 500">
      <title>Planetary system at derivation step {step}</title>
      <defs>
        <radialGradient id="star" cx="35%" cy="32%">
          <stop offset="0%" stopColor="#fffce0" />
          <stop offset="35%" stopColor="#ffd169" />
          <stop offset="100%" stopColor="#e26a24" />
        </radialGradient>
        <radialGradient id="proto" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#ffe0bd" />
          <stop offset="100%" stopColor="#c95b42" />
        </radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>

      {step <= 4 && (
        <g className="disk">
          <ellipse cx="400" cy="250" rx={step === 1 ? 185 : step === 2 ? 145 : step === 3 ? 105 : 0} ry={step === 1 ? 58 : step === 2 ? 45 : step === 3 ? 33 : 0} />
          <ellipse className="disk-core" cx="400" cy="250" rx={step === 1 ? 130 : step === 2 ? 95 : step === 3 ? 65 : 0} ry={step === 1 ? 38 : step === 2 ? 29 : step === 3 ? 19 : 0} />
        </g>
      )}

      {[1, 2, 3].map((orbit) => {
        const visible = orbitalBodies.some((body) => body.orbit === orbit);
        return visible ? (
          <ellipse
            className="orbit-line"
            cx="400"
            cy="250"
            key={orbit}
            rx={orbitScale * orbit}
            ry={orbitScale * orbit * 0.35}
          />
        ) : null;
      })}

      <circle className="star-glow" cx="400" cy="250" r={step === 1 ? 35 : 30} />
      <circle cx="400" cy="250" fill={step === 1 ? "url(#proto)" : "url(#star)"} r={step === 1 ? 18 : 22} />
      <text className="object-tag" x="400" y="215">{step === 1 ? "p" : "e"}</text>

      {orbitalBodies.map((body) => {
        const rx = orbitScale * body.orbit;
        const positions = [0, 3.55, 5.65];
        const theta = positions[body.orbit - 1];
        const x = 400 + Math.cos(theta) * rx;
        const y = 250 + Math.sin(theta) * rx * 0.35;
        const planetRadius = body.type === "p" ? 12 + body.orbit : body.type === "n" ? 9 : 6;

        if (body.type === "ring") {
          return (
            <g key={`${body.type}-${body.orbit}`}>
              <ellipse className="material-ring" cx="400" cy="250" rx={rx + 5} ry={(rx + 5) * 0.35} />
              <text className="object-tag" x={400 + rx + 16} y="247">D</text>
            </g>
          );
        }

        return (
          <g key={`${body.type}-${body.orbit}`}>
            {body.type === "p" && (
              <>
                <circle className="moon-orbit" cx={x} cy={y} r={planetRadius + 12} />
                <circle className="moon" cx={x + planetRadius + 10} cy={y - 5} r="2.8" />
                <circle className="moon" cx={x - planetRadius - 8} cy={y + 8} r="2.8" />
              </>
            )}
            <circle className={`body body-${body.type}`} cx={x} cy={y} r={planetRadius} />
            <text className="object-tag" x={x} y={y - planetRadius - 10}>{body.type.toUpperCase()}</text>
          </g>
        );
      })}

      <g className="axis-widget" transform="translate(726 418)">
        <circle cx="0" cy="0" r="22" />
        <path className="axis-x" d="M0 0h25" />
        <path className="axis-y" d="M0 0v-25" />
        <path className="axis-z" d="m0 0-15 13" />
        <text className="axis-x-text" x="29" y="4">X</text>
        <text className="axis-y-text" x="-3" y="-30">Y</text>
        <text className="axis-z-text" x="-25" y="21">Z</text>
      </g>
    </svg>
  );
}

function Callout({ number, className, children }: { number: number; className: string; children: React.ReactNode }) {
  return (
    <div className={`callout ${className}`}>
      <span>{number}</span>
      <p>{children}</p>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(4);
  const [radius, setRadius] = useState(4);
  const [interval, setIntervalValue] = useState(1.5);
  const [playing, setPlaying] = useState(false);
  const [annotations, setAnnotations] = useState(true);

  useEffect(() => {
    if (!playing) return;
    if (step >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), interval * 1000);
    return () => window.clearTimeout(timer);
  }, [playing, step, interval]);

  const setCurrentStep = (next: number) => {
    setStep(Math.max(0, Math.min(7, next)));
    setPlaying(false);
  };

  const reset = () => {
    setStep(0);
    setPlaying(false);
  };

  const current = steps[step];
  const complete = step === 7;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Icon name="spark" size={18} /></div>
          <div>
            <strong>L-System Planetary Lab</strong>
            <span>Phase 1 · Deterministic model</span>
          </div>
        </div>
        <div className="project-tab">
          <span className="file-dot" />
          SolarSystem.lsys
          <span className="unsaved-dot" />
        </div>
        <div className="top-actions">
          <span className="prototype-badge">MOCKUP</span>
          <button
            aria-pressed={annotations}
            className={`annotation-toggle ${annotations ? "active" : ""}`}
            onClick={() => setAnnotations((value) => !value)}
            type="button"
          >
            <Icon name="info" />
            Presentation notes
          </button>
        </div>
      </header>

      <div className="workspace">
        <aside className="panel inspector">
          <div className="panel-heading">
            <span>DERIVATION INSPECTOR</span>
            <Icon name="branch" />
          </div>
          <section className="step-summary">
            <div className="eyebrow">CURRENT STATE</div>
            <div className="step-title">
              <span>Step {step}</span>
              <small>of 7</small>
            </div>
            <div className="step-name">{current.name}</div>
            <p>{current.detail}</p>
          </section>

          <section className="word-section">
            <div className="section-label">
              <span>Generated word</span>
              <span>{current.word.replace(/\s/g, "").length} chars</span>
            </div>
            <code>{current.word}</code>
          </section>

          <section className="production-section">
            <div className="section-label">
              <span>Productions</span>
              <span>8 rules</span>
            </div>
            <div className="production-list">
              {productions.map(([id, before, after]) => (
                <div className={current.production.includes(id) ? "production active" : "production"} key={id}>
                  <span>{id}</span>
                  <code>{before}</code>
                  <b>→</b>
                  <code>{after}</code>
                </div>
              ))}
            </div>
          </section>

          <section className="legend">
            <div className="section-label"><span>Scene legend</span></div>
            <div><i className="legend-star" /><span>Star / protostar</span><kbd>e · p</kbd></div>
            <div><i className="legend-ring" /><span>Material ring</span><kbd>D</kbd></div>
            <div><i className="legend-body" /><span>Orbital body</span><kbd>M · N · P</kbd></div>
            <div><i className="legend-moon" /><span>Moon branch</span><kbd>[l]</kbd></div>
          </section>
        </aside>

        <section className="viewport">
          <div className="viewport-toolbar">
            <div>
              <span className="view-active">Perspective</span>
              <span>Shaded</span>
            </div>
            <div>
              <span><Icon name="grid" /> Grid</span>
              <span className="camera-name"><Icon name="camera" /> Main Camera</span>
            </div>
          </div>
          <div className="scene-wrap">
            <div className="grid-plane" />
            <div className="starfield" />
            <OrbitScene radius={radius} step={step} />
            <div className="scene-status">
              <span className={complete ? "status-light complete" : "status-light"} />
              <div>
                <strong>{complete ? "EVOLUTION COMPLETE" : `SIMULATING · STEP ${step}`}</strong>
                <span>{complete ? "Stable word reached" : current.production === "Axiom" ? "Ready to derive" : `Applied ${current.production}`}</span>
              </div>
            </div>
            <div className="camera-help">
              <span><i className="mouse-icon left" /> Orbit</span>
              <span><i className="mouse-icon middle" /> Pan</span>
              <span><Icon name="zoom" /> Scroll to zoom</span>
            </div>
          </div>
        </section>

        <aside className="panel settings-panel">
          <div className="panel-heading">
            <span>SIMULATION</span>
            <Icon name="settings" />
          </div>

          <section className="control-group">
            <div className="section-label"><span>Orbital parameters</span></div>
            <label htmlFor="radius">
              <span>Radius increment <em>r</em></span>
              <output>{radius}.0 u</output>
            </label>
            <input
              id="radius"
              max="6"
              min="2"
              onChange={(event) => setRadius(Number(event.target.value))}
              step="1"
              type="range"
              value={radius}
            />
            <div className="range-labels"><span>2</span><span>6</span></div>
          </section>

          <section className="control-group">
            <div className="section-label"><span>Auto playback</span></div>
            <label htmlFor="interval">
              <span>Step interval</span>
              <output>{interval.toFixed(1)} s</output>
            </label>
            <select
              id="interval"
              onChange={(event) => setIntervalValue(Number(event.target.value))}
              value={interval}
            >
              <option value="1">1.0 seconds</option>
              <option value="1.5">1.5 seconds</option>
              <option value="2">2.0 seconds</option>
              <option value="3">3.0 seconds</option>
            </select>
          </section>

          <section className="control-group scene-info">
            <div className="section-label"><span>Scene statistics</span></div>
            <div><span>Central stars</span><b>{step === 0 ? 0 : 1}</b></div>
            <div><span>Orbital bodies</span><b>{step < 2 ? 0 : Math.min(step - 1, 3)}</b></div>
            <div><span>Natural satellites</span><b>{step < 5 ? 0 : (step - 4) * 2}</b></div>
            <div><span>Active branches</span><b>{step < 5 ? 0 : (step - 4) * 2}</b></div>
          </section>

          <section className="control-group state-presets">
            <div className="section-label"><span>Mockup states</span></div>
            <button className={step === 0 ? "preset active" : "preset"} onClick={() => setCurrentStep(0)} type="button">
              <span>01</span><div><b>Initial state</b><small>Axiom · n</small></div>
            </button>
            <button className={step === 4 ? "preset active" : "preset"} onClick={() => setCurrentStep(4)} type="button">
              <span>02</span><div><b>Core mockup</b><small>Step 4 · Accretion</small></div>
            </button>
            <button className={step === 7 ? "preset active" : "preset"} onClick={() => setCurrentStep(7)} type="button">
              <span>03</span><div><b>Final state</b><small>Stable system</small></div>
            </button>
          </section>

          <Button className="reset-button" onClick={reset}>
            <Icon name="reset" /> Reset simulation
          </Button>
        </aside>

        <footer className="timeline">
          <div className="transport">
            <Button label="Return to initial step" onClick={reset}><Icon name="skipBack" /></Button>
            <Button disabled={step === 0} label="Previous step" onClick={() => setCurrentStep(step - 1)}><Icon name="chevronLeft" /></Button>
            <Button
              className="play-button"
              disabled={complete}
              label={playing ? "Pause" : "Play automatically"}
              onClick={() => setPlaying((value) => !value)}
            >
              <Icon name={playing ? "pause" : "play"} size={18} />
            </Button>
            <Button disabled={complete} label="Next step" onClick={() => setCurrentStep(step + 1)}><Icon name="chevronRight" /></Button>
          </div>
          <div className="timeline-track">
            <div className="track-line" />
            <div className="track-progress" style={{ width: `${(step / 7) * 100}%` }} />
            {steps.map((item, index) => (
              <button
                aria-label={`Go to step ${index}: ${item.name}`}
                className={`timeline-step ${index === step ? "current" : ""} ${index < step ? "passed" : ""}`}
                key={item.name}
                onClick={() => setCurrentStep(index)}
                type="button"
              >
                <span>{index}</span>
                <small>{index === 0 ? "Axiom" : index === 7 ? "Stable" : `Step ${index}`}</small>
              </button>
            ))}
          </div>
          <div className="timeline-state">
            <span>{complete ? "COMPLETE" : playing ? "PLAYING" : "PAUSED"}</span>
            <code>{current.word}</code>
          </div>
        </footer>

        {annotations && (
          <div className="annotations-layer">
            <Callout className="callout-word" number={1}>Every generated word remains visible for validation.</Callout>
            <Callout className="callout-scene" number={2}>The 3D scene updates after each parallel derivation.</Callout>
            <Callout className="callout-controls" number={3}>Parameters can be adjusted before restarting.</Callout>
            <Callout className="callout-timeline" number={4}>History supports direct navigation and step-back.</Callout>
          </div>
        )}
      </div>
    </main>
  );
}
