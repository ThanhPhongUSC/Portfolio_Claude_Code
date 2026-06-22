# Building Phong's Portfolio: A Beginner's Tutorial

This document walks you through the personal portfolio website we built — what
it's made of, how it's organized, and how the code actually works. It assumes
**you have never written frontend code before**, so we'll define terms as we go.
Read it top to bottom, or jump to the section you care about.

**Table of contents**

1. [The big picture](#1-the-big-picture)
2. [The technology, in plain English](#2-the-technology-in-plain-english)
3. [How the project is organized](#3-how-the-project-is-organized)
4. [A high-level walkthrough](#4-a-high-level-walkthrough)
5. [Detailed code review](#5-detailed-code-review)
6. [The AI "Digital Twin", explained](#6-the-ai-digital-twin-explained)
7. [How to run it](#7-how-to-run-it)
8. [Improvements applied in this version](#8-improvements-applied-in-this-version)

---

## 1. The big picture

A website is just **files that a web browser knows how to read**. At the most
basic level there are three languages:

- **HTML** — the *structure* (headings, paragraphs, buttons). Think of it as the
  skeleton.
- **CSS** — the *style* (colors, spacing, fonts, animations). The skin and
  clothing.
- **JavaScript** — the *behavior* (things that happen when you click, type, or
  scroll). The muscles.

Writing raw HTML/CSS/JavaScript by hand works, but for anything beyond a couple
of pages it gets repetitive and hard to manage. So the industry uses **tools and
frameworks** that let you write less code, reuse pieces, and avoid common
mistakes. Your site is built with a modern, popular stack of exactly those
tools. The rest of this tutorial explains each one.

---

## 2. The technology, in plain English

Here is every major piece of technology in your project and *why* it exists.

### React — building UIs out of "components"

**React** is a JavaScript library for building user interfaces. Its core idea is
the **component**: a self-contained, reusable chunk of UI. Your navigation bar is
a component (`Nav`). Your hero banner is a component (`Hero`). A component is
basically a JavaScript function that returns a description of what should appear
on screen.

Instead of one giant file describing the whole page, you build small components
and snap them together like LEGO bricks.

### JSX — HTML living inside JavaScript

React lets you write something that *looks* like HTML directly inside your
JavaScript. This is called **JSX**. For example:

```jsx
function Hello() {
  return <h1>Hello, world</h1>;
}
```

That `<h1>...</h1>` is JSX. It is not real HTML — it's a convenient syntax that
gets translated into JavaScript behind the scenes. Whenever you see angle
brackets in a `.tsx` file, that's JSX.

### Next.js — the framework that ties it all together

**React on its own** doesn't decide how files become pages, how to load fast, or
how to run code on a server. **Next.js** is a *framework* built on top of React
that answers all those questions. It gives you:

- **File-based routing** — the folder structure decides your URLs.
- A **development server** (`npm run dev`) that shows your changes instantly.
- The ability to run code **on the server** (we use this to keep the AI key
  secret — more on that later).
- Automatic performance optimizations.

Your site uses the **App Router**, Next.js's modern system where everything lives
in a folder called `app/`.

### TypeScript — JavaScript with a safety net

**TypeScript** is JavaScript plus **types**. A "type" is a label that says what
kind of value something is — a string of text, a number, a list, etc. If you
accidentally try to use a number where text is expected, TypeScript warns you
*before* you run the code. This catches a huge class of bugs early. Files end in
`.ts` (plain TypeScript) or `.tsx` (TypeScript with JSX).

You'll see types written with a colon, like:

```ts
type Msg = { role: "user" | "assistant"; content: string };
```

That reads: "A `Msg` is an object with a `role` that is either the word `user` or
`assistant`, and a `content` that is a string of text."

### Tailwind CSS — styling with utility classes

Normally you write CSS in separate files and invent your own class names.
**Tailwind CSS** flips this around: it gives you thousands of tiny pre-made
classes you apply directly in your markup. For example:

```jsx
<div className="flex items-center gap-4 text-lg">
```

- `flex` = lay children out in a row
- `items-center` = vertically center them
- `gap-4` = put spacing between them
- `text-lg` = large text

It looks busy at first, but it's fast and keeps styling right next to the thing
it styles. (`className` is just JSX's word for HTML's `class`.)

### Framer Motion — animations made easy

**Framer Motion** (imported as `framer-motion`) is a library for smooth
animations. Instead of hand-writing complicated CSS, you describe a starting
state and an ending state and it animates between them. We use it for the
fade-in-on-scroll effects and the chat window opening.

### npm — the package manager

**npm** ("Node Package Manager") downloads and manages all these libraries. When
you run `npm install`, it reads `package.json` (the project's shopping list) and
downloads everything into a folder called `node_modules`. You never edit
`node_modules` by hand.

### OpenRouter — the AI provider

**OpenRouter** is a service that gives you access to many AI models through one
API. Your "Digital Twin" chat sends questions to OpenRouter, which runs them
through a free AI model and streams the answer back.

---

## 3. How the project is organized

Here's the folder layout, with a one-line explanation of each important file:

```
site/
├── app/                      ← Next.js App Router lives here
│   ├── layout.tsx            ← The shared HTML shell wrapped around every page
│   ├── page.tsx              ← The home page: assembles all the sections
│   ├── globals.css           ← Global styles + custom Tailwind helpers
│   └── api/
│       └── chat/
│           └── route.ts      ← Server code for the AI chat (keeps the key secret)
│
├── components/               ← Reusable UI building blocks
│   ├── Nav.tsx               ← Top navigation bar
│   ├── Hero.tsx              ← Big intro banner with your name + photo
│   ├── About.tsx             ← "About me" story section
│   ├── Journey.tsx           ← Career timeline
│   ├── Skills.tsx            ← Tech stack / expertise grid
│   ├── Contact.tsx           ← Email / LinkedIn / GitHub buttons
│   ├── Footer.tsx            ← Bottom bar
│   ├── Reveal.tsx            ← Small helper that fades content in on scroll
│   └── DigitalTwin.tsx       ← The floating AI chat widget
│
├── data/
│   └── profile.ts            ← Single source of truth: résumé data + AI prompt builder
│
├── public/                   ← Files served as-is (images, etc.)
│   └── phong.jpeg            ← Your portrait photo
│
├── package.json              ← Project's dependency list + scripts
├── tailwind.config.ts        ← Tailwind theme (your custom colors, fonts)
├── tsconfig.json             ← TypeScript settings
├── next.config.mjs           ← Next.js settings
├── postcss.config.mjs        ← Plumbing that lets Tailwind process CSS
└── .env                      ← SECRET values (your OpenRouter API key)
```

**The mental model:** small components (in `components/`) are imported and
arranged by `app/page.tsx`, all wrapped in the shared shell from
`app/layout.tsx`. The AI chat talks to `app/api/chat/route.ts`, which is the only
code allowed to see your secret key.

---

## 4. A high-level walkthrough

When someone visits your site, here's what happens:

1. **The browser requests the page.** Next.js sends back the HTML produced by
   `app/layout.tsx` (the shell) wrapping `app/page.tsx` (the content).

2. **`page.tsx` assembles the sections** in order: `Nav`, `Hero`, `About`,
   `Journey`, `Skills`, `Contact`, `Footer`, and the floating `DigitalTwin`.

3. **CSS and JavaScript load.** Tailwind's compiled stylesheet paints everything
   in your dark "obsidian + electric" theme, and React "wakes up" the interactive
   parts (the mobile menu, scroll animations, the chat).

4. **As you scroll**, the `Reveal` helper notices when each section enters the
   screen and fades it in for a polished feel.

5. **If you click the chat bubble**, the `DigitalTwin` component opens. When you
   send a message, it calls `/api/chat` on the server, which forwards your
   question to OpenRouter and streams the answer back word-by-word.

The key insight for a beginner: **the page is just a list of components, and each
component is a function that returns JSX.** Once you understand one component,
you understand them all.

---

## 5. Detailed code review

Let's read real code from your project, piece by piece.

### 5.1 The shopping list — `package.json`

```json
{
  "name": "phong-trinh-portfolio",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "framer-motion": "^11.3.0",
    "next": "^14.2.35",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.6",
    "typescript": "^5.5.3"
    /* ...plus type definitions and CSS tooling */
  }
}
```

- **`scripts`** are shortcuts. `npm run dev` runs `next dev` (the live preview
  server). `npm run build` makes an optimized production version.
- **`dependencies`** are libraries your site needs to *run*.
- **`devDependencies`** are tools needed only while *developing/building*.
- The `^` before a version means "this version or any newer compatible patch."

### 5.2 The shared shell — `app/layout.tsx`

Every page shares one outer skeleton. That's `layout.tsx`:

```tsx
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "Phong Trinh — Full-Stack Software Engineer",
  description: "Chemistry PhD turned engineer building secure, scalable SaaS...",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} ...`}>
        {children}
      </body>
    </html>
  );
}
```

What to notice:

- **`next/font/google`** downloads the three Google Fonts at build time and
  serves them from your own site (faster, more private than loading from
  Google). Each font is exposed as a CSS variable like `--font-space`.
- **`metadata`** is what search engines and social-media link previews read —
  your page title and description.
- **`{children}`** is a placeholder. Whatever page is being shown gets dropped in
  there. So `layout.tsx` is the picture frame and the page is the photo.

### 5.3 The home page — `app/page.tsx`

This file is short and is the best example of the "LEGO" idea:

```tsx
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Journey from "@/components/Journey";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import DigitalTwin from "@/components/DigitalTwin";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="relative">
        <Hero />
        <div className="relative">
          <About />
          <Journey />
          <Skills />
          <Contact />
        </div>
      </main>
      <Footer />
      <DigitalTwin />
    </>
  );
}
```

- The `import` lines pull in each section component. `@/` is a shortcut meaning
  "from the project root" (configured in `tsconfig.json`).
- The page just lists the sections **in the order they appear**. Want to move
  "Skills" above "Journey"? Swap two lines. That's the power of components.
- `<>...</>` is a **React Fragment** — an invisible wrapper used when you need to
  return several elements but don't want to add an extra `<div>`.

### 5.4 A simple component — `components/Footer.tsx`

A good first component to fully understand, because it has no interactivity:

```tsx
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="shell flex flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="font-mono text-xs tracking-widest text-muted">PHONG TRINH</span>
        <p className="font-mono text-xs text-muted/70">
          © {year} · Designed &amp; built with Next.js
        </p>
        <a href="#top" className="...">Back to top ↑</a>
      </div>
    </footer>
  );
}
```

- It's a plain function that returns JSX.
- `const year = new Date().getFullYear()` runs real JavaScript, and `{year}`
  drops that value into the page. **Curly braces in JSX mean "evaluate this
  JavaScript and show the result."** So your copyright year is always current.
- The `className` strings are Tailwind utilities. `sm:flex-row` means "on small
  screens and larger, lay this out in a row" — this is how the site becomes
  **responsive** (adapts to phone vs. desktop).

### 5.5 An interactive component — `components/Nav.tsx`

This one reacts to the user, so it needs two new concepts: **client components**
and **state**.

```tsx
"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={scrolled ? "bg-ink/80 backdrop-blur-xl" : "bg-transparent"}>
      {/* ...links... */}
      <button onClick={() => setOpen((v) => !v)}>menu</button>
    </header>
  );
}
```

- **`"use client"`** at the very top is important. By default, Next.js components
  run on the *server*. Anything that needs to respond to clicks, scrolling, or
  typing must run in the *browser*, and you opt into that with this line.
- **`useState`** creates a piece of "memory" for the component. `const [open,
  setOpen] = useState(false)` means: "remember whether the menu is `open`,
  starting at `false`, and give me `setOpen` to change it." When you call
  `setOpen`, React automatically re-draws the component. This is the heart of how
  React UIs update.
- **`useEffect`** runs code in response to the component appearing. Here it
  listens for scrolling so the nav bar can add a blurred background once you
  scroll down. The `return () => ...` part is **cleanup** — it removes the
  listener when the component goes away, preventing memory leaks.
- `onClick={() => setOpen((v) => !v)}` flips the menu open/closed. `!v` means
  "the opposite of the current value."

### 5.6 Reusing logic — `components/Reveal.tsx`

This tiny component is wrapped around content to fade it in as you scroll. It
shows how components can wrap *other* content using `children`:

```tsx
"use client";
import { motion } from "framer-motion";

export default function Reveal({ children, delay = 0, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}          // start: invisible, 24px lower
      whileInView={{ opacity: 1, y: 0 }}        // when scrolled into view: fade up
      viewport={{ once: true, margin: "-80px" }} // only animate the first time
      transition={{ duration: 0.7, delay }}
    >
      {children}
    </motion.div>
  );
}
```

- `motion.div` is Framer Motion's animated version of a `<div>`.
- You describe two states — `initial` and `whileInView` — and the library
  animates between them automatically. No manual CSS keyframes needed.
- Because it renders `{children}`, you can wrap anything: `<Reveal><h2>Hi</h2></Reveal>`.
  This is **composition** — small reusable pieces wrapping content.

### 5.7 Driving UI from data — `components/Journey.tsx`

Rather than copy-pasting the same HTML for each career milestone, we store the
milestones as **data** (an array) and let the code generate the markup. This is
one of the most important patterns in frontend development.

The data itself lives in a separate file, `data/profile.ts`, so it can be reused
(more on that in [section 8](#8-improvements-applied-in-this-version)). Each
milestone carries a unique `id`:

```ts
// data/profile.ts
export type Milestone = {
  id: string;                       // stable, unique — used as the React key
  period: string;
  role: string;
  org: string;
  tag: "engineering" | "science" | "education";
  // ...
};

export const milestones: Milestone[] = [
  { id: "remine", period: "2022 — 2025", role: "Full-Stack Software Engineer", org: "Remine", tag: "engineering", /* ... */ },
  { id: "hack-reactor", period: "2021", role: "Advanced Software Engineering Immersive", org: "Hack Reactor", tag: "education", /* ... */ },
  // ...more...
];
```

```tsx
// components/Journey.tsx
import { milestones, type Milestone } from "@/data/profile";

export default function Journey() {
  return (
    <ol>
      {milestones.map((m) => (
        <li key={m.id}>
          <h3>{m.role}</h3>
          <p>{m.org}</p>
        </li>
      ))}
    </ol>
  );
}
```

- **`.map(...)`** takes the list of milestones and transforms each one into a
  `<li>`. If you add a 6th milestone to the array, a 6th card appears
  automatically — you never touch the JSX. **Data drives the UI.**
- **`key={m.id}`** gives React a stable, unique ID for each item so it can update
  the list efficiently. React requires a unique `key` on list items, and a fixed
  `id` is the safest choice (better than the array position or a piece of text —
  see [section 8](#8-improvements-applied-in-this-version)).
- The `tag` type can only be one of three exact words. If you typo `"enginering"`,
  TypeScript flags it immediately. That's the safety net in action.

### 5.8 Custom theme — `tailwind.config.ts` and `globals.css`

Tailwind ships with default colors, but we extended it with your brand palette so
you can write `text-electric-cyan` instead of memorizing hex codes:

```ts
// tailwind.config.ts (excerpt)
colors: {
  ink: { DEFAULT: "#05060A", 800: "#0D0F18", 700: "#13161F" }, // dark backgrounds
  chalk: "#F4F7FB",       // near-white text
  muted: "#8B93A7",       // grey secondary text
  electric: { cyan: "#22E0D6", blue: "#4D7CFE", violet: "#9B6CFF" },
},
```

And in `globals.css` we defined a few reusable helper classes, like the signature
gradient text:

```css
.gradient-text {
  background: linear-gradient(110deg, #22e0d6 0%, #4d7cfe 45%, #9b6cff 100%);
  -webkit-background-clip: text;   /* clip the gradient to the letter shapes */
  background-clip: text;
  color: transparent;              /* hide the normal text color so gradient shows */
}
```

That trick is how your name and headings get the cyan-to-violet gradient look.

---

## 6. The AI "Digital Twin", explained

This is the most advanced feature, so it gets its own section. There are **two**
pieces: the server route and the client widget.

### 6.1 Why the secret stays on the server

Your OpenRouter API key is a password that costs money if abused. **It must never
be sent to the browser**, because anything in the browser can be read by anyone.

Next.js solves this with **API routes**: code that runs on the *server* only. Our
file `app/api/chat/route.ts` becomes reachable at the URL `/api/chat`, but its
source code (and your key) never leaves the server. The browser only ever sees
the answer text.

### 6.2 The server route — `app/api/chat/route.ts`

```ts
import { buildSystemPrompt } from "@/data/profile";

export const runtime = "nodejs";

const MODEL = "openai/gpt-oss-120b:free";
const SYSTEM_PROMPT = buildSystemPrompt();   // assembled from the shared profile data

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;   // read the secret on the server
  if (!apiKey) return new Response("Not configured", { status: 500 });

  // Block abusive traffic before spending any AI calls (see rate limiter below).
  if (!checkRateLimit(getClientId(req))) {
    return new Response("Too many requests, slow down.", { status: 429 });
  }

  const body = await req.json();                   // the chat history sent by the browser
  const messages = /* validated + trimmed list of {role, content} */;

  const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      stream: true,                                // ask for word-by-word streaming
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  // ...read the streamed reply and forward just the text to the browser...
}
```

Key ideas:

- **`process.env.OPENROUTER_API_KEY`** reads the value from your `.env` file.
  `.env` is listed in `.gitignore`, so the secret is never shared.
- **The system prompt** is a hidden instruction that tells the AI *who to be* — in
  this case, a first-person version of you, loaded with your real résumé facts and
  told to stay on-topic and never make things up. It's now built by
  `buildSystemPrompt()` from `data/profile.ts`, so the chatbot's knowledge and the
  visible site come from the **same data**.
- **Rate limiting** (`checkRateLimit`) caps how many messages one visitor can send
  per minute, protecting your API key from abuse. See
  [section 8](#8-improvements-applied-in-this-version) for how it works.
- **`stream: true`** makes the answer arrive gradually, so the user sees text
  appear live instead of waiting for the whole reply. The route reads those small
  chunks and passes the plain text on to the browser.

> **A real bug we fixed here:** the first version added a header
> `"X-Title": "Phong Trinh — Digital Twin"`. That long dash (`—`, an "em dash") is
> not a valid character in an HTTP header, so the request crashed before it was
> even sent. The fix was to use a plain hyphen / ASCII text. Lesson: HTTP headers
> must be simple Latin characters.

### 6.3 The client widget — `components/DigitalTwin.tsx`

This is the floating chat button and panel. It keeps the conversation in state
and reads the streamed reply:

```tsx
"use client";
import { useRef, useState } from "react";

type Msg = { id: string; role: "user" | "assistant"; content: string };

export default function DigitalTwin() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);            // lets us cancel a request

  function stop() {                                                 // the "stop" button calls this
    abortRef.current?.abort();
  }

  async function send(text: string) {
    const next = [...messages, { id: uid(), role: "user", content: text }];
    const assistantId = uid();
    setMessages([...next, { id: assistantId, role: "assistant", content: "" }]);
    setStreaming(true);

    const controller = new AbortController();                       // (a) make it cancellable
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 30_000); // (b) give up after 30s

    let acc = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),                   // send full history
        signal: controller.signal,                                  // wire up cancellation
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();                // read one chunk
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { id: assistantId, role: "assistant", content: acc }]);
      }
    } catch {
      // If we aborted (stop button or timeout) or the network failed,
      // show a friendly message instead of crashing.
    } finally {
      clearTimeout(timeoutId);
      setStreaming(false);
    }
  }

  // ...JSX for the button, the message list, and the input box...
}
```

- The whole conversation lives in the `messages` state array. Each message now
  has a unique **`id`** (from `uid()`), which is used as its React `key`. Sending a
  message adds the user's text plus an empty assistant bubble, then fills that
  bubble in as chunks stream back. Each `setMessages(...)` call re-draws the chat —
  that's why you see the answer "typing" itself.
- It sends the **entire history** (`next`) every time, which is how the AI
  remembers earlier questions in the same conversation.
- `[...messages, newItem]` is the **spread operator** — it makes a fresh copy of
  the list with one more item added. React prefers you create new arrays rather
  than modifying old ones in place.
- **`AbortController`** is the browser's standard way to cancel an in-progress
  request. We keep it in a `ref` so a **stop** button can call `controller.abort()`,
  and we also `abort()` automatically after 30 seconds so a stalled reply shows a
  friendly error instead of spinning forever. While a reply is streaming, the
  send button turns into a stop button.

---

## 7. How to run it

From the `site/` folder in a terminal:

```bash
npm install     # one time: download all libraries listed in package.json
npm run dev     # start the live development server
```

Then open **http://localhost:3000** in your browser. While `npm run dev` is
running, any change you save to a file updates the browser almost instantly.

For the AI chat to work, the file `.env` must contain your key:

```
OPENROUTER_API_KEY=sk-or-...your key...
```

To make a final, optimized version for hosting: `npm run build`, then
`npm start`.

> **Tip:** if you ever see a broken-looking page after switching between
> `npm run dev` and `npm run build`, delete the auto-generated `.next` folder and
> start again. It's just a cache.

---

## 8. Improvements applied in this version

The earlier draft of this tutorial ended with five suggested improvements. **All
five have now been implemented.** This section explains *what changed*, *why it
matters*, and shows the real code so you can learn from it.

### 1. Stable, unique `id` keys for every list

**Before:** `Journey.tsx` used `key={m.role}` (long text), and the chat used the
array position, `key={i}`. Using the array index as a key can cause subtle display
bugs if a list ever reorders, and long text keys are wasteful.

**After:** every data item carries a dedicated `id`, and that's what we key on.

```ts
// data/profile.ts
export const milestones = [
  { id: "remine", role: "Full-Stack Software Engineer", /* ... */ },
  { id: "hack-reactor", role: "Advanced Software Engineering Immersive", /* ... */ },
];
```

```tsx
// Journey.tsx                       // chat messages
{milestones.map((m) => (            type Msg = { id: string; role: ...; content: string };
  <li key={m.id}> ... </li>         <div key={m.id}> ... </div>
))}
```

Chat messages get their id from a small `uid()` helper (it uses the browser's
built-in `crypto.randomUUID()`). **Why it matters:** stable keys let React track
each item correctly, preventing a whole category of hard-to-spot rendering bugs.

### 2. The portrait now uses Next.js `<Image>`

**Before:** a raw `<img src="/phong.jpeg">`. **After:**

```tsx
import Image from "next/image";

<div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] ...">
  <Image
    src="/phong.jpeg"
    alt="Phong Trinh"
    fill                                   // fill the (sized) parent container
    priority                               // load eagerly — it's the main image
    sizes="(max-width: 1024px) 100vw, 400px"
    className="object-cover"
  />
</div>
```

**Why it matters:** Next.js automatically resizes the photo for each device,
serves smaller modern formats, and reserves space so the layout doesn't "jump"
while it loads. The result is a faster site and better performance scores. Note
that the parent `<div>` now sets the `aspect-[4/5]` ratio, because the `fill`
image stretches to fit its container.

### 3. The AI chat has a stop button and a 30-second timeout

**Before:** once the AI started answering you had to wait, and a stalled network
would spin forever. **After:** we wrap each request in an `AbortController`.

```tsx
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30_000);  // auto-give-up
// ...
await fetch("/api/chat", { /* ... */ signal: controller.signal });
```

- A **stop button** (the send button turns into a square while streaming) calls
  `controller.abort()`, and we keep whatever text streamed in so far.
- If 30 seconds pass with no completion, the same `abort()` fires automatically
  and the user sees *"That took too long, so I stopped waiting."*

**Why it matters:** the feature now feels responsive and never hangs.

### 4. The chat endpoint is rate-limited

**Before:** `/api/chat` would forward unlimited requests to OpenRouter — a single
abusive visitor could burn through your usage. **After:** a small in-memory
limiter caps each visitor to **10 messages per minute**.

```ts
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;                 // one minute
const hits = new Map<string, number[]>(); // remembers recent request times per visitor

function checkRateLimit(id: string): boolean {
  const now = Date.now();
  const recent = (hits.get(id) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return false;   // too many — block (HTTP 429)
  recent.push(now);
  hits.set(id, recent);
  return true;                                      // allowed
}
```

**Why it matters:** it protects your API key from abuse. A visitor who exceeds the
limit gets a polite "slow down" message (HTTP status `429`).

> **A note on scope:** this limiter stores its counts *in memory*, which works for
> a single running server. If you ever deploy across multiple servers (or a
> serverless platform), you'd move these counts into a shared store like Redis so
> all servers agree. The code comments mention this.

### 5. The AI's knowledge lives in one shared data file

**Before:** the long career/persona text was a giant string embedded in
`route.ts`. **After:** all of it lives in `data/profile.ts`, and a function
assembles the prompt:

```ts
// data/profile.ts
export const milestones = [ /* the career timeline */ ];
export function buildSystemPrompt(): string {
  const timeline = milestones.map((m) => `- ${m.role} — ${m.org} (${m.period})...`).join("\n");
  return `You are the "Digital Twin" of Phong Trinh...
# Career timeline
${timeline}
...`;
}
```

```ts
// route.ts
import { buildSystemPrompt } from "@/data/profile";
const SYSTEM_PROMPT = buildSystemPrompt();
```

**Why it matters:** this is a **single source of truth**. The *same* `milestones`
array now feeds both the visible Journey timeline **and** the chatbot's knowledge,
so they can never drift apart. Update a job once and both update together.

### 6. The Skills and Contact sections now read from the data file too

**Before:** the skill groups and the contact buttons were hard-coded inside
`Skills.tsx` and `Contact.tsx`. **After:** that copy moved into `data/profile.ts`
(`skillGroups`, `focusAreas`, `contact`, and `contactLinks`), and the components
just map over it.

```ts
// data/profile.ts — one place to edit
export const skillGroups = [ { title: "Frontend", blurb: "...", skills: [...] }, ... ];
export const contactLinks = [
  { kind: "email", href: `mailto:${contact.email}`, label: contact.email },
  ...
];
```

**Why it matters:** it finishes the **single source of truth** idea from #5. Your
résumé facts — timeline, skills, and contact details — now live in exactly one
file that feeds every section *and* the AI.

### 7. The conversation survives a page refresh

**Before:** reloading the page wiped the chat. **After:** messages are saved to the
browser's `localStorage` and restored on the next visit, with a trash-can button in
the chat header to clear them.

```ts
// Restore once after mount (so server and client markup agree — no "hydration" warning).
useEffect(() => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) setMessages(JSON.parse(raw).filter(isValidMsg));
  setHydrated(true);
}, []);

// Save settled messages after each turn (we skip while a reply is still streaming).
useEffect(() => {
  if (!hydrated || streaming) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.filter((m) => m.content.trim())));
}, [messages, hydrated, streaming]);
```

**Why it matters:** the chat now feels like a real app — close the tab, come back,
and your conversation is still there. (We restore *after* mount on purpose: reading
`localStorage` during the first render would make the server and browser disagree
about what to show, which React warns about as a "hydration mismatch.")

### 8. The AI's replies render as real markdown

**Before:** the model's `**bold**`, bullet lists, and `[links](url)` showed up as
raw text with the asterisks visible. **After:** a tiny renderer (`components/Markdown.tsx`)
turns them into real formatting.

**Why it matters — and why we wrote our own:** the renderer builds real React
elements and **never** uses `dangerouslySetInnerHTML`, so a model reply can't smuggle
in `<script>` tags or other HTML. It also only allows `http(s)` and `mailto` links.
That makes it **safe by construction** — the safest way to show text you didn't write
yourself.

### 9. Automated tests for the trickiest logic

**Before:** nothing was tested automatically. **After:** the rate limiter and the
message-validation rules are extracted into plain, testable modules under `lib/`,
with **12 tests** (run them with `npm test`).

```ts
// lib/rateLimit.ts — the clock is injectable so tests can fast-forward time
export function createRateLimiter({ limit, windowMs, now = Date.now }) { ... }
```

```
$ npm test
 ✓ lib/rateLimit.test.ts (7 tests)
 ✓ lib/chatMessages.test.ts (5 tests)
 Test Files  2 passed (2)
      Tests  12 passed (12)
```

**Why it matters:** tests catch mistakes the moment you make them. Pulling the logic
out of the route into small functions made it both **easier to test** and easier to
read. We use [Vitest](https://vitest.dev), a fast, beginner-friendly test runner.

### 10. Basic analytics and error logging

**Before:** the server was silent — you couldn't see what visitors asked or when
calls failed. **After:** `lib/logger.ts` writes one line of JSON per event
(`request`, `completed`, `rate_limited`, `upstream_error`, …) to the server log.

```json
{"at":"2026-06-22T20:42:23Z","scope":"chat","type":"request","clientId":"…","messageCount":1,"question":"hi"}
{"at":"2026-06-22T20:42:26Z","scope":"chat","type":"completed","clientId":"…","durationMs":3232}
```

**Why it matters:** any host (Vercel, a VPS) collects these logs, so you get free
analytics — *what people ask, how often, and what broke* — with no third-party
service. For privacy we log only a short, truncated preview of each question.

---

### Further ideas (a fresh self-review)

Improvement is never "done." If you keep building, here are the next things worth
considering:

1. **Stream tokens through a typed parser** so partial markdown (a half-typed
   `**bold`) never flickers mid-stream.
2. **Add end-to-end tests** (e.g. Playwright) that open the chat in a real browser
   and assert a reply renders — complementing today's unit tests.
3. **Move rate-limit state into a shared store** (such as Upstash Redis) so the
   limit holds across multiple servers or a serverless deployment.
4. **Send analytics to a dashboard** (e.g. a privacy-friendly product like Plausible)
   so trends are visible without grepping logs.
5. **Let visitors copy or share a reply**, and add a one-click "regenerate" button.

---

### Where to go next

If you want to keep learning, the best next steps are:

1. Open `components/Footer.tsx` and try changing some text — watch it update live.
2. Change a color in `tailwind.config.ts` (e.g. `electric.cyan`) and see it ripple
   across the whole site.
3. Add a new milestone object (with a unique `id`) to the `milestones` array in
   `data/profile.ts` and watch a new timeline card appear — *and* the AI learn the
   new fact — with no other changes.

Those three exercises will teach you, by feel, the core loop of frontend work:
**edit data or markup → save → see it instantly.** Everything else builds on that.
