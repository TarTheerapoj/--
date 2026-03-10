"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { UserStateKey } from "@/lib/movement-learning";
import {
  V3_STORAGE_KEY,
  buildRecommendation,
  DEFAULT_V3_USER_STATE,
  evaluateReadinessProfile,
  getReadinessProfileBySlug,
  type ReadinessResult,
  type RecommendationAnswers,
  type RecommendationResult,
  type V3UserState,
} from "@/lib/v3";

interface V3ContextValue {
  state: V3UserState;
  hydrated: boolean;
  isFavoriteMovement: (slug: string) => boolean;
  isSavedPathway: (slug: string) => boolean;
  isTrainLaterMovement: (slug: string) => boolean;
  toggleFavoriteMovement: (slug: string) => void;
  toggleSavedPathway: (slug: string) => void;
  toggleTrainLaterMovement: (slug: string) => void;
  setMovementState: (slug: string, value: UserStateKey) => void;
  setCoachModeEnabled: (enabled: boolean) => void;
  saveRecommendation: (result: RecommendationResult) => void;
  buildAndSaveRecommendation: (answers: RecommendationAnswers) => RecommendationResult;
  saveReadinessResult: (result: ReadinessResult) => void;
  evaluateAndSaveReadiness: (
    profileSlug: string,
    answers: Record<string, "0" | "1" | "2">,
  ) => ReadinessResult | undefined;
  clearAll: () => void;
}

const V3Context = createContext<V3ContextValue | undefined>(undefined);

function toggleStringItem(items: string[], value: string) {
  return items.includes(value) ? items.filter(item => item !== value) : [...items, value];
}

function parseStoredState(raw: string | null): V3UserState {
  if (!raw) return DEFAULT_V3_USER_STATE;

  try {
    const parsed = JSON.parse(raw) as Partial<V3UserState>;
    return {
      ...DEFAULT_V3_USER_STATE,
      ...parsed,
      favoriteMovementSlugs: parsed.favoriteMovementSlugs ?? [],
      savedPathwaySlugs: parsed.savedPathwaySlugs ?? [],
      trainLaterMovementSlugs: parsed.trainLaterMovementSlugs ?? [],
      movementStates: parsed.movementStates ?? {},
      readinessResults: parsed.readinessResults ?? {},
    };
  } catch {
    return DEFAULT_V3_USER_STATE;
  }
}

export function V3Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<V3UserState>(() => {
    if (typeof window === "undefined") return DEFAULT_V3_USER_STATE;
    return parseStoredState(window.localStorage.getItem(V3_STORAGE_KEY));
  });
  const didPersistRef = useRef(false);
  const hydrated = true;

  useEffect(() => {
    if (!didPersistRef.current) {
      didPersistRef.current = true;
      return;
    }
    window.localStorage.setItem(V3_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggleFavoriteMovement = useCallback((slug: string) => {
    setState(current => ({
      ...current,
      favoriteMovementSlugs: toggleStringItem(current.favoriteMovementSlugs, slug),
    }));
  }, []);

  const toggleSavedPathway = useCallback((slug: string) => {
    setState(current => ({
      ...current,
      savedPathwaySlugs: toggleStringItem(current.savedPathwaySlugs, slug),
    }));
  }, []);

  const toggleTrainLaterMovement = useCallback((slug: string) => {
    setState(current => ({
      ...current,
      trainLaterMovementSlugs: toggleStringItem(current.trainLaterMovementSlugs, slug),
    }));
  }, []);

  const setMovementState = useCallback((slug: string, value: UserStateKey) => {
    setState(current => ({
      ...current,
      movementStates: {
        ...current.movementStates,
        [slug]: value,
      },
    }));
  }, []);

  const setCoachModeEnabled = useCallback((enabled: boolean) => {
    setState(current => ({
      ...current,
      coachModeEnabled: enabled,
    }));
  }, []);

  const saveRecommendation = useCallback((result: RecommendationResult) => {
    setState(current => ({
      ...current,
      lastRecommendation: result,
    }));
  }, []);

  const buildAndSaveRecommendation = useCallback((answers: RecommendationAnswers) => {
    const result = buildRecommendation(answers);
    setState(current => ({
      ...current,
      lastRecommendation: result,
    }));
    return result;
  }, []);

  const saveReadinessResult = useCallback((result: ReadinessResult) => {
    setState(current => ({
      ...current,
      readinessResults: {
        ...current.readinessResults,
        [result.profileSlug]: result,
      },
    }));
  }, []);

  const evaluateAndSaveReadiness = useCallback(
    (profileSlug: string, answers: Record<string, "0" | "1" | "2">) => {
      const profile = getReadinessProfileBySlug(profileSlug);
      if (!profile) return undefined;
      const result = evaluateReadinessProfile(profile, answers);
      setState(current => ({
        ...current,
        readinessResults: {
          ...current.readinessResults,
          [profileSlug]: result,
        },
      }));
      return result;
    },
    [],
  );

  const clearAll = useCallback(() => {
    setState(DEFAULT_V3_USER_STATE);
  }, []);

  const value = useMemo<V3ContextValue>(() => ({
    state,
    hydrated,
    isFavoriteMovement: (slug: string) => state.favoriteMovementSlugs.includes(slug),
    isSavedPathway: (slug: string) => state.savedPathwaySlugs.includes(slug),
    isTrainLaterMovement: (slug: string) => state.trainLaterMovementSlugs.includes(slug),
    toggleFavoriteMovement,
    toggleSavedPathway,
    toggleTrainLaterMovement,
    setMovementState,
    setCoachModeEnabled,
    saveRecommendation,
    buildAndSaveRecommendation,
    saveReadinessResult,
    evaluateAndSaveReadiness,
    clearAll,
  }), [
    state,
    hydrated,
    toggleFavoriteMovement,
    toggleSavedPathway,
    toggleTrainLaterMovement,
    setMovementState,
    setCoachModeEnabled,
    saveRecommendation,
    buildAndSaveRecommendation,
    saveReadinessResult,
    evaluateAndSaveReadiness,
    clearAll,
  ]);

  return <V3Context.Provider value={value}>{children}</V3Context.Provider>;
}

export function useV3() {
  const context = useContext(V3Context);
  if (!context) {
    throw new Error("useV3 must be used within V3Provider");
  }
  return context;
}
