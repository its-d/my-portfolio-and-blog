# /finishing-a-development-branch

## Overview
Guide completion of development work by presenting clear options and handling chosen workflow.

**Core principle:** Verify tests → Present options → Execute choice → Clean up.

**Announce at start:** "I'm using /finishing-a-development-branch to complete this work."

## The Process

### Step 1: Verify Tests
**Before presenting options, verify tests pass:**
```bash
npm test / cargo test / pytest / go test ./...
```

**If tests fail:**
```
Tests failing (<N> failures). Must fix before completing:
[Show failures]
Cannot proceed with merge/PR until tests pass.
```
Stop. Don't proceed to Step 2.

**If tests pass:** Continue to Step 2.

### Step 2: Determine Base Branch
```bash
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```
Or ask: "This branch split from main — is that correct?"

### Step 3: Present Options
Present exactly these 4 options:
```
Implementation complete. What would you like to do?

1. Merge back to <base-branch> locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work

Which option?
```

### Step 4: Execute Choice

#### Option 1: Merge Locally
```bash
git checkout <base-branch>
git pull
git merge <feature-branch>
<test command>
git branch -d <feature-branch>  # only if tests pass
```
Then: Cleanup worktree (Step 5)

#### Option 2: Push and Create PR
```bash
git push -u origin <feature-branch>
gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
<2-3 bullets of what changed>

## Test Plan
- [ ] <verification steps>
EOF
)"
```
Then: Cleanup worktree (Step 5)

#### Option 3: Keep As-Is
Report: "Keeping branch <name>. Worktree preserved at <path>."
**Don't cleanup worktree.**

#### Option 4: Discard
**Confirm first:**
```
This will permanently delete:
- Branch <name>
- All commits: <commit-list>
- Worktree at <path>

Type 'discard' to confirm.
```
Wait for exact confirmation, then:
```bash
git checkout <base-branch>
git branch -D <feature-branch>
```
Then: Cleanup worktree (Step 5)

### Step 5: Cleanup Worktree
**For Options 1, 2, 4:**
```bash
git worktree list | grep $(git branch --show-current)
git worktree remove <worktree-path>  # if in worktree
```
**For Option 3:** Keep worktree.

## Quick Reference

| Option | Merge | Push | Keep Worktree | Cleanup Branch |
|--------|-------|------|---------------|----------------|
| 1. Merge locally | ✓ | - | - | ✓ |
| 2. Create PR | - | ✓ | ✓ | - |
| 3. Keep as-is | - | - | ✓ | - |
| 4. Discard | - | - | - | ✓ (force) |

## Never
- Proceed with failing tests
- Merge without verifying tests on result
- Delete work without confirmation
- Force-push without explicit request

## Integration
**Called by:**
- /executing-plans (Step 5) — after all batches complete
- /subagent-driven-development (Step 7) — after all tasks complete

**Pairs with:**
- /using-git-worktrees — cleans up worktree created by that command
