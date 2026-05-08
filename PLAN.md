# PLAN.md — Agent Collaboration Platform MVP

## Summary
Build a Docker-first monorepo for a multi-user software collaboration platform where teams create projects, manage tasks, delegate work to humans or agents, and review GitHub issues and pull requests from one shared workspace.

This MVP is intentionally not “Slack clone + GitHub clone + CI system.” It is a GitHub-centered collaboration layer with:
- a public marketing site
- an authenticated product app
- a GraphQL backend
- an async worker runtime
- Postgres for durable product state
- Redis for background job orchestration
- S3-compatible storage for artifacts
- Better Auth for authentication
- Prisma as the ORM
- GitHub as the only SCM/integration provider in v1

Core demo loop:
1. User signs in with GitHub
2. User creates or joins a workspace
3. User creates a project and connects one GitHub repo
4. User creates/imports a task
5. User assigns the task to a teammate or agent
6. Worker executes GitHub/AI jobs
7. Results appear in task thread + review inbox
8. Team reviews and syncs comments/status back to GitHub
9. Task is completed when deliverable is accepted or PR is merged

## Product Boundaries
### Included in MVP
- Multi-user shared workspaces
- Workspace roles: `OWNER`, `ADMIN`, `MEMBER`
- One primary GitHub repo per project
- Task management
- Task discussion threads
- Unified review inbox
- Agent run tracking
- GitHub issue and PR sync
- Async collaboration via SSE + targeted polling
- Audit/activity feed
- Object storage for agent artifacts

### Explicitly out of scope for MVP
- Real-time chat channels / DMs / voice
- Mobile and desktop apps
- GitLab / Bitbucket support
- Full CI/CD orchestration
- Branch protection administration
- Billing / subscriptions
- Fine-grained RBAC beyond 3 workspace roles
- Multi-repo project mapping
- Autonomous multi-agent swarm planning without human delegation
- Full platform-native diff viewer replacing GitHub

## Monorepo Structure
```text
.
├── apps
│   ├── client/                    # Next.js authenticated app (App Router)
│   ├── web/                       # Next.js public landing site
│   ├── api/                       # NestJS GraphQL API
│   └── worker/                    # NestJS worker with BullMQ processors
│
├── packages
│   ├── auth/                      # Better Auth server/client shared setup
│   ├── db/                        # Prisma schema, migrations, generated client
│   ├── github/                    # GitHub App SDK wrappers and helpers
│   ├── ai/                        # AI/agent provider abstractions
│   ├── queue/                     # BullMQ queues, payload contracts, constants
│   ├── contracts/                 # Shared enums, DTO shapes, event shapes
│   ├── config/                    # Zod env parsing and config helpers
│   ├── test-utils/                # Factories, fixtures, test helpers
│   └── eslint-config/             # Shared lint presets
│
├── infra
│   ├── docker/
│   │   ├── postgres/
│   │   ├── redis/
│   │   └── minio/
│   └── compose/
│       ├── docker-compose.dev.yml
│       └── docker-compose.test.yml
│
├── docs
│   ├── architecture.md
│   ├── api-contract.md
│   ├── auth-flow.md
│   ├── worker-jobs.md
│   └── data-model.md
│
├── .github/
│   └── workflows/
│
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
├── .env.example
└── README.md
```

## Detailed App Structure
### `apps/client`
```text
apps/client
├── app
│   ├── (auth)
│   │   ├── sign-in/page.tsx
│   │   ├── invite/[token]/page.tsx
│   │   └── onboarding/page.tsx
│   ├── (dashboard)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── workspaces/[workspaceSlug]/page.tsx
│   │   ├── projects/[projectSlug]/page.tsx
│   │   ├── projects/[projectSlug]/tasks/page.tsx
│   │   ├── projects/[projectSlug]/tasks/[taskId]/page.tsx
│   │   ├── projects/[projectSlug]/inbox/page.tsx
│   │   ├── projects/[projectSlug]/activity/page.tsx
│   │   └── settings/page.tsx
│   ├── api
│   │   └── health/route.ts
│   ├── globals.css
│   └── layout.tsx
├── components
│   ├── ui/                        # shadcn/ui components only
│   ├── layout/
│   ├── navigation/
│   ├── tasks/
│   ├── inbox/
│   ├── activity/
│   └── forms/
├── features
│   ├── auth/
│   ├── workspace/
│   ├── projects/
│   ├── tasks/
│   ├── threads/
│   ├── reviews/
│   ├── activity/
│   └── agents/
├── lib
│   ├── auth/
│   ├── graphql/
│   ├── sse/
│   ├── config/
│   └── utils/
├── hooks
├── middleware.ts
├── next.config.ts
└── components.json
```

### `apps/web`
```text
apps/web
├── app
│   ├── page.tsx
│   ├── product/page.tsx
│   ├── security/page.tsx
│   ├── docs/page.tsx
│   ├── pricing/page.tsx
│   └── contact/page.tsx
├── components
├── lib
└── next.config.ts
```

### `apps/api`
```text
apps/api
├── src
│   ├── main.ts
│   ├── app.module.ts
│   ├── common
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── filters/
│   │   ├── pipes/
│   │   ├── scalars/
│   │   └── loaders/
│   ├── graphql
│   │   ├── graphql.module.ts
│   │   └── graphql.config.ts
│   ├── auth
│   ├── users
│   ├── workspaces
│   ├── projects
│   ├── tasks
│   ├── threads
│   ├── reviews
│   ├── activity
│   ├── github
│   ├── agent-runs
│   ├── integrations
│   ├── storage
│   ├── health
│   └── webhooks
└── test
```

### `apps/worker`
```text
apps/worker
├── src
│   ├── main.ts
│   ├── app.module.ts
│   ├── queue/
│   ├── jobs/
│   │   ├── github-sync/
│   │   ├── github-actions/
│   │   ├── agent-runs/
│   │   └── cleanup/
│   ├── processors/
│   ├── services/
│   ├── clients/
│   └── health/
└── test
```

## Shared Package Responsibilities
### `packages/auth`
Purpose: central Better Auth integration.

Exports:
- `createBetterAuthServer()`
- `authHandler`
- `authClient`
- `getSessionFromHeaders()`
- `requireAuthenticatedUser()`
- `serializeSessionUser()`
- auth-related types

Rules:
- API hosts Better Auth handler endpoints
- Client uses Better Auth client SDK pointed at API auth routes
- Session is cookie-based
- GitHub OAuth is the only enabled login provider in v1

### `packages/db`
Purpose: single source of truth for Prisma schema and database client.

Exports:
- `prisma`
- generated Prisma client
- transaction helpers
- seed helpers
- query extensions if needed

Rules:
- Only `packages/db` owns schema and migrations
- Apps never define their own DB clients
- All Prisma access happens through API/worker service layers

### `packages/github`
Purpose: stable abstraction around GitHub App and REST/GraphQL APIs.

Exports:
- `createGitHubAppClient()`
- `getInstallationOctokit()`
- `verifyGitHubWebhook()`
- `parseWebhookEnvelope()`
- issue helpers
- PR helpers
- review helpers
- repository sync helpers

### `packages/ai`
Purpose: normalize external AI/agent providers.

Exports:
- `submitAgentRun()`
- `resumeAgentRun()`
- `cancelAgentRun()`
- `getAgentRunStatus()`
- `buildAgentTaskContext()`
- `normalizeAgentResult()`

### `packages/queue`
Purpose: job names, payload schemas, queue registration.

Exports:
- queue names
- job payload Zod schemas
- retry/backoff defaults
- enqueue helpers

### `packages/contracts`
Purpose: shared app-level contracts that are not Prisma models.

Exports:
- enums
- DTO shapes
- webhook event shapes
- queue payload types
- activity payload types

### `packages/config`
Purpose: central environment validation.

Exports:
- `getApiConfig()`
- `getClientConfig()`
- `getWorkerConfig()`
- `getStorageConfig()`
- `getGithubConfig()`

### `packages/test-utils`
Purpose: shared testing infrastructure.

Exports:
- factories for `User`, `Workspace`, `Project`, `Task`
- Prisma cleanup helpers
- auth session helpers
- GraphQL request helpers
- MinIO upload stubs
- fake GitHub webhook payloads

## Runtime Architecture
### Client
- Next.js App Router
- `shadcn/ui` for all authenticated product UI
- Apollo Client or `urql` for GraphQL queries/mutations
- Better Auth client for session management
- SSE stream for activity/inbox/task updates
- targeted polling fallback on detail pages

### Web
- separate Next.js app
- no shared auth session assumptions required
- can link to `client` subdomain for sign-in

### API
- NestJS
- code-first GraphQL
- Better Auth mounted on HTTP route namespace such as `/auth/*`
- Prisma + Postgres
- SSE endpoints for live-ish updates
- REST endpoints only for:
  - auth handlers
  - GitHub webhooks
  - health
  - optional signed worker callbacks

### Worker
- NestJS app with BullMQ
- Redis queue backend
- no direct public traffic
- consumes queue jobs created by API and webhooks
- writes durable state changes through Prisma
- uploads artifacts/logs to S3-compatible storage

### Infra
- Postgres for main data
- Redis for queues
- MinIO in local/dev, S3-compatible storage in deployed envs
- Docker-first local and deploy setup

## Domain Model
### Core concepts
- `Workspace`: collaboration boundary
- `WorkspaceMember`: membership and role
- `Project`: one project inside a workspace
- `ProjectRepository`: one GitHub repo linked to one project
- `Task`: work item assigned to human or agent
- `Thread`: discussion context for task or review item
- `Comment`: user/agent/system/GitHub-originated comment
- `AgentRun`: async execution record for delegated work
- `AgentArtifact`: files/links/logs produced by agent runs
- `ReviewItem`: PR or deliverable review surface
- `ActivityEvent`: append-only feed/audit record
- `GithubInstallation`: GitHub App installation metadata
- `GithubWebhookEvent`: durable webhook processing log

## Prisma Schema
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum WorkspaceRole {
  OWNER
  ADMIN
  MEMBER
}

enum ProjectStatus {
  ACTIVE
  ARCHIVED
}

enum TaskStatus {
  BACKLOG
  TODO
  IN_PROGRESS
  IN_REVIEW
  BLOCKED
  DONE
  CANCELED
}

enum AssigneeType {
  USER
  AGENT
}

enum ThreadType {
  TASK
  REVIEW
  PROJECT
}

enum CommentSource {
  USER
  AGENT
  SYSTEM
  GITHUB
}

enum AgentProvider {
  OPENAI
  ANTHROPIC
  CUSTOM
}

enum AgentRunStatus {
  QUEUED
  RUNNING
  BLOCKED
  COMPLETED
  FAILED
  CANCELED
}

enum ArtifactType {
  LOG
  SUMMARY
  PATCH
  FILE
  LINK
  PR_LINK
}

enum ReviewItemType {
  PULL_REQUEST
  AGENT_DELIVERABLE
}

enum ReviewState {
  OPEN
  APPROVED
  CHANGES_REQUESTED
  RESOLVED
  MERGED
  CLOSED
}

enum ActivityEventType {
  WORKSPACE_CREATED
  MEMBER_INVITED
  MEMBER_JOINED
  PROJECT_CREATED
  REPOSITORY_CONNECTED
  TASK_CREATED
  TASK_UPDATED
  TASK_ASSIGNED
  TASK_STATUS_CHANGED
  COMMENT_ADDED
  AGENT_RUN_CREATED
  AGENT_RUN_UPDATED
  AGENT_RUN_COMPLETED
  REVIEW_ITEM_CREATED
  REVIEW_STATE_CHANGED
  GITHUB_SYNCED
}

enum GithubWebhookStatus {
  RECEIVED
  PROCESSED
  FAILED
  IGNORED
}

model User {
  id                String             @id @default(cuid())
  name              String?
  email             String             @unique
  emailVerified     Boolean            @default(false)
  image             String?
  githubUsername    String?            @unique
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt

  accounts          Account[]
  sessions          Session[]
  memberships       WorkspaceMember[]
  invitationsSent   WorkspaceInvitation[] @relation("InvitationInviter")
  workspacesCreated Workspace[]        @relation("WorkspaceCreator")
  projectsCreated   Project[]          @relation("ProjectCreator")
  tasksCreated      Task[]             @relation("TaskCreator")
  tasksAssigned     Task[]             @relation("TaskAssignee")
  commentsAuthored  Comment[]          @relation("CommentAuthor")
  agentRunsRequested AgentRun[]        @relation("AgentRunRequester")
  reviewAssignments ReviewItem[]       @relation("ReviewAssignee")
  activityEvents    ActivityEvent[]    @relation("ActivityActor")
}

model Session {
  id          String   @id @default(cuid())
  token       String   @unique
  userId      String
  expiresAt   DateTime
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}

model Account {
  id                    String   @id @default(cuid())
  userId                String
  accountId             String
  providerId            String
  accessToken           String?  @db.Text
  refreshToken          String?  @db.Text
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  idToken               String?  @db.Text
  password              String?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([providerId, accountId])
  @@index([userId])
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())

  @@unique([identifier, value])
  @@index([expiresAt])
}

model Workspace {
  id          String              @id @default(cuid())
  slug        String              @unique
  name        String
  createdById String
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt

  createdBy   User                @relation("WorkspaceCreator", fields: [createdById], references: [id])
  members     WorkspaceMember[]
  invitations WorkspaceInvitation[]
  projects    Project[]
  events      ActivityEvent[]

  @@index([createdById])
}

model WorkspaceMember {
  id          String        @id @default(cuid())
  workspaceId String
  userId      String
  role        WorkspaceRole
  joinedAt    DateTime      @default(now())

  workspace   Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
  @@index([userId])
  @@index([workspaceId, role])
}

model WorkspaceInvitation {
  id          String        @id @default(cuid())
  workspaceId String
  email       String
  role        WorkspaceRole
  invitedById String
  token       String        @unique
  expiresAt   DateTime
  acceptedAt  DateTime?
  createdAt   DateTime      @default(now())

  workspace   Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  invitedBy   User          @relation("InvitationInviter", fields: [invitedById], references: [id])

  @@unique([workspaceId, email])
  @@index([expiresAt])
}

model GithubInstallation {
  id                   String               @id @default(cuid())
  githubInstallationId Int                  @unique
  accountLogin         String
  accountType          String
  targetType           String
  createdAt            DateTime             @default(now())
  updatedAt            DateTime             @updatedAt

  repositories         ProjectRepository[]
  webhookEvents        GithubWebhookEvent[]
}

model Project {
  id          String          @id @default(cuid())
  workspaceId String
  slug        String
  name        String
  description String?         @db.Text
  status      ProjectStatus   @default(ACTIVE)
  createdById String
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  workspace   Workspace       @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  createdBy   User            @relation("ProjectCreator", fields: [createdById], references: [id])
  repository  ProjectRepository?
  tasks       Task[]
  threads     Thread[]
  reviewItems ReviewItem[]
  events      ActivityEvent[]

  @@unique([workspaceId, slug])
  @@index([workspaceId, status])
}

model ProjectRepository {
  id                   String              @id @default(cuid())
  projectId            String              @unique
  githubInstallationId String?
  provider             String              @default("github")
  owner                String
  name                 String
  fullName             String              @unique
  defaultBranch        String
  isPrivate            Boolean
  createdAt            DateTime            @default(now())
  updatedAt            DateTime            @updatedAt

  project              Project             @relation(fields: [projectId], references: [id], onDelete: Cascade)
  installation         GithubInstallation? @relation(fields: [githubInstallationId], references: [id], onDelete: SetNull)
  taskLinks            TaskGithubIssueLink[]
  reviewItems          ReviewItem[]

  @@index([githubInstallationId])
}

model Task {
  id             String        @id @default(cuid())
  projectId      String
  title          String
  description    String?       @db.Text
  status         TaskStatus    @default(TODO)
  assigneeType   AssigneeType?
  assigneeUserId String?
  assigneeLabel  String?
  priority       Int?
  dueAt          DateTime?
  createdById    String
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  project        Project       @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdBy      User          @relation("TaskCreator", fields: [createdById], references: [id])
  assigneeUser   User?         @relation("TaskAssignee", fields: [assigneeUserId], references: [id], onDelete: SetNull)
  githubIssue    TaskGithubIssueLink?
  thread         Thread?
  agentRuns      AgentRun[]
  reviewItems    ReviewItem[]
  events         ActivityEvent[]

  @@index([projectId, status])
  @@index([assigneeUserId])
  @@index([projectId, createdAt])
}

model TaskGithubIssueLink {
  id                String            @id @default(cuid())
  taskId            String            @unique
  repositoryId      String
  githubIssueNumber Int
  githubIssueNodeId String            @unique
  githubIssueUrl    String
  githubIssueState  String
  lastSyncedAt      DateTime?

  task              Task              @relation(fields: [taskId], references: [id], onDelete: Cascade)
  repository        ProjectRepository @relation(fields: [repositoryId], references: [id], onDelete: Cascade)

  @@unique([repositoryId, githubIssueNumber])
  @@index([githubIssueState])
}

model Thread {
  id           String      @id @default(cuid())
  projectId    String
  taskId       String?     @unique
  reviewItemId String?     @unique
  type         ThreadType
  title        String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  project      Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  task         Task?       @relation(fields: [taskId], references: [id], onDelete: Cascade)
  reviewItem   ReviewItem? @relation(fields: [reviewItemId], references: [id], onDelete: Cascade)
  comments     Comment[]

  @@index([projectId, type])
}

model Comment {
  id              String        @id @default(cuid())
  threadId        String
  authorId        String?
  source          CommentSource
  body            String        @db.Text
  externalRef     String?
  metadata        Json?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  thread          Thread        @relation(fields: [threadId], references: [id], onDelete: Cascade)
  author          User?         @relation("CommentAuthor", fields: [authorId], references: [id], onDelete: SetNull)

  @@index([threadId, createdAt])
  @@index([source])
}

model AgentRun {
  id               String         @id @default(cuid())
  taskId           String
  requestedById    String
  provider         AgentProvider
  providerRunId    String?
  model            String?
  status           AgentRunStatus @default(QUEUED)
  branchName       String?
  pullRequestNumber Int?
  pullRequestUrl   String?
  summary          String?        @db.Text
  errorMessage     String?        @db.Text
  metadata         Json?
  startedAt        DateTime?
  completedAt      DateTime?
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  task             Task           @relation(fields: [taskId], references: [id], onDelete: Cascade)
  requestedBy      User           @relation("AgentRunRequester", fields: [requestedById], references: [id])
  artifacts        AgentArtifact[]
  events           ActivityEvent[]

  @@index([taskId, status])
  @@index([provider, providerRunId])
}

model AgentArtifact {
  id           String       @id @default(cuid())
  agentRunId   String
  type         ArtifactType
  key          String
  url          String
  mimeType     String?
  sizeBytes    Int?
  metadata     Json?
  createdAt    DateTime     @default(now())

  agentRun     AgentRun     @relation(fields: [agentRunId], references: [id], onDelete: Cascade)

  @@index([agentRunId, type])
}

model ReviewItem {
  id              String           @id @default(cuid())
  projectId       String
  repositoryId    String
  taskId          String?
  type            ReviewItemType
  state           ReviewState      @default(OPEN)
  title           String
  externalNumber  Int?
  externalNodeId  String?          @unique
  url             String?
  authorLogin     String?
  reviewerUserId  String?
  openedAt        DateTime?
  closedAt        DateTime?
  mergedAt        DateTime?
  lastSyncedAt    DateTime?
  metadata        Json?
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  project         Project          @relation(fields: [projectId], references: [id], onDelete: Cascade)
  repository      ProjectRepository @relation(fields: [repositoryId], references: [id], onDelete: Cascade)
  task            Task?            @relation(fields: [taskId], references: [id], onDelete: SetNull)
  reviewerUser    User?            @relation("ReviewAssignee", fields: [reviewerUserId], references: [id], onDelete: SetNull)
  thread          Thread?
  events          ActivityEvent[]

  @@index([projectId, state, type])
  @@index([repositoryId, externalNumber])
  @@index([taskId])
}

model GithubWebhookEvent {
  id                   String               @id @default(cuid())
  githubDeliveryId     String               @unique
  githubInstallationId String?
  eventName            String
  action               String?
  status               GithubWebhookStatus  @default(RECEIVED)
  payload              Json
  errorText            String?              @db.Text
  receivedAt           DateTime             @default(now())
  processedAt          DateTime?

  installation         GithubInstallation?  @relation(fields: [githubInstallationId], references: [id], onDelete: SetNull)

  @@index([eventName, status])
  @@index([receivedAt])
}

model ActivityEvent {
  id           String            @id @default(cuid())
  workspaceId  String
  projectId    String?
  taskId       String?
  reviewItemId String?
  agentRunId   String?
  actorUserId  String?
  type         ActivityEventType
  summary      String
  payload      Json?
  createdAt    DateTime          @default(now())

  workspace    Workspace         @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  project      Project?          @relation(fields: [projectId], references: [id], onDelete: SetNull)
  task         Task?             @relation(fields: [taskId], references: [id], onDelete: SetNull)
  reviewItem   ReviewItem?       @relation(fields: [reviewItemId], references: [id], onDelete: SetNull)
  agentRun     AgentRun?         @relation(fields: [agentRunId], references: [id], onDelete: SetNull)
  actor        User?             @relation("ActivityActor", fields: [actorUserId], references: [id], onDelete: SetNull)

  @@index([workspaceId, createdAt])
  @@index([projectId, createdAt])
  @@index([taskId, createdAt])
  @@index([reviewItemId, createdAt])
}
```

## Why This Schema Shape
- Better Auth needs durable user/session/account tables.
- `WorkspaceMember` separates identity from role-based access.
- `ProjectRepository` is one-to-one now, but can grow into one-to-many later.
- `TaskGithubIssueLink` keeps task lifecycle independent from GitHub issue lifecycle.
- `Thread` provides a reusable comment surface for both tasks and reviews.
- `ReviewItem` abstracts PR and agent deliverable review into one inbox model.
- `ActivityEvent` is append-only and drives both audit history and feed UI.
- `GithubWebhookEvent` provides idempotency and debugging for inbound webhook delivery.
- `AgentArtifact` keeps files/logs out of Postgres while preserving metadata and auditability.

## API Design
### GraphQL style
- NestJS code-first GraphQL only
- use DTO/input classes inside modules
- GraphQL schema generated from decorators
- no schema-first or federation in MVP

### Primary GraphQL queries
- `me`
- `myWorkspaces`
- `workspaceBySlug(slug)`
- `projectBySlug(workspaceSlug, projectSlug)`
- `projectTasks(projectId, filters)`
- `taskById(taskId)`
- `projectInbox(projectId, filters)`
- `projectActivity(projectId, cursor)`
- `projectMembers(projectId)`

### Primary GraphQL mutations
- `createWorkspace`
- `acceptWorkspaceInvite`
- `createProject`
- `connectProjectRepository`
- `createTask`
- `updateTask`
- `assignTaskToUser`
- `assignTaskToAgent`
- `startAgentRun`
- `addThreadComment`
- `changeReviewState`
- `requestReview`
- `syncGithubIssue`
- `syncGithubPullRequest`

### HTTP-only endpoints
- `GET /health`
- `ALL /auth/*` Better Auth handler
- `POST /webhooks/github`
- `GET /streams/project/:projectId/activity`
- `GET /streams/project/:projectId/inbox`
- `GET /streams/task/:taskId`

## API Module Plan
### `auth`
Major functions:
- create Better Auth server adapter
- validate session from cookies
- attach authenticated user to GraphQL context
- expose auth handler routes
- workspace access guard helpers

### `users`
Major functions:
- resolve current user profile
- update profile basics if needed
- map GitHub identity to local user record

### `workspaces`
Major functions:
- create workspace
- slug generation and uniqueness checks
- invite member
- accept invitation
- list members
- role checks for protected actions

### `projects`
Major functions:
- create project
- archive project
- connect one GitHub repo
- fetch project overview with counts
- enforce one primary repo per project

### `tasks`
Major functions:
- create task
- update task fields
- assign task to user
- assign task to agent label
- transition task status
- attach/detach GitHub issue
- return task details with thread and activity

### `threads`
Major functions:
- create task thread if missing
- create review thread if missing
- add comment
- list paginated comments
- ingest GitHub-originated comments into thread

### `reviews`
Major functions:
- upsert review item from PR sync
- build inbox queries
- change review state in app
- post review comments to GitHub
- track merged/closed state

### `activity`
Major functions:
- append event
- fan out event to SSE streams
- list project/workspace activity
- format event summaries from typed payloads

### `github`
Major functions:
- validate GitHub App installation
- list installable repos
- connect repo to project
- sync issue into task
- sync PR into review item
- enqueue background sync jobs

### `agent-runs`
Major functions:
- create agent run
- build task context payload
- enqueue worker job
- update run state from worker callback/result
- attach artifacts and PR link
- mark task `IN_REVIEW` when agent completes deliverable

### `webhooks`
Major functions:
- verify GitHub signature
- dedupe by `githubDeliveryId`
- persist raw event
- route event to worker queue
- mark webhook status processed/failed

## Worker Plan
### Queue technology
- BullMQ
- Redis backend
- Nest integration via `@nestjs/bullmq`

### Queue names
- `github-sync`
- `github-actions`
- `agent-runs`
- `cleanup`

### Job types
- `SYNC_REPOSITORY`
- `SYNC_ISSUE`
- `SYNC_PULL_REQUEST`
- `POST_REVIEW_COMMENT`
- `CREATE_GITHUB_ISSUE`
- `START_AGENT_RUN`
- `POLL_AGENT_RUN`
- `FINALIZE_AGENT_RUN`
- `UPLOAD_AGENT_ARTIFACT`
- `MARK_STALE_RUNS`

### Worker processors
#### `github-sync`
Functions:
- fetch issue details
- fetch PR details
- fetch review comments
- update review/task models
- append activity events

#### `github-actions`
Functions:
- create issue from task
- update issue title/body/state
- post PR review comment
- request reviewer if needed later
- fetch repo metadata

#### `agent-runs`
Functions:
- build provider payload
- submit agent work
- poll provider status if provider is async
- persist run updates
- upload logs/summaries to object storage
- detect PR URL/number from result metadata
- finalize run and update task status

#### `cleanup`
Functions:
- expire unused invites
- mark stalled runs as failed/blocked
- prune transient local test data if needed

### Worker design rules
- worker never owns business decisions about permissions
- worker always writes status changes through API-owned data model conventions
- all queue payloads validated with Zod before processing
- all jobs idempotent where possible
- job retry policy depends on category:
  - GitHub sync: retry
  - auth/user permission failures: do not retry
  - network/provider timeouts: retry with exponential backoff

## Client Plan
### UI sections
- workspace selector
- project dashboard
- task list/board
- task detail page
- review inbox
- project activity page
- settings pages

### `shadcn/ui` usage
Use `shadcn/ui` only in `apps/client/components/ui`.
Likely components:
- button
- dropdown-menu
- dialog
- form
- input
- textarea
- badge
- card
- separator
- command
- sheet
- tabs
- table
- scroll-area
- avatar
- tooltip
- skeleton
- toast

### Client feature responsibilities
#### `features/auth`
- sign-in
- session hydration
- invite acceptance flow

#### `features/workspace`
- workspace switching
- member listing
- invitation UX

#### `features/projects`
- create/connect project
- project navigation
- overview cards and counters

#### `features/tasks`
- task list filters
- task create/edit forms
- assignment UI
- status transitions

#### `features/threads`
- paginated comments
- markdown rendering
- optimistic comment posting

#### `features/reviews`
- inbox filters
- review item detail
- review status controls
- GitHub linkouts

#### `features/activity`
- event feed rendering
- SSE subscription management
- cursor pagination

#### `features/agents`
- start run dialog
- run progress timeline
- artifact list
- PR/result attachment UI

## Better Auth Plan
### Authentication model
- GitHub OAuth only in v1
- Better Auth hosted by API
- client uses Better Auth client SDK against API auth base URL
- auth cookie shared for `client` subdomain and API domain based on deployment setup

### Required auth behaviors
- create user on first GitHub login
- link GitHub username/profile data
- create session cookie
- authorize by workspace membership
- allow invitation acceptance after sign-in

### Authorization rules
- `OWNER`
  - full workspace control
  - can invite/remove members
  - can create/archive projects
- `ADMIN`
  - can manage projects/tasks/reviews
  - can invite members
- `MEMBER`
  - can view workspace/project data
  - can create tasks/comments
  - can start agent runs if project policy allows

## GitHub Integration Plan
### GitHub auth split
- Better Auth uses GitHub OAuth for user identity
- GitHub App is separate for repository access and webhooks
- project repo connection requires GitHub App installation

### GitHub entities synced in MVP
- repositories
- issues
- pull requests
- pull request review comments
- merged/closed/open state transitions

### Sync rules
- manual tasks may or may not link to an issue
- imported issues create or link local tasks
- PRs become `ReviewItem`s
- GitHub comments imported into related thread when available
- local review comments can be posted back to GitHub PRs

## Storage Plan
### Postgres
Stores:
- auth/session data
- collaboration data
- project/task/review state
- webhook event log
- activity events
- artifact metadata

### Redis
Stores:
- BullMQ queues
- job state
- delayed retries

### S3-compatible storage
Stores:
- agent logs
- summaries
- patch files
- generated markdown reports
- optional screenshots or output artifacts later

Key convention:
- object key prefix: `workspace/{workspaceId}/project/{projectId}/agent-run/{agentRunId}/...`

## Configuration Plan
### Root env vars
- `NODE_ENV`
- `DATABASE_URL`
- `REDIS_URL`
- `S3_ENDPOINT`
- `S3_REGION`
- `S3_BUCKET`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`

### API env vars
- `API_PORT`
- `API_BASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_BASE_URL`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_APP_ID`
- `GITHUB_APP_PRIVATE_KEY`
- `GITHUB_WEBHOOK_SECRET`

### Client env vars
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_AUTH_URL`

### Web env vars
- `NEXT_PUBLIC_MARKETING_URL`
- `NEXT_PUBLIC_APP_URL`

### Worker env vars
- `WORKER_CONCURRENCY`
- `AGENT_PROVIDER`
- `OPENAI_API_KEY` or provider-specific key
- `AGENT_CALLBACK_SECRET` if needed

## Scripts and Tooling
### Root scripts
- `dev`
- `build`
- `lint`
- `typecheck`
- `test`
- `test:unit`
- `test:integration`
- `test:e2e`
- `db:generate`
- `db:migrate`
- `db:deploy`
- `db:seed`
- `docker:dev`
- `docker:test`

### Recommended tooling
- `pnpm`
- `turbo`
- `typescript`
- `eslint`
- `prettier`
- `prisma`
- `@nestjs/graphql`
- `@nestjs/apollo`
- `@nestjs/bullmq`
- `graphql`
- `zod`
- `better-auth`
- `shadcn/ui`
- `playwright`
- `vitest`
- `supertest`
- `testcontainers`

## Testing Plan
### Testing stack
- `Vitest` for unit tests and shared package tests
- Nest integration tests using `@nestjs/testing` + `supertest`
- `Playwright` for end-to-end product flows
- `Testcontainers` for Postgres/Redis/MinIO-backed integration tests

### Test directory conventions
- unit tests colocated as `*.test.ts`
- API integration tests under `apps/api/test`
- worker integration tests under `apps/worker/test`
- Playwright specs under `apps/client/e2e`
- shared factories in `packages/test-utils`

### Unit tests
Cover:
- DTO validation
- service-layer business rules
- auth helpers
- GitHub payload normalization
- agent result normalization
- activity summary formatters
- queue payload schemas

### API integration tests
Cover:
- sign-in/session validation glue
- workspace role enforcement
- create workspace/project/task flows
- assign task to user or agent
- create and query review items
- thread comment creation
- webhook ingestion idempotency
- repo connection rules

### Worker integration tests
Cover:
- queue processor registration
- retry/backoff logic
- webhook-driven sync job execution
- agent run lifecycle transitions
- artifact upload metadata persistence
- stale job detection

### E2E tests
Cover:
- sign in and landing in workspace
- create workspace and project
- connect mocked GitHub repo
- create task
- assign task to agent
- observe run status changes
- comment on review item
- see activity feed update

### Test data strategy
- factory-based test creation
- isolated DB per integration test suite where practical
- seeded demo workspace for local manual QA
- fake GitHub webhook fixtures versioned in repo

### CI plan
- lint
- typecheck
- unit tests
- integration tests
- build all apps
- optional Playwright smoke run on main branches

## Local Development Setup
### Services
- Postgres
- Redis
- MinIO
- API
- Worker
- Client
- Web

### Dev startup order
1. start infra containers
2. run Prisma generate/migrate
3. start API
4. start worker
5. start client
6. start web

### Ports
Recommended defaults:
- `client`: 3000
- `web`: 3001
- `api`: 4000
- `postgres`: 5432
- `redis`: 6379
- `minio`: 9000

## Observability and Ops
### Minimum observability
- structured JSON logs in API and worker
- request IDs and job IDs
- webhook delivery logging
- agent run status transition logging
- health endpoints for API and worker

### Failure handling
- dead-letter or failed-job inspection for BullMQ
- webhook dedupe with persistent event table
- task remains visible even if sync fails
- agent failure marks run failed and appends activity event

## Major Implementation Sequence
1. Bootstrap monorepo and shared config
2. Add Prisma schema, migrations, DB package
3. Add Better Auth in API and client session wiring
4. Build workspace/project/task GraphQL modules
5. Add GitHub App connection and webhook ingestion
6. Add BullMQ worker and sync processors
7. Build client dashboard/task/inbox/activity screens
8. Add agent-run orchestration and artifact storage
9. Add SSE streams
10. Add test harness, CI, and seeded demo flows

## Acceptance Criteria
- A signed-in GitHub user can create a workspace
- Another GitHub user can join the same workspace
- A project can connect exactly one GitHub repo
- A task can be created, assigned, and discussed
- A task can be delegated to an agent run
- Agent results can attach artifacts and a PR link
- Review items appear in a shared inbox
- Review comments and status can sync to GitHub
- Activity feed reflects key changes across users
- API, worker, and client all have automated tests

## Assumptions and Defaults
- Monorepo uses `pnpm + Turborepo`
- GraphQL is code-first in Nest
- Worker is Nest-based for consistency
- Queue backend is `BullMQ + Redis`
- Realtime uses `SSE + targeted polling`
- Deployment is Docker-first and self-hostable
- Storage uses S3-compatible object storage
- Roles are limited to `OWNER`, `ADMIN`, `MEMBER`
- GitHub is the only provider in v1
- One project maps to one primary repo in v1
- Better Auth is served by API, not Next.js
- `client` contains `shadcn/ui`; shared packages remain mostly headless

## Next Deliverable After This Plan
Once Plan Mode ends, the first implementation step should be to create:
- monorepo root files
- `apps/client`, `apps/web`, `apps/api`, `apps/worker`
- `packages/auth`, `packages/db`, `packages/github`, `packages/ai`, `packages/queue`, `packages/contracts`, `packages/config`, `packages/test-utils`
- initial Prisma schema and migration
- Docker Compose for Postgres, Redis, MinIO
