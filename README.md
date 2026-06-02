# Veto Authority

**Quality-floor veto mechanism with temporal decay for AI pipelines.**

![Status](https://img.shields.io/badge/status-production-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

---

## The problem

AI pipelines are feedforward by default — each stage passes its output to the next with no circuit breaker. A confident hallucination in stage 1 becomes a premise in stage 2, which generates further conclusions in stage 3. By the time a human sees the output, the error is load-bearing.

## The pattern

The Veto Authority is a **stateless quality gate** that sits between pipeline stages. It has exactly one power: **reject.** It cannot modify outputs, suggest alternatives, or negotiate. It either passes the output through unchanged, or kills it.

### The R(t) decay function

Veto sensitivity decays over time within a session to prevent over-caution:

```
R(t) = R_base × e^(-λt)
```

Where:
- `R_base` = initial rejection threshold (e.g., 0.3 — reject anything below 30% confidence)
- `λ` = decay rate (how quickly the veto relaxes)
- `t` = time since session start

Early in a session, the veto is strict — rejecting anything uncertain. As the session builds context and the system accumulates confirmed knowledge, the threshold relaxes. This mirrors human cognition: you're cautious in unfamiliar territory and more decisive once you've oriented.

### Reset triggers

R(t) resets to R_base when:
- A new topic or domain is introduced (context switch)
- An error is detected in prior output (trust violation)
- The [Homeostasis](https://github.com/duke-of-beans/homeostasis) state machine enters CRISIS mode

## TypeScript interfaces

```typescript
export interface VetoConfig {
  baseThreshold: number;     // R_base: initial rejection floor (default: 0.3)
  decayRate: number;         // λ: how fast the veto relaxes (default: 0.01)
  resetOnDomainChange: boolean;
  resetOnError: boolean;
}

export interface VetoResult {
  passed: boolean;
  inputScore: number;
  threshold: number;         // R(t) at time of evaluation
  sessionAge: number;        // seconds since session start
  reason?: string;           // why it was rejected, if applicable
}
```

## Production status

In production since March 2026. The production implementation integrates with the [Assertion Router](https://github.com/duke-of-beans/assertion-router) — REFUSE mode is triggered when the Veto Authority rejects an output that can't be rescued by the Cascade fallback chain.

## Prior art

- **Circuit breakers** — Nygard (2007), Release It! — fault tolerance patterns
- **Reject option classifiers** — Chow (1970), optimal reject rules
- **Anomaly detection gates** — quality control in manufacturing pipelines
- **Attention gating** — Thalamic gating in neuroscience (Sherman & Guillery 2006)

## Part of the cognitive stack

- [Assertion Router](https://github.com/duke-of-beans/assertion-router) — the Veto Authority triggers REFUSE mode
- [Composite Confidence Score](https://github.com/duke-of-beans/composite-confidence-score) — provides the score that the veto evaluates
- [Cognitive Stack](https://github.com/duke-of-beans/cognitive-stack) — the full 10-system architecture

---

*Built by [David Kirsch](https://github.com/duke-of-beans). MIT License.*
