import { useEffect, useState } from "react";

type Screen = "generation" | "exploration" | "menu";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M4 6h12M4 10h12M4 14h12" />
    </svg>
  );
}

function PlanetaryScene({ exploration = false }: { exploration?: boolean }) {
  return (
    <div className={exploration ? "scene scene-exploration" : "scene"}>
      <div className="scene-sky" />
      <div className="scene-grid" />
      <svg
        aria-label={exploration ? "First-person view inside the generated system" : "Generated planetary system"}
        className="system-drawing"
        role="img"
        viewBox="0 0 1000 580"
      >
        <defs>
          <radialGradient id="sphere" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#fafafa" />
            <stop offset="100%" stopColor="#a8a8a8" />
          </radialGradient>
        </defs>

        {!exploration && (
          <>
            <ellipse className="orbit" cx="500" cy="292" rx="140" ry="54" />
            <ellipse className="orbit" cx="500" cy="292" rx="255" ry="98" />
            <ellipse className="orbit" cx="500" cy="292" rx="380" ry="146" />
            <circle className="star" cx="500" cy="292" r="35" />
            <circle className="planet planet-one" cx="624" cy="317" r="17" />
            <circle className="moon" cx="650" cy="309" r="5" />
            <circle className="moon" cx="612" cy="294" r="4" />
            <circle className="planet planet-two" cx="296" cy="351" r="26" />
            <circle className="moon" cx="328" cy="362" r="5" />
            <circle className="moon" cx="275" cy="326" r="5" />
            <circle className="planet planet-three" cx="818" cy="214" r="22" />
            <circle className="moon" cx="842" cy="230" r="5" />
            <circle className="moon" cx="799" cy="190" r="5" />
          </>
        )}

        {exploration && (
          <>
            <ellipse className="distant-orbit" cx="440" cy="235" rx="360" ry="115" />
            <circle className="star large-star" cx="790" cy="128" r="78" />
            <circle className="planet foreground-planet" cx="292" cy="284" r="105" />
            <ellipse className="planet-ring" cx="292" cy="284" rx="158" ry="36" />
            <circle className="planet distant-planet" cx="626" cy="246" r="32" />
            <circle className="moon distant-moon" cx="675" cy="225" r="11" />
            <path className="movement-path" d="M480 540c60-78 106-134 168-178" />
          </>
        )}
      </svg>

      {exploration && (
        <>
          <span className="crosshair crosshair-horizontal" />
          <span className="crosshair crosshair-vertical" />
        </>
      )}
    </div>
  );
}

function Note({
  children,
  className,
  number,
}: {
  children: React.ReactNode;
  className: string;
  number: number;
}) {
  return (
    <div className={`note ${className}`}>
      <span>{number}</span>
      <p>{children}</p>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("generation");
  const [notesVisible, setNotesVisible] = useState(true);
  const [position, setPosition] = useState({ x: 0, z: 0 });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (screen === "exploration") setScreen("menu");
        if (screen === "menu") setScreen("exploration");
      }

      if (screen !== "exploration") return;
      const key = event.key.toLowerCase();
      if (!["w", "a", "s", "d"].includes(key)) return;
      event.preventDefault();
      setPosition((current) => ({
        x: current.x + (key === "d" ? 1 : key === "a" ? -1 : 0),
        z: current.z + (key === "w" ? 1 : key === "s" ? -1 : 0),
      }));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen]);

  const showGeneration = () => {
    setScreen("generation");
    setPosition({ x: 0, z: 0 });
  };

  const showExploration = () => setScreen("exploration");
  const isExploring = screen !== "generation";

  return (
    <main className="prototype-page">
      <header className="prototype-header">
        <div>
          <div>
            <strong>Planetary L-System</strong>
            <small>Exploration flow proposal</small>
          </div>
        </div>

        <nav aria-label="Mockup states">
          <span>MOCKUP STATES</span>
          <button className={screen === "generation" ? "active" : ""} onClick={showGeneration} type="button">
            1. Generation complete
          </button>
          <button className={screen === "exploration" ? "active" : ""} onClick={showExploration} type="button">
            2. Exploration
          </button>
          <button className={screen === "menu" ? "active" : ""} onClick={() => setScreen("menu")} type="button">
            3. ESC menu
          </button>
        </nav>

        <button
          aria-pressed={notesVisible}
          className="notes-toggle"
          onClick={() => setNotesVisible((visible) => !visible)}
          type="button"
        >
          {notesVisible ? "Hide notes" : "Show notes"}
        </button>
      </header>

      <section className="mockup-stage">
        <div className="screen-frame">
          {screen === "generation" ? (
            <div className="generation-screen">
              <PlanetaryScene />

              <div className="generation-header">
                <span>PLANETARY SYSTEM</span>
                <span>STEP 7 / 7</span>
              </div>

              <div className="generation-result">
                <div>
                  <span>EVOLUTION COMPLETE</span>
                  <strong>System generated successfully</strong>
                  <code>e P[l][l] P[l][l] P[l][l]</code>
                </div>
                <button onClick={showExploration} type="button">
                  Explore system
                  <ArrowIcon />
                </button>
              </div>
            </div>
          ) : (
            <div className="exploration-screen">
              <PlanetaryScene exploration />

              {screen === "exploration" && (
                <div className="minimal-hint">
                  <kbd>ESC</kbd>
                  <span>Menu</span>
                </div>
              )}

              {screen === "menu" && (
                <div className="menu-layer">
                  <div className="pause-menu">
                    <div className="menu-title">
                      <MenuIcon />
                      <div>
                        <span>EXPLORATION PAUSED</span>
                        <strong>Planetary System</strong>
                      </div>
                    </div>
                    <button className="primary-action" onClick={showExploration} type="button">
                      Resume exploration
                    </button>
                    <button type="button">Controls</button>
                    <button type="button">Settings</button>
                    <button onClick={showGeneration} type="button">Return to simulation</button>
                    <div className="controls-summary">
                      <div><kbd>W A S D</kbd><span>Move</span></div>
                      <div><kbd>MOUSE</kbd><span>Look around</span></div>
                      <div><kbd>ESC</kbd><span>Close menu</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {notesVisible && (
          <div className="notes-layer">
            {screen === "generation" && (
              <>
                <Note className="note-result" number={1}>
                  The derivation interface confirms that the system is complete.
                </Note>
                <Note className="note-transition" number={2}>
                  A single action changes from generation to free exploration.
                </Note>
              </>
            )}

            {screen === "exploration" && (
              <>
                <Note className="note-world" number={1}>
                  General 3D environment generated from the final L-System state.
                </Note>
                <Note className="note-move" number={2}>
                  The player can move with WASD and look around with the mouse.
                  Position in this prototype: X {position.x}, Z {position.z}.
                </Note>
                <Note className="note-escape" number={3}>
                  No permanent GUI is required. Press ESC whenever a menu is needed.
                </Note>
              </>
            )}

            {screen === "menu" && (
              <>
                <Note className="note-menu" number={1}>
                  ESC pauses exploration and reveals only the necessary options.
                </Note>
                <Note className="note-flexibility" number={2}>
                  Menu content and visual style remain open for later discussion.
                </Note>
              </>
            )}
          </div>
        )}
      </section>

      <footer className="prototype-footer">
        <span>INTERACTIVE WIREFRAME</span>
        <p>
          This prototype validates the transition and interaction model only.
          Visual style, permanent HUD elements and final controls are intentionally undefined.
        </p>
        {isExploring && <small>Try pressing ESC{screen === "exploration" ? ", W, A, S or D" : ""}</small>}
      </footer>
    </main>
  );
}
