"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STAGE_COUNT = 3;
// Time each card stays in focus before the story moves on.
const STAGE_HOLD_MS = 1600;
const TICK_MS = 40;

export type StoryPlayback = {
  stage: number;
  progress: number;
  playing: boolean;
  /** True once every card has played; the story then rests on the final state. */
  finished: boolean;
  play: () => void;
  pause: () => void;
  replay: () => void;
  setStage: (stage: number) => void;
};

/**
 * Shared stage controller. Remount (via React key) when the active story changes
 * so playback always starts clean without a storyId reset effect.
 */
export function useStoryPlayback(reduceMotion: boolean, inView = true): StoryPlayback {
  const [stage, setStageState] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(() => !reduceMotion);
  const [finished, setFinished] = useState(false);
  const stageRef = useRef(0);
  const progressRef = useRef(0);
  const playingRef = useRef(!reduceMotion);

  useEffect(() => {
    // Ticking re-renders the panel 25×/s, so only run while it is on screen.
    if (reduceMotion || !playing || !inView) return;

    const id = window.setInterval(() => {
      if (!playingRef.current || document.hidden) return;

      const next = progressRef.current + TICK_MS / STAGE_HOLD_MS;
      if (next >= 1) {
        // Last card done: stop here instead of looping back to the first card.
        if (stageRef.current >= STAGE_COUNT - 1) {
          progressRef.current = 1;
          playingRef.current = false;
          setProgress(1);
          setPlaying(false);
          setFinished(true);
          return;
        }
        const nextStage = stageRef.current + 1;
        stageRef.current = nextStage;
        progressRef.current = 0;
        setStageState(nextStage);
        setProgress(0);
        return;
      }

      progressRef.current = next;
      setProgress(next);
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [inView, playing, reduceMotion]);

  const replay = useCallback(() => {
    stageRef.current = 0;
    progressRef.current = 0;
    setStageState(0);
    setProgress(0);
    setFinished(false);
    if (reduceMotion) {
      playingRef.current = false;
      setPlaying(false);
      return;
    }
    playingRef.current = true;
    setPlaying(true);
  }, [reduceMotion]);

  const play = useCallback(() => {
    if (reduceMotion) return;
    if (finished) {
      replay();
      return;
    }
    playingRef.current = true;
    setPlaying(true);
  }, [finished, reduceMotion, replay]);

  const pause = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
  }, []);

  const setStage = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(STAGE_COUNT - 1, next));
      stageRef.current = clamped;
      progressRef.current = 0;
      setStageState(clamped);
      setProgress(0);
      setFinished(false);
      if (!reduceMotion) {
        playingRef.current = true;
        setPlaying(true);
      }
    },
    [reduceMotion],
  );

  return { stage, progress, playing, finished, play, pause, replay, setStage };
}
