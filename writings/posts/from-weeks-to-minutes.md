---
layout: layouts/blog.njk
title: "From Weeks to Minutes: How AI Changed the Way I Build"
date: 2026-04-12
summary: My journey from manual everything to fully AI-assisted development, and what it means for shipping faster.
description: How I went from skeptic to power user across ChatGPT, Cursor, and Claude Code, and what I learned about prompting, design-first development, and building at a higher altitude.
categories:
  - blog
  - ai
---

I thought AI was cheating.

When friends started using ChatGPT, I kept my distance. I was an infrastructure engineer building real skills in AWS, Terraform, and cloud architecture. The last thing I wanted was a crutch that would stop me from actually learning. If I couldn't debug it myself, I didn't really understand it. That was the rule.

It took me seven months, three tools, one certification, and a lot of broken deployments to realize how wrong I was.

## The First Try: ChatGPT as a Search Engine

I eventually gave ChatGPT a shot. At first, it was useful. I'd ask coding questions, get quick answers for Terraform syntax, troubleshoot error messages. It was like Stack Overflow with fewer tabs.

But I noticed a pattern. I was copying answers without understanding them. When something broke, my first instinct was to paste the error back into ChatGPT instead of reading the logs myself. I was moving faster, but I was learning slower.

So I pulled back. I went back to reading docs, debugging manually, and building the hard way. I needed to keep my fundamentals sharp. The AI tools sat unused for a while.

## Building the Hard Way: Two Weeks on EKS

When I decided to build a Terraform-based EKS Fargate framework, I gave ChatGPT another shot as a secondary tool. It helped me move a bit faster on the Terraform side, a language I was still relatively new to.

But then came Kubernetes.

I had limited experience with K8s, and almost none with Helm. The second week of that project was pure troubleshooting. The biggest issue was an incompatibility between the AWS EKS version and CoreDNS. The node would fail instantly, restart in a loop, crash the deployment, and take the whole cluster down with it.

After two weeks I had a working framework, but it was rough. Deploying required running make commands in a specific order, tearing down was inconsistent, and sometimes you had to manually delete nodes and VPC resources just to get back to a clean state. It worked, but it wasn't something I'd hand to another engineer and say "just run this."

I made it public anyway. It was a learning project, and I was proud of finishing it.

## The Cursor Phase: Breaking Things Faster

Then I heard about Cursor. An IDE with AI built in. Code generation, inline suggestions, full-file edits. It felt like the future.

I started using it to revamp the EKS framework and build out my portfolio site. At first I was fully invested. This was going to change everything.

Then reality hit.

Every time I asked Cursor to make a change, it would fix one thing and break two others. I'd ask it to update an AWS resource, and it would modify the resource without considering its dependencies, triggering a chain of failures across the entire Terraform state. On this portfolio site, changing a logo on the hero section would break the page layout, reorder elements, and corrupt image formatting.

The problem wasn't the tool. The problem was me.

I didn't know how to prompt. I didn't know how to break work into small, isolated tasks. I didn't know how to give the AI enough context to make good decisions. I was treating it like a magic wand instead of a collaborator, and the results reflected that.

## The Turning Point: Learning How AI Actually Works

After struggling through those experiences, I took a step back. I got the AWS AI Practitioner certification to better understand what was happening behind the scenes. I studied prompting techniques, guardrails, context management, and how to think about AI as a tool rather than a replacement.

The cert itself took a couple weeks of prep, but the real value was the mental shift. I stopped asking "do this for me" and started asking "help me think through this." I learned to:

- Write design documents before writing code
- Break work into small, reviewable tasks
- Give explicit context about what exists and what I want to change
- Review AI output critically instead of accepting it blindly

## Claude Code: Where It Clicked

Armed with better prompting skills, I migrated to Claude Code. This is where everything changed.

Instead of asking for a complete solution and hoping for the best, I started with design docs. I'd outline the architecture, define the goals, specify what's in scope and what's not. Then I'd work through implementation task by task, reviewing each change before moving to the next.

The EKS framework I'd spent two weeks building and struggling with? I revamped the entire deployment process, making it consistent, automated, and reliable. No more manual deletions, no more running commands in a specific order, no more inconsistent teardowns.

This portfolio website? I'd attempted it before with Cursor and hit wall after wall. With Claude Code and the right approach, I built a cyberpunk-themed portfolio with a split-screen hero, animated typewriter, Credly badge wall, and a full writings section. Not because the AI got smarter between February and now, but because I learned how to use it.

I went from dreaming about building things like this to actually shipping them.

## What I Got Wrong About AI

My initial fear was that using AI tools would make me unable to think and troubleshoot on my own. That I'd become dependent and my engineering skills would atrophy.

The opposite happened.

My ability to write code line by line stayed about the same. But my ability to understand code, design solutions, and think about systems grew significantly. When AI handles the boilerplate, you spend more time on architecture, UX considerations, and system design. You learn by reviewing what it produces, questioning its decisions, and understanding why one approach works better than another.

I used to envy engineers who started coding early in life or studied computer science in school. I assumed I'd never catch up, that I'd always be too far behind the curve. AI closed that gap. Not by doing the work for me, but by letting me operate at a higher level while still building real things.

## What You Can Build Is Only Limited by What You Can Imagine

Seven months ago, I was manually writing every line, debugging every error from scratch, and spending weeks on projects that now take days. Not because I was bad at my job, but because I was working at the wrong altitude.

AI didn't replace my skills. It changed which skills matter most. The engineers who will thrive aren't the ones who can write the most code. They're the ones who can think clearly, design well, and communicate precisely, whether that's with a team or with an AI.

If you're on the fence about adopting AI tools, here's my advice: don't start by asking it to build something. Start by asking it to help you think. The rest follows.

**Keywords:** <span class="blog-keywords">AI, Claude Code, Cursor, ChatGPT, Developer Productivity, Agentic AI, Cloud Engineering, Career Growth</span>
