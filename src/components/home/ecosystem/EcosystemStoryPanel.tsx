"use client";

import type { CSSProperties, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getStory, type EcosystemStoryId } from "./stories";
import { useStoryPlayback } from "./useStoryPlayback";
import {
  GeorgiaDiscoverNode,
  GeorgiaEnquireNode,
  GeorgiaReachNode,
  OpsConnectNode,
  OpsGatherNode,
  OpsReadyNode,
  SupplyListNode,
  SupplyOrderNode,
  SupplyReceiveNode,
} from "./StoryNodes";
import "./ecosystem-stories.css";

type EcosystemStoryPanelProps = {
  activeId: EcosystemStoryId;
};

const ease = [0.22, 1, 0.36, 1] as const;

const NODE_MAP: Record<
  EcosystemStoryId,
  Array<(props: { active: boolean; done: boolean }) => ReactNode>
> = {
  georgia: [GeorgiaDiscoverNode, GeorgiaEnquireNode, GeorgiaReachNode],
  supply: [SupplyListNode, SupplyOrderNode, SupplyReceiveNode],
  os: [OpsGatherNode, OpsConnectNode, OpsReadyNode],
};

function PlayIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M2.2 1.2 8.4 5 2.2 8.8Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <rect x="2" y="1.5" width="2.2" height="7" rx="0.6" fill="currentColor" />
      <rect x="5.8" y="1.5" width="2.2" height="7" rx="0.6" fill="currentColor" />
    </svg>
  );
}

function ReplayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M2.2 6a3.8 3.8 0 1 0 1-2.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M2 1.8v2.8h2.8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function EcosystemStoryPanel({ activeId }: EcosystemStoryPanelProps) {
  const reduce = useReducedMotion() ?? false;
  const story = getStory(activeId);
  const playback = useStoryPlayback(reduce);
  const nodes = NODE_MAP[activeId];

  const stageProgress = (index: number) => {
    if (index < playback.stage) return 1;
    if (index > playback.stage) return 0;
    return playback.progress;
  };

  return (
    <div
      className="eco-story-stage"
      data-story={activeId}
      style={
        {
          "--eco-accent": story.accent,
          "--eco-accent-soft": story.accentSoft,
        } as CSSProperties
      }
      aria-label={`${story.title} visual story`}
    >
      <header className="eco-story-head">
        <span className="eco-story-brand">
          <i aria-hidden="true" />
          Beyond
        </span>
        <span className="eco-story-phase">{story.phase}</span>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={story.id}
          className="eco-story-body"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease }}
        >
          <p className="eco-story-kicker">{story.title}</p>
          <h3>{story.headline}</h3>
          <p className="eco-story-desc">{story.description}</p>

          <div className="eco-story-flow" role="group" aria-label={`${story.title} stages`}>
            {story.stages.map((stage, index) => {
              const active = playback.stage === index;
              const done = playback.stage > index || (reduce && index === 0);
              const Node = nodes[index];
              const wireScale = done ? 1 : active ? Math.min(1, stageProgress(index)) : 0;
              const photoCard = activeId === "georgia" && index === 0;
              return (
                <button
                  key={stage.id}
                  type="button"
                  className={`eco-story-node${active ? " is-active" : ""}${done ? " is-done" : ""}${photoCard ? " eco-story-node--photo" : ""}`}
                  onClick={() => playback.setStage(index)}
                  aria-current={active ? "step" : undefined}
                  aria-label={`${stage.title}. ${stage.caption}`}
                >
                  <div className="eco-story-node-visual">
                    <Node active={active} done={done} />
                  </div>
                  {photoCard ? null : (
                    <>
                      <strong>{stage.title}</strong>
                      <span>{stage.caption}</span>
                    </>
                  )}
                  {index < story.stages.length - 1 ? (
                    <i className="eco-story-wire" aria-hidden="true">
                      <span style={{ transform: `scaleX(${wireScale})` }} />
                      <b
                        className={`eco-story-traveler${wireScale > 0.02 ? " is-on" : ""}`}
                        style={{ left: `${wireScale * 100}%` }}
                      />
                    </i>
                  ) : null}
                </button>
              );
            })}
          </div>

          <p
            className={`eco-story-result${playback.stage === story.stages.length - 1 || reduce ? " is-visible" : ""}`}
            aria-live="polite"
          >
            <span aria-hidden="true">✓</span>
            {story.result}
          </p>
        </motion.div>
      </AnimatePresence>

      <footer className="eco-story-footer">
        <div
          className="eco-story-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(((playback.stage + playback.progress) / story.stages.length) * 100)}
          aria-label={`${story.title} story progress`}
        >
          {story.stages.map((stage, index) => (
            <span key={stage.id} className="eco-story-progress-seg">
              <i style={{ transform: `scaleX(${stageProgress(index)})` }} />
            </span>
          ))}
        </div>

        <div className="eco-story-controls">
          <button
            type="button"
            className="eco-story-btn"
            onClick={() => (playback.playing ? playback.pause() : playback.play())}
            disabled={reduce}
            aria-pressed={playback.playing}
          >
            {playback.playing ? <PauseIcon /> : <PlayIcon />}
            {playback.playing ? "Pause" : "Play"}
          </button>
          <button type="button" className="eco-story-btn eco-story-btn--ghost" onClick={playback.replay}>
            <ReplayIcon /> Replay story
          </button>
        </div>
      </footer>
    </div>
  );
}
