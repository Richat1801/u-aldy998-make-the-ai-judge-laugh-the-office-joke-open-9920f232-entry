// Make the AI Judge Laugh: the Office Joke Open (Node 22, standard library only):
// writes one original office joke, at most 200 characters, to /output/entry.txt.
//
// The judge picks the funniest office joke, weighing in order: (1) the joke
// is about office life and works as a joke, not a complaint or a remark;
// (2) the laugh is earned — a turn, a misdirection or a flash of recognition
// that pays off in the last few words; (3) the office detail is specific —
// the meeting that could have been an email, the reply-all, the printer, the
// calendar — rather than a generic grumble about work; (4) it is fresh — a
// familiar setup taken somewhere unexpected, not a joke the reader has met
// before; (5) it reads cleanly in one pass, tight enough that no word could
// be cut without loss. So this program keeps a small bank of original
// candidates, scores each deterministically on those axes, and writes only
// the winner. No clock, no randomness, no network: both grader runs write
// the same bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

type Candidate = {
  text: string;
  office: number; // a real joke about office life, not a complaint
  laugh: number; // the turn pays off in the last few words
  specific: number; // a concrete office detail, not a generic grumble
  fresh: number; // a familiar setup taken somewhere unexpected
};

// Every line below is original, written for this competition.
const BANK: Candidate[] = [
  {
    // Winner: the meeting-about-a-meeting setup, the AI as a deadpan
    // witness, and the quoted verdict lands the punch in the last words.
    text: `I asked AI to summarise the meeting. It replied: 'You were in a meeting about a meeting. You said nothing. It lasted an hour.'`,
    office: 9,
    laugh: 9,
    specific: 9,
    fresh: 8,
  },
  {
    // Reply-all as a self-inflicted policy: the loop is the joke.
    text: 'I replied-all to say please stop replying-all, and now I am the reason we have a policy about replying-all.',
    office: 9,
    laugh: 8,
    specific: 9,
    fresh: 8,
  },
  {
    // The calendar as a better employee than its owner.
    text: 'My calendar is so full it has started declining meetings on my behalf, and honestly, it is better at my job than I am.',
    office: 9,
    laugh: 8,
    specific: 8,
    fresh: 8,
  },
  {
    // The printer, one job, a union rep, and perfect deadline timing.
    text: 'Our printer has one job and a union rep. It jams only during deadlines, like a professional.',
    office: 9,
    laugh: 8,
    specific: 9,
    fresh: 7,
  },
  {
    // The condolence email and the ticket: bureaucracy outlives the plant.
    text: 'The office plant died. HR sent a condolence email, IT opened a ticket, and the plant is still the most productive thing here.',
    office: 8,
    laugh: 8,
    specific: 8,
    fresh: 8,
  },
  {
    // The shrug, promoted through the whole corporate ladder.
    text: 'The meeting could have been an email. The email could have been a shrug. The shrug is now a quarterly review.',
    office: 9,
    laugh: 7,
    specific: 8,
    fresh: 8,
  },
  {
    // Standup, quantified: fifteen minutes sitting, forty-five explaining.
    text: 'The standup meeting is fifteen minutes of sitting down and forty-five minutes of explaining why we are standing up.',
    office: 9,
    laugh: 7,
    specific: 8,
    fresh: 7,
  },
  {
    // "Per my last email" as a source of dark power.
    text: `I put 'per my last email' in a message and immediately felt the power of a thousand middle managers flow through me.`,
    office: 8,
    laugh: 8,
    specific: 8,
    fresh: 7,
  },
  {
    // The team-building exercise that built only a longer invite.
    text: 'Our team building exercise was a meeting about the meeting, and the only thing we built was a longer calendar invite.',
    office: 9,
    laugh: 7,
    specific: 8,
    fresh: 7,
  },
  {
    // The intern's innocent question, answered three ways at once.
    text: 'The intern asked what the meeting was about. Three managers gave three answers, and the meeting is still going.',
    office: 9,
    laugh: 7,
    specific: 8,
    fresh: 8,
  },
];

function score(c: Candidate): number {
  return c.office * 3 + c.laugh * 3 + c.specific * 2 + c.fresh * 2;
}

const ranked = [...BANK].sort((a, b) => score(b) - score(a) || b.text.length - a.text.length);
const winner = ranked[0];

// Guard the gate: 1-200 characters, one line, no trailing newline.
if (winner.text.length < 1 || winner.text.length > 200 || winner.text.includes('\n')) {
  throw new Error(`winner fails the gate: ${winner.text.length} chars`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'entry.txt'), winner.text, 'utf8');
