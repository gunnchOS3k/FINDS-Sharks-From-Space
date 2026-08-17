import { useEffect, useMemo, useState } from 'react';
import type { MapViewState } from '@deck.gl/core';
import type { GenerateResponse, Hotspot } from '../shared/types';
import { DISCLAIMER } from '../shared/types';
import { REGIONS, findRegion } from '../shared/regions';
import { fetchDemo, fetchHotspots } from './services/api';
import { createGestureController, GESTURE_MATRIX } from './services/edgeio';
import MapView from './components/MapView';
import { SHARKS } from './data/sharks';

const ONBOARDING_KEY = 'finds-onboarding-v2';

function modeClass(mode?: string): string {
  if (mode === 'live') return 'live';
  if (mode === 'cache') return 'cache';
  return 'demo';
}

export default function App() {
  const [regionName, setRegionName] = useState(REGIONS[0].name);
  const [n, setN] = useState(80);
  const [data, setData] = useState<GenerateResponse | null>(null);
  const [selected, setSelected] = useState<Hotspot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [help, setHelp] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [onboarding, setOnboarding] = useState(() => localStorage.getItem(ONBOARDING_KEY) !== 'done');
  const region = findRegion(regionName) ?? REGIONS[0];
  const [viewState, setViewState] = useState<MapViewState>({ ...region.view, minZoom: 2, maxZoom: 12 });

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  const generate = async (nextRegion = regionName, nextN = n) => {
    setLoading(true);
    setError(null);
    setSelected(null);
    const found = findRegion(nextRegion) ?? REGIONS[0];
    setViewState((prev) => ({ ...prev, ...found.view }));
    try {
      if (!navigator.onLine) {
        const demo = await fetchDemo();
        setData({ ...demo, provenance: { ...demo.provenance, mode: 'offline' } });
        return;
      }
      try {
        setData(await fetchHotspots(nextRegion, nextN));
      } catch {
        const demo = await fetchDemo();
        setData({ ...demo, region: nextRegion, provenance: { ...demo.provenance, mode: 'demo' } });
        setError('Live NASA API unavailable. Showing NASA-derived demo observations for the New York Bight.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load hotspots.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void generate();
    const io = createGestureController();
    io.start({
      left: () => setN((value) => Math.max(10, value - 10)),
      right: () => setN((value) => Math.min(200, value + 10)),
      up: () =>
        setRegionName((current) => {
          const i = REGIONS.findIndex((item) => item.name === current);
          return REGIONS[i <= 0 ? REGIONS.length - 1 : i - 1].name;
        }),
      down: () =>
        setRegionName((current) => {
          const i = REGIONS.findIndex((item) => item.name === current);
          return REGIONS[(i + 1) % REGIONS.length].name;
        }),
      pinch: () => setN((value) => Math.max(10, value - 20)),
      spread: () => setN((value) => Math.min(200, value + 20)),
      shake: () => setGallery((value) => !value),
      tap: () => undefined,
    });
    return () => io.stop();
    // Initial load and gesture wiring only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mode = !online ? 'offline' : data?.provenance.mode ?? 'demo';
  const subtitle = useMemo(() => region.description, [region]);

  return (
    <div className="app">
      <MapView
        hotspots={data?.hotspots ?? []}
        viewState={viewState}
        onViewStateChange={setViewState}
        onSelect={setSelected}
      />

      <header className="topbar">
        <div className="brand">
          <img src="/favicon.svg" alt="" />
          <div>
            <h1>FINDS — Sharks From Space</h1>
            <p>NASA ocean observations + Gemini-assisted scoring</p>
          </div>
        </div>
        <div className="top-actions">
          <button className="btn" onClick={() => setHelp(true)}>
            Help
          </button>
          <button className="btn" onClick={() => setGallery(true)}>
            Shark gallery
          </button>
        </div>
      </header>

      <section className="panel" aria-label="Hotspot controls">
        <p>
          FINDS helps people explore where environmental ocean conditions may correspond with shark-activity
          hotspots using NASA observations, AI-assisted analysis, and an interactive map.
        </p>
        <p className="meta">{subtitle}</p>
        <label htmlFor="region">Ocean region</label>
        <select id="region" value={regionName} onChange={(e) => setRegionName(e.target.value)}>
          {REGIONS.map((item) => (
            <option key={item.id}>{item.name}</option>
          ))}
        </select>
        <label htmlFor="points">Candidate cells: {n}</label>
        <input
          id="points"
          type="range"
          min={10}
          max={200}
          step={10}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
        />
        <button className="btn primary" disabled={loading} onClick={() => void generate()}>
          {loading ? 'Generating…' : 'Generate hotspots'}
        </button>
        <p className="meta">
          Score colors: blue/teal = lower, gold = highest. The list and selected-cell text state the same
          scores so color is never the only cue.
        </p>
        <p className="status-row">
          <span className={`pill ${modeClass(mode)}`}>{mode}</span>
          {data?.provenance.cache.status ? <span className="pill">{data.provenance.cache.status}</span> : null}
          {data?.provenance.observationEnd ? (
            <span>Obs. {data.provenance.observationStart.slice(0, 10)}</span>
          ) : null}
        </p>
        {error ? <p role="alert">{error}</p> : null}
        {data?.hotspots.length ? (
          <div>
            <h2>Highest-scoring cells</h2>
            <ul className="cell-list">
              {data.hotspots.slice(0, 5).map((hotspot) => (
                <li key={hotspot.id}>
                  <button type="button" className="btn" onClick={() => setSelected(hotspot)}>
                    Select {hotspot.label} cell {hotspot.score.toFixed(2)} at {hotspot.lat.toFixed(2)},{' '}
                    {hotspot.lon.toFixed(2)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {selected ? (
          <article>
            <h2>Selected cell</h2>
            <p>
              {selected.lat.toFixed(3)}, {selected.lon.toFixed(3)} · {selected.label} · score{' '}
              {selected.score.toFixed(2)}
            </p>
            <p>{selected.rationale}</p>
            <p className="meta">
              SST {selected.sstC ?? 'n/a'} °C · chlorophyll-a {selected.chlorophyllMgM3 ?? 'n/a'} mg/m³
            </p>
            <p className="meta">{selected.qualityNotes.join(' ')}</p>
            <button className="btn" onClick={() => setSelected(null)}>
              Clear selection
            </button>
          </article>
        ) : null}
        {data ? (
          <details>
            <summary>Data provenance</summary>
            <p>Agency: {data.provenance.sourceAgency}</p>
            <p>Products: {data.provenance.sourceProduct.join(', ')}</p>
            <p>Datasets: {data.provenance.sourceDataset.join(', ')}</p>
            <p>Model: {data.provenance.model ?? 'deterministic scoring only'}</p>
            <p>Pipeline {data.provenance.pipelineVersion}</p>
            <p>{data.provenance.qualityNotes.join(' ')}</p>
          </details>
        ) : null}
      </section>

      <aside className="legend" aria-label="Score legend">
        <strong>What colors mean</strong>
        <div className="swatch"><i style={{ background: '#506ea0' }} /> Low exploratory score</div>
        <div className="swatch"><i style={{ background: '#5aa0ff' }} /> Moderate</div>
        <div className="swatch"><i style={{ background: '#3ee0d2' }} /> Elevated</div>
        <div className="swatch"><i style={{ background: '#f3c14a' }} /> High + marker</div>
        <p className="meta">Color is paired with the text label on each selected hotspot.</p>
      </aside>

      <p className="disclaimer">{DISCLAIMER}</p>

      {loading ? (
        <div className="loading" role="status" aria-live="polite">
          Retrieving NASA observations and scoring candidate cells…
        </div>
      ) : null}

      {onboarding ? (
          <div className="modal-backdrop">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
            <h2 id="welcome-title">Welcome to FINDS</h2>
            <p>Choose a region, generate hotspots, then tap a point. NASA supplies SST and chlorophyll-a. Gemini only ranks and explains those cells.</p>
            <p>{DISCLAIMER}</p>
            <button
              className="btn primary"
              onClick={() => {
                localStorage.setItem(ONBOARDING_KEY, 'done');
                setOnboarding(false);
              }}
            >
              Start exploring
            </button>
          </div>
        </div>
      ) : null}

      {help ? (
        <div className="modal-backdrop" onClick={() => setHelp(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="help-title" onClick={(e) => e.stopPropagation()}>
            <h2 id="help-title">About FINDS</h2>
            <p>🏆 NYC Best Use of Gemini API — NASA Space Apps Challenge 2025</p>
            <p>What is a shark hotspot here? A scored ocean cell, not a confirmed shark.</p>
            <p>NASA provides GIBS visualizations of MUR SST and PACE/VIIRS chlorophyll-a.</p>
            <p>Gemini interprets those cells. It does not invent coordinates in live mode.</p>
            <table className="gesture-table">
              <caption>Input support</caption>
              <thead>
                <tr>
                  <th>Gesture</th>
                  <th>Desktop</th>
                  <th>Android</th>
                  <th>PWA</th>
                </tr>
              </thead>
              <tbody>
                {GESTURE_MATRIX.map((row) => (
                  <tr key={row.gesture}>
                    <th scope="row">{row.gesture}</th>
                    <td>{row.desktop}</td>
                    <td>{row.android}</td>
                    <td>{row.pwa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>{DISCLAIMER}</p>
            <button className="btn primary" onClick={() => setHelp(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}

      {gallery ? (
        <div className="modal-backdrop" onClick={() => setGallery(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="gallery-title" onClick={(e) => e.stopPropagation()}>
            <h2 id="gallery-title">Shark species cards</h2>
            <p className="meta">Original FINDS illustrations. Not photographs and not a field guide.</p>
            <div className="gallery">
              {SHARKS.map((shark) => (
                <article className="card" key={shark.id}>
                  <img src={`/sharks/${shark.file}`} alt={shark.title} />
                  <h3>{shark.title}</h3>
                  <p>
                    {shark.scientificName}. {shark.caption}
                  </p>
                </article>
              ))}
            </div>
            <button className="btn primary" onClick={() => setGallery(false)}>
              Close gallery
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
