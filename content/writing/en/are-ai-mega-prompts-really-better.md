---
title: Are AI Mega-Prompts Really Better?
frenchVersion: content/writing/fr/les-mega-prompts-ia-sont-ils-vraiment-meilleurs.md
summary: Are huge AI-generated prompts really better? A look at instruction
  overload, long-context limits, prompt optimization and context engineering in
  2026.
category: Artificial Intelligence
tags:
  - prompt engineering
  - context engineering
  - LLM
  - AI agents
  - GPT-6
  - Claude
publishedAt: 2026-10-22
draft: false
---
For a while now, I have had a slightly strange habit when working with AI systems.

When a task feels important, I do not always tell the target model what I want directly. I might first explain the idea to another AI, ask it to produce a “perfect prompt,” get back an 8,000, 10,000 or 15,000-character wall of sections, constraints, procedures and checks, then send that entire prompt to the AI that is supposed to do the actual work.

On paper, the logic seems reasonable: the more precise the prompt, the better the AI should understand what is expected.

The problem is that **precision and length are not the same thing**.

With 2026 models such as GPT-6 Astra and Sol, Claude 5.5, Gemini 4 Argon and the agentic systems built around them, the opposite question is now worth asking:

> Can trying to specify everything eventually make the AI worse?

I ran several independent research passes on the topic, then checked the most important claims against official documentation and recent technical literature.

The answer is much more interesting than “short prompts are good” or “long prompts are good.”

## The conclusion in one sentence

**A huge AI-generated prompt is not inherently better than a much shorter prompt written by a human.**

What matters most is what the prompt actually contributes: information the AI cannot know on its own, constraints that change the solution, the expected result, the criteria for deciding when the work is finished and, for an agent, its permissions and limits.

In other words:

> **What matters is not the amount of text. It is the amount of useful signal.**

The distinction matters in the opposite direction too. A long prompt is not automatically bad.

A complex software migration can legitimately require several pages of specifications. An agent working on a repository for an hour needs far more information than a chatbot being asked to explain `git rebase`.

The problem starts when prompt length increases **without a matching increase in useful information**.

## Why a large prompt often feels better

Consider two requests.

The first:

> Find me the best VPS.

The second specifies the exact budget, location, storage requirement, acceptable billing model, prohibited fees, whether IPv4 is needed and the reliability criteria.

The second prompt is likely to produce a better answer.

But it would be wrong to conclude that it is better simply because it is longer.

It is better because it contains **more information required to make the decision**.

That is the basic problem with many prompt comparisons: several variables change at the same time.

To study the question properly, we need to separate at least:

- length;

- number of instructions;

- amount of useful information;

- redundancy;

- organization;

- irrelevant context;

- the system in which the prompt is being used.

A 12,000-character prompt containing twelve independent business constraints has almost nothing in common with a 12,000-character prompt that repeats the same four intentions under different headings.

## Models have limited capacity to follow many rules at once

This is one of the most interesting experimental findings around the topic.

In *When Instructions Multiply*, published in Findings of EMNLP 2025, researchers created two controlled benchmarks: ManyIFEval for text, with up to ten simultaneous instructions, and StyleMBPP for code, with up to six constraints.

Across ten different LLMs, performance declined consistently as the number of instructions increased.

IFScale pushes the idea much further, with up to **500 simultaneous word-inclusion instructions**. Across twenty models from seven providers, the best model reached only 68% compliance at the highest level.

Obviously, people do not normally ask ChatGPT to include 500 mandatory words in a report.

The benchmark therefore does not justify a rule such as:

> “Once you go beyond 80 rules, your prompt is bad.”

But it demonstrates something much more important:

**additional instructions are not free.**

A one-million-token context window does not mean a model can perfectly follow one million tokens of instructions.

Those are two completely different properties.

## A large context window is not perfect memory

Modern models advertise enormous context windows.

GPT-6 Astra, GPT-6.1 Sol and Luna currently support around 1.05 million tokens through the API. Gemini 4 Argon is also designed for extremely large contexts.

It is tempting to conclude:

> “10,000 characters is nothing. I can put as much text as I want into the prompt.”

That conclusion is wrong.

Maximum context size tells us how much information can be carried. It does not guarantee that every piece of that information will be used equally well.

NoLiMa, published at ICML 2025, studied models with large context windows while removing some of the simple lexical-matching shortcuts normally available for retrieval.

At 32,000 tokens, most tested models had already fallen below half of their short-context performance.

Another study published in Findings of EMNLP 2025 goes further by trying to eliminate the retrieval problem itself.

Even when the relevant information was perfectly available, performance on mathematics, question-answering and programming tasks declined as context grew longer. Depending on the configuration, the observed drops ranged from 13.9% to 85%.

This does not prove that a 10,000-character prompt automatically hurts GPT-6 Astra in 2026.

The tested models and tasks are not identical.

But it does break a much simpler assumption:

> **Extra text is not necessarily free just because it fits inside the context window.**

## The model vendors themselves are removing prompting

This is probably one of the most interesting changes of the last few years.

In September 2026, OpenAI published an article explicitly titled *Rethinking skills and prompts for GPT-6 Astra*.

The message is fairly clear: many techniques used to guide earlier models are becoming unnecessary or even counterproductive.

OpenAI explains, among other things, that overly long skill descriptions can be truncated, overlapping skills can trigger the wrong instructions, forcing the model to read several documents every time wastes context and highly detailed “recipes” can now **overconstrain Astra**.

The official GPT-6 family guide reduces the idea to something close to a normal human specification: give the model the desired outcome, the intended audience, the relevant context and important constraints, then define what “done” means.

OpenAI also recommends simple, direct prompts for reasoning models and advises against artificial chain-of-thought requests such as “think step by step.”

Anthropic has moved in a similar direction.

In 2026, the company said it had removed **more than 80% of Claude Code’s system prompt** for its new Claude 5 models.

That does not mean instructions are no longer useful.

It means more capable models need less explanation of **how to reason through every step**.

## Claude Code is an especially useful example

Claude Code can distribute instructions across several places: `CLAUDE.md`, path-specific rules, skills, subagents, hooks and additional system prompts.

Why so many mechanisms?

Because not every piece of information should live in the same place.

Anthropic explains that a root `CLAUDE.md` is loaded in every session, so every line consumes context even when it is irrelevant to the current task.

Its current recommendation is to keep that file under roughly 200 lines and move specialized procedures into skills, or local rules into files that are loaded only when needed.

Google applies the same philosophy in Antigravity.

Loading every rule and every tool into context creates what Google calls **tool bloat**: more cost, more latency and more confusion. Its Skills therefore use *progressive disclosure*: the agent first knows that a capability exists, then loads the full content only when the task requires it.

That architecture says something fundamental about where AI usage is heading:

**the problem is no longer just writing a good prompt. It is organizing context.**

## From prompt engineering to context engineering

Anthropic describes this shift very directly.

Prompt engineering is mainly about deciding **how to write the instructions**.

Context engineering is about deciding **which information should be present in the model’s context at that specific moment**.

That includes the user prompt, system prompt, available tools, files, repository code, memory, search results, the agent’s previous actions, skills and potentially the outputs of subagents.

The distinction becomes essential with agents.

For a classic chatbot, it is still reasonable to think in terms of:

> question → answer.

With Codex, Claude Code, Antigravity or ChatGPT Work, the process looks more like:

> mission → observation → action → new state → new observation → verification → next action.

Reinjecting the entire project knowledge base at every step is not necessarily smart.

The best context is therefore not the biggest one.

It is **the right context at the right time**.

## What about AI-generated prompts?

This is where the question becomes especially interesting.

Imagine this workflow:

> human idea → prompt-writing AI → 12,000-character prompt → target AI.

Is that a good idea?

Not necessarily.

An AI can genuinely improve a prompt by uncovering information the user forgot to provide.

It might ask:

- what is the budget?

- what compatibility is required?

- who are the users?

- which actions are forbidden?

- how will success be measured?

- which assumptions are still unknown?

In that case, the AI creates **new useful information**.

That is valuable.

But there is another kind of “optimization” that is much less convincing:

> “Act as a world-class senior software architect, UX expert, security specialist, market analyst and strategic consultant. This mission is extremely important. Proceed methodically. Phase one… phase two… phase three… Be exhaustive, rigorous and precise…”

The amount of text increased.

The amount of information barely did.

Sometimes the generator goes even further: it introduces a methodology the user never requested, arbitrarily fixes the number of phases, imposes a format, lists technologies or turns assumed preferences into hard constraints.

At that point, the danger is not only that the target AI has to read too much text.

The danger is that **the human no longer knows exactly what they asked for**.

## Automatic prompt optimization really does work

It would be a mistake to conclude that AI should never help write prompts.

PromptWizard, published in Findings of ACL 2025, uses a loop of critique, feedback and synthesis to automatically optimize instructions and examples. It reports improvements across 45 tasks.

SPRIG, accepted at ICLR 2026, optimizes system prompts across 47 task types and shows that an optimized system prompt can compete with prompts specialized task by task.

The distinction is crucial.

These systems do not simply work like this:

> “write more text.”

They work more like this:

> **prompt → results → error measurement → modification → new evaluation.**

OpenAI currently applies the same logic in its Prompt Optimizer: use datasets, annotations and graders to improve a prompt, then reevaluate the new version and review it with a human. OpenAI even warns that an optimization can improve the overall score while making some individual inputs worse.

That is probably the best answer to the question:

> **Yes, an AI can be excellent at improving a prompt. But its main value is not writing more. It is finding what is missing and what is failing.**

## ChatGPT, Deep Research and Codex should not receive the same prompts

A common mistake is applying the same prompting philosophy to every product.

For a normal ChatGPT conversation, most of the time you can directly provide:

**objective + essential context + important constraints + desired result.**

For a Deep Research task, more framing becomes useful:

**exact question + time period + definitions + source types + evidence standard + deliverable.**

But there is usually no need to tell the research agent which twenty Google queries it must run in a predetermined order. Planning and adapting the research is part of its job.

For Codex or Claude Code, a complex task can require a huge amount of information.

But that information should be distributed.

Stable repository rules can live in `AGENTS.md` or `CLAUDE.md`.

A specialized procedure can become a Skill.

Executable constraints can be enforced by tests, the linter or hooks.

The repository contains the real state of the software.

The current prompt then mainly needs to say:

> **here is what must change, why it must change, what must not break and how to recognize that the task is finished.**

That is a much more robust architecture than pasting fifteen pages of instructions into every new conversation.

## One important limitation: we still do not have the perfect experiment

This is probably the point I find most important after doing the research.

We now have good evidence that:

- instruction following degrades as the number of instructions increases;

- long context is not used perfectly;

- irrelevant context can hurt;

- modern models often need less scaffolding;

- contextual distribution and on-demand loading have become core practices in modern agents;

- automatic prompt optimization can work when it uses real evaluations.

But we still do not have a huge, clean study taking the exact frontier models of October 2026, GPT-6 Astra, Claude Opus 5.5, Gemini 4 Argon and others, and testing them with **strictly constant information** across:

1. a natural human prompt;

2. a structured human prompt;

3. the same prompt inflated by an AI;

4. an expert compressed version;

5. a deliberately redundant version.

That benchmark would be extremely interesting.

Until it exists, claiming that “8,000 characters is optimal” or that “performance drops after 5,000 characters” would be false precision.

There is no magic number.

## The rule I am keeping

After this research, I would no longer try to produce **the most complete prompt possible**.

I would aim for:

> **the smallest context that still contains every piece of information that could reasonably change the correct answer or execution.**

Every sentence can go through a simple test:

> **If I remove this sentence, what concrete error becomes more likely?**

If there is a good answer, the sentence probably belongs.

If the only answer is:

> “it makes the prompt look more serious,”

it can probably go.

## So, are mega-prompts bullshit?

Not exactly.

A 15,000-character specification can be excellent.

A 30,000-character specification can even be necessary.

But it should be long **because the problem genuinely contains that much independent information**, not because an AI turned five ideas into twenty sections.

The real shift in 2026 is not:

> “use short prompts.”

It is:

> **stop optimizing the number of words. Optimize the information the model receives, where that information is placed and when it becomes available.**

For modern agents, that shift already has a name:

**context engineering.**

The best prompt is probably not the one that looks most impressive when you scroll through it.

It is the one where almost every sentence has a reason to exist.

