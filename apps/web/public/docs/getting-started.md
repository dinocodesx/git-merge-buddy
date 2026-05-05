# Welcome to Git Merge Buddy

Git Merge Buddy is designed to integrate seamlessly into your existing workflow. Follow these steps to get up and running in minutes.

## 1. Install the App

Navigate to the GitHub Marketplace and find Git Merge Buddy. Install it on your chosen organization or specific repositories.

```bash
gh extension install gitmergebuddy/cli
```

## 2. Configure Rules

Create a `.gitmergebuddy.yaml` file in your repository root to define your custom quality gates.

```yaml
rules:
  performance: aggressive
  security: paranoid
  architectural: true
  ignore_paths:
    - "**/test/**"
    - "legacy/"
```

> **Pro Tip**
> Git Merge Buddy works best when individual PRs are kept under 300 lines. Smaller context leads to better reasoning and deeper insights.
