# /subagent-driven-development

## Overview
Execute plan by dispatching fresh subagent per task, with two-stage review after each: spec compliance review first, then code quality review.

**Core principle:** Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration

## When to Use
**Use when:**
- You have an implementation plan
- Tasks are mostly independent
- You want to stay in this session

**vs. /executing-plans (parallel session):**
- Same session (no context switch)
- Fresh subagent per task (no context pollution)
- Two-stage review after each task
- Faster iteration

## The Process

```
Read plan → extract all tasks → proceed task by task:

For each task:
  1. Dispatch implementer subagent
  2. Answer any questions before they proceed
  3. Implementer implements, tests, commits, self-reviews
  4. Dispatch spec compliance reviewer
     → If issues found: implementer fixes → re-review
  5. Dispatch code quality reviewer
     → If issues found: implementer fixes → re-review
  6. Mark task complete

After all tasks:
  → Dispatch final code reviewer for entire implementation
  → Run /finishing-a-development-branch
```

## Subagent Prompt Templates

### Implementer Prompt
```markdown
You are implementing Task [N] from [plan-file].

**Task:** [Full task text from plan]

**Codebase context:** [Relevant files, patterns, tech stack]

**Instructions:**
1. Ask any clarifying questions BEFORE implementing
2. Follow TDD: write failing test first, implement, verify passing
3. Commit when complete
4. Self-review your work before reporting back

**Report back:** What you built, what tests you wrote, outcome of success criteria.
```

### Spec Compliance Reviewer Prompt
```markdown
You are reviewing Task [N] implementation for spec compliance.

**Original task spec:** [Full task text]

**Implementation commits:** [git SHAs]

**Your job:**
1. Read the spec carefully
2. Read the implementation
3. Verify EVERY requirement is met — nothing missing, nothing extra
4. Report: ✅ Spec compliant OR ❌ Issues: [list specific gaps]

Be precise. "Close enough" is not compliant.
```

### Code Quality Reviewer Prompt
```markdown
You are reviewing Task [N] implementation for code quality.

**Implementation commits:** [git SHAs]

**Your job:**
1. Read the implementation
2. Check: naming, structure, error handling, test quality, edge cases
3. Report: ✅ Approved OR ❌ Issues (label each: Critical/Important/Minor)

Focus on Important+ issues only. Don't nitpick style.
```

## Key Rules

**Never:**
- Start on main/master without explicit user consent
- Skip spec compliance review
- Skip code quality review
- Proceed with unfixed issues from either review
- Dispatch multiple implementation subagents in parallel (conflicts)
- Accept "close enough" on spec compliance

**Always:**
- Answer subagent questions before letting them proceed
- Run spec compliance BEFORE code quality (wrong order defeats the purpose)
- Re-review after fixes — don't assume they worked

## Integration
**Required:**
- Run /using-git-worktrees FIRST — isolated workspace required
- /writing-plans — creates the plan this command executes
- /finishing-a-development-branch — run after all tasks complete

**Subagents should use:**
- /test-driven-development — for each task implementation
