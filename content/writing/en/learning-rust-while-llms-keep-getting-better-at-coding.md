---
title: Learning Rust While LLMs Keep Getting Better at Coding
frenchVersion: content/writing/fr/apprendre-rust-quand-les-llm-codent-deja-tres-bien.md
summary: I’m seriously learning Rust while LLMs keep getting better at coding. A
  personal look at learning, coding agents, and what I still want to understand.
category: Development
tags:
  - Rust
  - LLM
  - programming
  - learning
  - software engineering
publishedAt: 2025-02-08
draft: false
---
I keep wondering whether I picked the worst possible time to seriously learn Rust.

It is probably the language I want to get good at the most. I also write quite a bit of Python for scripts, but Rust is the one that makes me want to understand what I am doing instead of stopping at "well, it works."

The weird part is that even the idea of "getting good at a language" is starting to feel different.

I can spend an evening trying to understand why three characters upset the compiler, while a coding model can take a vague description of a project and produce more code in a few minutes than I would have written all night.

And yes, I know. More code != better code.

That is exactly why this is not another "AI is better than developers now" post. I do not think that. It still does not stop me from watching how fast these systems are improving and occasionally wondering what, exactly, I am training myself to do.

## I can waste an unreasonable amount of time on one tiny thing

When I learn something, I am very bad at accepting "that is just how you write it" as an explanation.

Recently I got stuck thinking about an expression as basic as:

```rust
path == "."
```

Obviously I can now say that it compares two values and evaluates to a boolean.

But that was not really the part I wanted to understand.

I wanted to know why the expression itself is already a question. What exactly is being compared? Why does the result become `true` or `false`? How does that value then get used by an `if`? Why do I not need some explicit "is this true?" syntax around it?

From the outside, this is almost comically basic. If you already understand the concept, it takes a few seconds. If you are learning and hate leaving fuzzy gaps in your mental model, it can take a lot longer.

I actually like that part.

Well, I like it until I have spent forty minutes staring at an error and the fix turns out to be one missing `&`.

Rust is very good at this kind of relationship. You run:

```bash
cargo run
```

The compiler explains, in painful detail, why your idea is bad. You fix it. The compiler discovers a second reason why your idea was bad. You fix that too. Then for about thirty seconds, "it compiles" feels like a complete software quality standard.

Then you run the program.

Right.

But that loop is a big part of why I like learning this stuff. The moment when an error that looked completely arbitrary finally makes sense. The point where I understand why the borrow checker rejected something instead of just finding the correct sequence of characters to make it shut up.

I do not want to memorize Rust.

I want the mental model behind it.

That takes time.

## Meanwhile, the agent has already finished the README

Starting a project makes the contrast much harder to ignore.

Me:

```bash
cargo new something
cd something
```

Then I start thinking about the layout, the types, error handling, dependencies, what belongs in which module, and all the things I still do not know.

I was about to add `git init` here for the joke, then remembered Cargo already initializes Git by default when it can.

Even in my own example, the tool had already replaced one step.

A coding agent can start from roughly the same place and go much further almost immediately. It can build out the structure, touch multiple modules, write tests, run commands, fix failures, change CI and prepare a diff.

And probably generate a README with a `🚀 Features` section for a 3000-line CLI that was originally supposed to do three things.

That does not mean the result is good.

The code can be wrong. The architecture can be weird. It can miss edge cases, add a dependency for no good reason, make a terrible security decision, or create twenty files that all look justified until the first real refactor.

Fast generation is not the same thing as maintainable software.

I know that.

The annoying part is that this does not really solve the thing bothering me.

Even if I still need to review the code, debug it, test it, fix it and sometimes delete half of it, the starting point has changed.

Knowing how to build something used to be directly tied to knowing how to write it.

Now I can sometimes get the thing before I have learned how I would have written it.

I am not sure what to do with that.

If my only goal is the finished program, the answer is obvious. Use the best tools available. Hand off whatever can be automated, review the result, test it, keep the good parts and move on.

Doing everything manually just so I can say it was "100% hand-written" would mostly be a sophisticated way to waste time.

I am a developer. If a tool genuinely makes me more effective, I am going to use it.

I am just not convinced the finished program is the only thing I care about.

## Maybe the part I am automating is the part I actually like

Obviously I like having the result.

A tool that works. A project I can run. Some dumb idea that went from "wouldn't it be funny if..." to a real repository.

But I also like the part before that.

Figuring out why something broke.

Changing one thing.

Running it again.

Reading the logs.

Realizing the original assumption was wrong.

Refactoring the first ugly version.

Spending far too much time on a detail almost nobody will ever notice.

Then finally understanding it.

I do not want to turn this into some romantic "real programmers suffer in terminals" thing. Struggling is not inherently valuable. I have no interest in preserving compiler errors like an endangered species.

If a model can save me three hours of useless boilerplate, great.

If it can find a bug faster than I can, even better.

If it writes a test I did not think of, fair enough.

But if I consistently hand it every part I do not yet know how to do, when exactly do I learn how to do those parts?

And if I never learn them properly, when do I become qualified to judge what it gives me?

That loop gets weird fast.

A common answer is that developers will spend more time reviewing generated code. Fine. But good code review requires understanding the code. Debugging requires understanding it. Choosing between two architectures requires understanding them. Noticing that an abstraction is pointless, an API is badly shaped or a fix is hiding the real bug requires understanding what is happening.

So I still need to learn.

Except the tool that can help me learn faster is also the tool that can complete a huge portion of the exercises that would have forced me to learn.

Skill issue, probably.

I can put rules around how I use models while learning. No full solution generation. Explanations first. Hints instead of code. Review my version after I have tried it myself.

That is often what I do.

The problem is that I still know the faster button is sitting right there.

After an hour stuck on something, that button starts looking extremely reasonable.

And it keeps getting better.

That is what changes the feeling for me.

This is not just faster Stack Overflow. It is not just autocomplete. I can hand an agent a task and get back code, tests and repository changes that have already been run.

So when I am still trying to understand why an `if` receives a boolean, the comparison can feel slightly ridiculous.

## I am not sure what "learning a language" means anymore

A few years ago I probably would have defined it pretty simply.

Learning Rust means gradually becoming able to write more complicated programs in Rust.

That definition still works.

I am just not sure it is enough anymore.

Am I learning Rust so I can personally write any program I need?

Or am I learning it so I can read Rust well, catch mistakes, direct an agent, understand a stack trace, debug, refactor, choose the right abstraction and notice when the model is confidently producing nonsense?

Both require knowing the language.

They are still not quite the same relationship with code.

And, more importantly, they are not quite the same hobby.

If all I cared about was the output, none of this would bother me. Better tools would simply be better.

But some of the satisfaction comes from being able to produce the thing myself.

Not to prove anything. Just because understanding a system I did not understand an hour ago feels good.

I want to learn.

I want to build.

I want to use the best tools available.

Those three goals sound perfectly compatible.

In practice, they sometimes start stepping on each other.

I could ask a model to write the next chunk of Rust for me. It would probably be faster. It would almost certainly avoid some mistakes I am about to make. And if the immediate goal is just to move the project forward, that might be the correct decision.

I am probably still going to open `main.rs` and try it myself first.

Not because I think I can beat the models at this game. That would be a pretty terrible reason to learn anything in 2026.

I think I just still want to understand the code before I completely outsource the act of writing it.

I do not know yet whether that is a normal phase of learning, a sensible way to use these tools, or me trying to keep hold of the part of programming I like while it changes in front of me.

Anyway.

```
cargo run
```

