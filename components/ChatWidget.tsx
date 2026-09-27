"use client";

import { useEffect, useRef, useState } from "react";
import { SOURCES } from "@/lib/transitions";
import type { Transition } from "@/lib/transitions";
import type { Pathway, Source } from "@/lib/types";

interface Msg {
  role: "bot" | "user";
  text: string;
  sources?: Source[];
  chips?: string[];
}

function pick(ids: string[]): Source[] {
  return ids.map((id) => SOURCES[id]).filter(Boolean);
}

// Deterministic, offline responder. Answers from the curated evidence layer and
// the user's current pathway context, so replies are cited and never invented.
function respond(input: string, pathway: Pathway | null, transition?: Transition): Msg {
  const q = input.toLowerCase();
  const has = (...w: string[]) => w.some((x) => q.includes(x));

  if (has("hi", "hello", "hey", "start")) {
    return {
      role: "bot",
      text: pathway
        ? `Happy to help with your ${pathway.transitionLabel} plan. Ask me anything, or pick one below.`
        : "Hi. Tell me what's changing in your life and I'll help you understand what's ahead. Or ask me how HerNext works.",
      chips: pathway
        ? ["What should I do now?", "What should I ask my doctor?", "What don't you know about me?"]
        : ["How does this work?", "Is this medical advice?", "Who pays for this?"],
    };
  }

  if (has("now", "first", "do next", "start with", "priorit")) {
    if (pathway?.roadmap?.length) {
      const phase = pathway.roadmap[0];
      const ids = Array.from(new Set(phase.items.flatMap((i) => i.sourceIds)));
      return {
        role: "bot",
        text:
          `Right now (${phase.phase}), the key things are:\n\n` +
          phase.items.map((i) => `• ${i.text}`).join("\n\n"),
        sources: pick(ids),
        chips: ["What should I ask my doctor?", "What don't you know about me?"],
      };
    }
    return { role: "bot", text: "Build your plan first and I'll walk you through what to do now.", chips: ["How does this work?"] };
  }

  if (has("ask", "doctor", "provider", "appointment", "question")) {
    if (pathway?.questionsForProvider?.length) {
      const qs = pathway.questionsForProvider.slice(0, 3);
      const ids = Array.from(new Set(qs.flatMap((x) => x.sourceIds)));
      return {
        role: "bot",
        text:
          "Great questions to bring to your appointment:\n\n" +
          qs.map((x) => `• "${x.question}"`).join("\n\n") +
          '\n\nTip: use "+ Add to my visit" on any question to build a list you can print.',
        sources: pick(ids),
        chips: ["What don't you know about me?", "Is this medical advice?"],
      };
    }
  }

  if (has("missing", "don't know", "dont know", "gap", "what else")) {
    if (pathway?.informationGaps?.length) {
      return {
        role: "bot",
        text:
          "Here's what could change your plan that I don't know yet:\n\n" +
          pathway.informationGaps.map((g) => `• ${g.gap} (${g.whyItMatters})`).join("\n\n") +
          "\n\nAnswer any of these in the “Sharpen your plan” box and I'll rebuild it.",
        chips: ["What should I do now?", "Why should I trust this?"],
      };
    }
  }

  if (has("source", "evidence", "trust", "proof", "reliable", "accurate", "hallucin")) {
    return {
      role: "bot",
      text: "Every recommendation is tied to a curated, reputable source (ACOG, CDC, NHS, WHO, ASRM, NICE). The AI can only cite from that vetted list, so it can't invent references. That's why you'll see an organization tag next to each step.",
      sources: pick(["acog-prepregnancy", "cdc-preconception"]),
      chips: ["What should I do now?", "Is this medical advice?"],
    };
  }

  if (has("medical advice", "diagnos", "replace", "prescri", "safe to")) {
    return {
      role: "bot",
      text: "Important: HerNext is navigation, not medical advice or diagnosis. I never tell you to start, stop, or change a medication. I help you understand what's ahead and prepare for the conversation with your provider, who knows your full history.",
      chips: ["What should I ask my doctor?"],
    };
  }

  if (has("folic")) {
    return {
      role: "bot",
      text: "Folic acid is one of the highest-impact preconception steps. Guidance is to start it (typically 400 mcg daily) at least a month before you begin trying, to lower the risk of neural-tube defects. Confirm the right dose for you with your clinician.",
      sources: pick(["cdc-folic-acid"]),
      chips: ["What should I do now?"],
    };
  }
  if (has("ovulat", "fertile window", "timing", "track my cycle")) {
    return {
      role: "bot",
      text: "Timing intercourse to your fertile window matters a lot, especially with irregular cycles. There are simple ways to detect ovulation you can discuss with your clinician.",
      sources: pick(["asrm-ovulation"]),
      chips: ["What should I ask my doctor?"],
    };
  }
  if (has("pcos")) {
    return {
      role: "bot",
      text: "PCOS mainly affects fertility through irregular or absent ovulation. The good news is that it's often manageable, and knowing your ovulation pattern is the key first step when planning pregnancy.",
      sources: pick(["acog-pcos", "nhs-pcos"]),
      chips: ["How do I track ovulation?", "What should I ask my doctor?"],
    };
  }
  if (has("birth control", "contracept", "the pill", "iud", "implant", "stop taking", "come off")) {
    return {
      role: "bot",
      text: "Fertility usually returns quickly after stopping most birth control. Some methods (IUD, implant) need a removal appointment, and the injection can take longer for cycles to resume. Ask your clinician what to expect for your specific method.",
      sources: pick(["cdc-contraception-return"]),
      chips: ["What should I do now?"],
    };
  }
  if (has("age", "35", "how long", "when to see", "specialist", "not happening")) {
    return {
      role: "bot",
      text: "A common guideline is to seek a fertility evaluation after about 12 months of trying, or 6 months if you're 35 or older, and sooner with known factors like irregular cycles. This is a great thing to raise with your provider.",
      sources: pick(["asrm-infertility"]),
      chips: ["What should I ask my doctor?"],
    };
  }
  if (has("postpartum", "after birth", "warning sign", "recovery")) {
    return {
      role: "bot",
      text: "Postpartum care works best as an ongoing process, ideally with a check-in within the first 3 weeks, not one visit at 6 weeks. It's also worth learning the urgent warning signs that need same-day care before the birth.",
      sources: pick(["acog-postpartum", "cdc-hear-her"]),
      chips: ["What should I ask my doctor?"],
    };
  }
  if (has("menopause", "perimenopause", "hot flash")) {
    return {
      role: "bot",
      text: "Perimenopause is the transition before menopause and can last years. The symptoms are real and there are evidence-based options to discuss with a clinician, so it's worth understanding them rather than just waiting it out.",
      sources: pick(["nice-menopause", "menopause-society"]),
      chips: ["What should I ask my doctor?"],
    };
  }

  if (has("who pays", "cost", "price", "pay for", "employer", "business", "money", "monetiz")) {
    return {
      role: "bot",
      text: "HerNext is sold to employers and health plans, per member per month, because navigation that gets women to the right care at the right time saves them real money and retains talent. See the “For employers” page for the model and an ROI calculator.",
      chips: ["How does this work?"],
    };
  }
  if (has("how does this work", "how it works", "what is this", "what do you do")) {
    return {
      role: "bot",
      text: "You tell me what's changing in your life. I identify the transition you're in, then build a personalized, evidence-backed plan: what to do now, what to ask your provider, what I still don't know, and the sources behind it all. As your life moves stage to stage, I remember you and update the plan.",
      chips: pathway ? ["What should I do now?"] : ["Is this medical advice?", "Who pays for this?"],
    };
  }
  if (has("next", "what happens", "stage", "future")) {
    return {
      role: "bot",
      text: transition?.next
        ? `When you're ready, you can move to your next stage (${transition.next.label}) and your plan carries everything you've shared forward, no re-entry.`
        : "As your situation changes, come back and I'll rebuild your plan for the new stage, carrying forward what I already know about you.",
      chips: ["What should I do now?"],
    };
  }

  // Fallback.
  return {
    role: "bot",
    text: pathway
      ? "I can help with your plan, prepping for your appointment, or explaining any step and its evidence. Try one of these:"
      : "I can explain how HerNext works, whether it's medical advice, or who pays for it. Try one of these:",
    chips: pathway
      ? ["What should I do now?", "What should I ask my doctor?", "What don't you know about me?", "Why should I trust this?"]
      : ["How does this work?", "Is this medical advice?", "Who pays for this?"],
  };
}

export default function ChatWidget({
  pathway,
  transition,
}: {
  pathway: Pathway | null;
  transition?: Transition;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([respond("hi", pathway, transition)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      const reply = respond(t, pathway, transition);
      setTyping(false);
      setMessages((m) => [...m, reply]);
    }, 550);
  }

  return (
    <>
      {!open && (
        <button className="chat-fab" onClick={() => setOpen(true)}>
          💬 Ask HerNext
        </button>
      )}

      {open && (
        <div className="chat-panel">
          <div className="chat-head">
            <div>
              <div className="ct">Ask HerNext</div>
              <div className="cs">Guide online</div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>

          <div className="chat-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div className={`bubble ${m.role}`}>
                  {m.text}
                  {m.sources && m.sources.length > 0 && (
                    <span className="bsrc">
                      {m.sources.map((s) => (
                        <a
                          key={s.id}
                          className="cite"
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={s.title}
                        >
                          {s.org}
                        </a>
                      ))}
                    </span>
                  )}
                </div>
                {m.chips && m.chips.length > 0 && i === messages.length - 1 && !typing && (
                  <div className="chat-chips">
                    {m.chips.map((c) => (
                      <button key={c} className="chat-chip" onClick={() => send(c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="typing">
                <i /> <i /> <i />
              </div>
            )}
          </div>

          <div className="chat-disclaimer">Navigation, not medical advice. Answers link to their sources.</div>
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask about your plan, your appointment…"
            />
            <button className="chat-send" onClick={() => send(input)} aria-label="Send">
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
