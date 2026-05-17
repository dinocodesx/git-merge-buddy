# Optimized Git & GitHub Workflow

This guide outlines a high-performance workflow using Git Worktrees, a Bare Repository setup, and efficient rebase strategies.

## 1. Setup: The Bare Repository Approach

Using a bare repository allows you to manage multiple branches as sibling directories (worktrees) without them being nested or interfering with each other.

### Initial Initialization
```bash
mkdir <repo-name>
cd <repo-name>

# Clone the repository as a bare repo into a hidden folder
git clone <repo-url> --bare .git

# Add your main branch as the first worktree
git worktree add ./main
```

## 2. Fast Feature Development

Instead of `git checkout -b`, use worktrees to create a new isolated environment for every feature or bug fix.

### Create a New Branch & Worktree
```bash
# Create a new branch and a directory for it
git worktree add -b <feature/my-new-task> ./<feature-name>

# Change into that directory
cd <feature-name>
```

### Benefits
- **Zero-cost switching:** Switch between "main" and "feature" just by changing directories (`cd ../main`). No more `git stash` or waiting for dependencies to re-install.
- **Parallel Testing:** Run tests in one worktree while coding in another.

## 3. The "Fetch, Don't Pull" Rule

Avoid `git pull`. It performs a `fetch` and then an automatic `merge`, which often creates "messy" merge commits that clutter your history. Instead, use `fetch` to see what changed, then decide how to integrate it.

### Syncing your environment
```bash
# 1. Get the latest metadata and commits from GitHub
git fetch origin

# 2. Review what changed (optional)
git log HEAD..origin/main --oneline

# 3. Integrate changes (The Clean Way)
git rebase origin/main
```

## 4. Mastering History & Quick Fixes

### Fixing the Very Last Commit (Amend)
If you made a typo in the message or forgot to add a small change:
```bash
# Change the message of the last commit
git commit --amend -m "New and correct message"

# Add a forgotten file to the last commit without changing the message
git add .
git commit --amend --no-edit
```

### Undoing Changes (Revert)
If a commit is already pushed and you need to "undo" it safely without rewriting history:
```bash
# Creates a new commit that is the exact opposite of the target commit
git revert <commit-hash>
```

### Interactively Overriding History
```bash
# Interactively rebase the last X commits
git rebase -i HEAD~<number>

# Options: 'pick' (keep), 'squash' (combine), 'edit' (stop and change)
```

### "Going Back" to a Working State
```bash
# 1. Find the commit hash where things last worked
git reflog

# 2. Hard reset to that working state
git reset --hard <commit-hash>

# 3. Force push if you already pushed the broken code
git push origin <branch-name> --force-with-lease
```

## 5. Temporary Storage (Stashing)

Even with worktrees, stashing is useful for moving small changes out of the way without committing.

```bash
# Save changes with a name
git stash push -m "work-in-progress-on-ui"

# List all stashes
git stash list

# Apply the most recent stash and remove it from the list
git stash pop
```

## 6. Power User Visibility

Get full visibility into your branches and worktrees.

### Visualizing History
```bash
# The ultimate visualization command
git log --graph --oneline --decorate --all
```

### Branch & Worktree Audit
```bash
# See all local branches and their sync status with remote
git branch -vv

# See all active worktrees and their locations
git worktree list

# Find merged branches for cleanup
git branch --merged
```

## 7. GitHub CLI (`gh`) Integration

Automate the PR process without leaving the terminal.

```bash
# Create a PR for the current branch
gh pr create --fill --assignee @me

# Check the status of your PRs
gh pr status

# Merge when ready
gh pr merge --squash --delete-branch
```

## 8. Maintenance: Cleaning Up

```bash
# Remove the worktree directory and the git record
git worktree remove <feature-name>

# Delete the local branch
git branch -D <feature/branch-name>

# Clean up internal references if a worktree folder was deleted manually
git worktree prune
```
