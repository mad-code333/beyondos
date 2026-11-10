"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STAGE_COUNT = 3;
const STAGE_HOLD_MS = 2800;
const TICK_MS = 40;

export type StoryPlayback = {
  stage: number;
  progress: number;
  playing: boolean;
  play: () => void;
  pause: () => void;
  replay: () => void;
  setStage: (stage: number) => void;
};

/**
 * Shared stage controller. Remount (via React key) when the active story changes
 * so playback always starts clean without a storyId reset effect.
 */
export function useStoryPlayback(reduceMotion: boolean): StoryPlayback {
  const [stage, setStageState] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(() => !reduceMotion);
  const stageRef = useRef(0);
  const progressRef = useRef(0);
  const playingRef = useRef(!reduceMotion);

  useEffect(() => {
    if (reduceMotion || !playing) return;

    const id = window.setInterval(() => {
      if (!playingRef.current) return;

      const next = progressRef.current + TICK_MS / STAGE_HOLD_MS;
      if (next >= 1) {
        const nextStage = (stageRef.current + 1) % STAGE_COUNT;
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
  }, [playing, reduceMotion]);

  const play = useCallback(() => {
    if (reduceMotion) return;
    playingRef.current = true;
    setPlaying(true);
  }, [reduceMotion]);

  const pause = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
  }, []);

  const replay = useCallback(() => {
    stageRef.current = 0;
    progressRef.current = 0;
    setStageState(0);
    setProgress(0);
    if (reduceMotion) {
      playingRef.current = false;
      setPlaying(false);
      return;
    }
    playingRef.current = true;
    setPlaying(true);
  }, [reduceMotion]);

  const setStage = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(STAGE_COUNT - 1, next));
      stageRef.current = clamped;
      progressRef.current = 0;
      setStageState(clamped);
      setProgress(0);
      if (!reduceMotion) {
        playingRef.current = true;
        setPlaying(true);
      }
    },
    [reduceMotion],
  );

  return { stage, progress, playing, play, pause, replay, setStage };
}
