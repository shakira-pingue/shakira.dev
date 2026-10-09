import { revealStep, scrambleText, settleStep, unrevealStep } from "@/utils/ScrambleText/scrambleText";

const SETTLE_SCRAMBLE_TICKS = 3;

export type HoverScrambleMode =
  | "resting"
  | "unsettling"
  | "resizing"
  | "revealing"
  | "revealed"
  | "unrevealing"
  | "settling";

export type HoverScrambleState = {
  mode: HoverScrambleMode;
  count: number;
  direction: 1 | -1;
  base: string;
  unsettleBuffer: string;
  settleScrambleTick: number;
  collapseThenSettle: boolean;
  displayText: string;
};

export type HoverScrambleContext = {
  restingText: string;
  revealedText: string;
  charset: string;
  random: () => number;
};

export function createHoverScrambleState(ctx: HoverScrambleContext): HoverScrambleState {
  return {
    mode: "resting",
    count: 0,
    direction: 1,
    base: "",
    unsettleBuffer: "",
    settleScrambleTick: 0,
    collapseThenSettle: false,
    displayText: ctx.restingText,
  };
}

function display(
  mode: HoverScrambleMode,
  fields: Omit<HoverScrambleState, "mode" | "displayText">,
  ctx: HoverScrambleContext
): string {
  switch (mode) {
    case "resting":
      return ctx.restingText;
    case "unsettling":
      return fields.unsettleBuffer + ctx.restingText.slice(fields.count);
    case "resizing":
      return fields.direction === 1
        ? scrambleText(ctx.revealedText.slice(0, fields.count), ctx.charset, ctx.random)
        : fields.base.slice(0, fields.count);
    case "revealing":
      return revealStep(ctx.revealedText, fields.count, ctx.charset, ctx.random);
    case "revealed":
      return ctx.revealedText;
    case "unrevealing":
      return unrevealStep(ctx.revealedText, ctx.restingText, fields.count, ctx.charset, ctx.random);
    case "settling":
      return settleStep(
        ctx.revealedText.slice(0, ctx.restingText.length),
        ctx.restingText,
        fields.count,
        fields.settleScrambleTick > 0,
        ctx.charset,
        ctx.random
      );
  }
}

function withDisplay(
  ctx: HoverScrambleContext,
  mode: HoverScrambleMode,
  fields: Omit<HoverScrambleState, "mode" | "displayText">
): HoverScrambleState {
  return { ...fields, mode, displayText: display(mode, fields, ctx) };
}

export function hoverScrambleEnter(state: HoverScrambleState, ctx: HoverScrambleContext): HoverScrambleState {
  switch (state.mode) {
    case "resting":
      return withDisplay(ctx, "unsettling", { ...state, count: 0, unsettleBuffer: "" });
    case "unrevealing":
      return withDisplay(ctx, "revealing", state);
    case "settling":
      return withDisplay(ctx, "resizing", {
        ...state,
        count: ctx.restingText.length,
        direction: 1,
        base: scrambleText(ctx.revealedText, ctx.charset, ctx.random),
        settleScrambleTick: 0,
        collapseThenSettle: true,
      });
    case "resizing":
      return withDisplay(ctx, "resizing", { ...state, direction: 1 });
    default:
      return state;
  }
}

export function hoverScrambleLeave(state: HoverScrambleState, ctx: HoverScrambleContext): HoverScrambleState {
  switch (state.mode) {
    case "unsettling":
      return withDisplay(ctx, "resting", { ...state, count: 0, unsettleBuffer: "" });
    case "revealing":
      return withDisplay(ctx, "unrevealing", { ...state, settleScrambleTick: 0 });
    case "revealed":
      return withDisplay(ctx, "unrevealing", { ...state, count: ctx.revealedText.length });
    case "resizing":
      return withDisplay(ctx, "resizing", { ...state, direction: -1 });
    default:
      return state;
  }
}

export function hoverScrambleTick(state: HoverScrambleState, ctx: HoverScrambleContext): HoverScrambleState {
  const revealedLen = ctx.revealedText.length;
  const restingLen = ctx.restingText.length;

  switch (state.mode) {
    case "unsettling": {
      const nextCount = state.count + 1;
      const nextBuffer = state.unsettleBuffer + scrambleText(ctx.restingText[state.count], ctx.charset, ctx.random);
      if (nextCount >= restingLen) {
        return withDisplay(ctx, "resizing", {
          ...state,
          count: restingLen,
          direction: 1,
          base: scrambleText(ctx.revealedText, ctx.charset, ctx.random),
          unsettleBuffer: nextBuffer,
          collapseThenSettle: false,
        });
      }
      return withDisplay(ctx, "unsettling", { ...state, count: nextCount, unsettleBuffer: nextBuffer });
    }
    case "resizing": {
      const next = state.count + state.direction;
      if (state.direction === 1 && next >= revealedLen) {
        return withDisplay(ctx, "revealing", { ...state, count: 0 });
      }
      if (state.direction === -1 && next <= restingLen) {
        return state.collapseThenSettle
          ? withDisplay(ctx, "settling", { ...state, count: restingLen, settleScrambleTick: 0 })
          : withDisplay(ctx, "resting", { ...state, count: 0 });
      }
      return withDisplay(ctx, "resizing", { ...state, count: next });
    }
    case "revealing": {
      const next = state.count + 1;
      if (next >= revealedLen) return withDisplay(ctx, "revealed", { ...state, count: revealedLen });
      return withDisplay(ctx, "revealing", { ...state, count: next });
    }
    case "unrevealing": {
      const next = state.count - 1;
      if (next <= restingLen) {
        return withDisplay(ctx, "resizing", {
          ...state,
          count: revealedLen,
          direction: -1,
          base: unrevealStep(ctx.revealedText, ctx.restingText, next, ctx.charset, ctx.random),
          collapseThenSettle: true,
        });
      }
      return withDisplay(ctx, "unrevealing", { ...state, count: next });
    }
    case "settling": {
      if (state.settleScrambleTick < SETTLE_SCRAMBLE_TICKS) {
        return withDisplay(ctx, "settling", { ...state, settleScrambleTick: state.settleScrambleTick + 1 });
      }
      const next = state.count - 1;
      if (next <= 0) {
        return withDisplay(ctx, "resting", { ...state, count: 0, settleScrambleTick: 0 });
      }
      return withDisplay(ctx, "settling", { ...state, count: next, settleScrambleTick: 0 });
    }
    case "resting":
    case "revealed":
      return state;
  }
}

export function isHoverScrambleAnimating(mode: HoverScrambleMode): boolean {
  return mode !== "resting" && mode !== "revealed";
}
