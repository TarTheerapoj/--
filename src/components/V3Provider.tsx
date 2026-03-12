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
  buildAndSaveRecommendation: (answers: RecommendationAnswers) => RecommendationResult;
  evaluateAndSaveReadiness: (
    profileSlug: string,
    answers: Record<string, "0" | "1" | "2">,
  ) => ReadinessResult | undefined;
  clearAll: () => void;
}

const V3Context = createContext<V3ContextValue | undefined>(undefined);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRecommendationResult(value: unknown): value is RecommendationResult {
  return (
    isRecord(value) &&
    typeof value.pathwaySlug === "string" &&
    Array.isArray(value.movementSlugs) &&
    value.movementSlugs.every(item => typeof item === "string") &&
    typeof value.summary === "string" &&
    Array.isArray(value.reasons) &&
    value.reasons.every(item => typeof item === "string") &&
    typeof value.coachNote === "string" &&
    typeof value.caution === "string"
  );
}

function parseStoredState(raw: string | null): V3UserState {
  if (!raw) return DEFAULT_V3_USER_STATE;

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!isRecord(parsed)) {
      return DEFAULT_V3_USER_STATE;
    }

    return {
      ...DEFAULT_V3_USER_STATE,
      readinessResults: isRecord(parsed.readinessResults)
        ? (parsed.readinessResults as V3UserState["readinessResults"])
        : DEFAULT_V3_USER_STATE.readinessResults,
      lastRecommendation: isRecommendationResult(parsed.lastRecommendation)
        ? parsed.lastRecommendation
        : undefined,
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

  useEffect(() => {
    if (!didPersistRef.current) {
      didPersistRef.current = true;
      return;
    }

    window.localStorage.setItem(V3_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const buildAndSaveRecommendation = useCallback((answers: RecommendationAnswers) => {
    const result = buildRecommendation(answers);

    setState(current => ({
      ...current,
      lastRecommendation: result,
    }));

    return result;
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

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(V3_STORAGE_KEY);
    }
  }, []);

  const value = useMemo<V3ContextValue>(
    () => ({
      state,
      buildAndSaveRecommendation,
      evaluateAndSaveReadiness,
      clearAll,
    }),
    [state, buildAndSaveRecommendation, evaluateAndSaveReadiness, clearAll],
  );

  return <V3Context.Provider value={value}>{children}</V3Context.Provider>;
}

export function useV3() {
  const context = useContext(V3Context);

  if (!context) {
    throw new Error("useV3 must be used within V3Provider");
  }

  return context;
}
