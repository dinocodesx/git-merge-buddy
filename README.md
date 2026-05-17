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

### Why Fetch?
- **Control:** You see what others have done before you change your local code.
- **Clean History:** You can use `rebase` to keep your changes on top of the latest work, avoiding "Merge branch 'main' of..." commits.
- **Safety:** It won't cause conflicts until you are ready to handle them.

### Syncing your environment
```bash
# 1. Get the latest metadata and commits from GitHub
git fetch origin

# 2. Review what changed (optional)
git log HEAD..origin/main --oneline

# 3. Integrate changes (The Clean Way)
# This puts your local commits on top of the new remote commits
git rebase origin/main
```

## 4. Mastering History with Rebase

### Overriding/Fixing Mistakes
If you made a bad commit or want to combine multiple small commits:
```bash
# Interactively rebase the last 5 commits
git rebase -i HEAD~<Number of Commit: 5>

# Options in the editor:
# 'pick' -> keep commit
# 'squash' -> combine into previous commit
# 'edit' -> stop and let you change the code at that point
```

### "Going Back" to a Working State
If the latest version is broken and you've lost track:
```bash
# 1. Find the commit hash where things last worked
git reflog

# 2. Hard reset to that working state
git reset --hard <commit-hash>

# 3. If you already pushed the broken code, force push the fix
git push origin <branch-name> --force-with-lease
```

## 4. GitHub CLI (`gh`) Integration

Automate the PR process without leaving the terminal.

### Create and Manage PRs
```bash
# Create a PR for the current branch
gh pr create --fill --assignee @me

# Check the status of your PRs
gh pr status

# View the diff of a PR
gh pr diff

# Merge when ready
gh pr merge --squash --delete-branch
```

## 5. Maintenance: Cleaning Up

When a feature is merged and done:
```bash
# Remove the worktree directory and the git record
git worktree remove feature-name

# Delete the local branch
git branch -D feature/my-new-task
```
