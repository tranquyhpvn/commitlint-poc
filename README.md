# commitlint POC

Minimal app repo to validate conventional commit enforcement on GitHub Actions using a self-hosted ARC runner on a local K8s cluster.

---

## Repo structure

```
commitlint-poc/
├── .github/
│   └── workflows/
│       └── commitlint.yml      ← CI pipeline (commitlint job)
├── commitlint.config.mjs       ← commitlint rules
├── package.json                ← Node ES module declaration
└── README.md
```

---

## Prerequisites

### 1. ARC runner installed on your K8s cluster

```bash
# Add Helm repo
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update

# Create namespace
kubectl create namespace arc-systems
kubectl create namespace arc-runners

# Install ARC controller
helm install arc \
  --namespace arc-systems \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller

# Get a GitHub PAT with repo + workflow scopes, then install runner scale set
helm install arc-runner-set \
  --namespace arc-runners \
  --set githubConfigUrl="https://github.com/<YOUR_USERNAME>/<YOUR_REPO>" \
  --set githubConfigSecret.github_token="<YOUR_PAT>" \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set
```

> The runner scale set name `arc-runner-set` must match the `runs-on` value in `commitlint.yml`.

### 2. Branch protection rule on GitHub

Go to: **GitHub repo → Settings → Branches → Add rule for `main`**

| Setting | Value |
|---|---|
| Branch name pattern | `main` |
| Require status checks to pass before merging | ✅ |
| Status check name | `Lint Commits / Validate commit messages` |
| Require branches to be up to date | ✅ |

---

## How to test

### Bad commit — pipeline should FAIL, merge blocked

```bash
git checkout -b test/bad-commit
git commit --allow-empty -m "update stuff"
git push origin test/bad-commit
# Open PR → commitlint job fails → merge button greyed out
```

### Good commit — pipeline should PASS, merge allowed

```bash
git checkout -b test/good-commit
git commit --allow-empty -m "feat(poc): add commitlint validation"
git push origin test/good-commit
# Open PR → commitlint job passes → merge allowed
```

---

## Allowed commit types

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `hotfix` | Emergency production fix |
| `chore` | Maintenance, no production change |
| `ci` | CI/CD pipeline changes |
| `docs` | Documentation only |
| `refactor` | Code restructure |
| `test` | Adding or updating tests |
| `revert` | Revert a previous commit |

### Examples

```
feat(auth): add OAuth2 login support
fix(api): handle null response from payment gateway
chore(deps): bump axios to 1.6.0
ci: add commitlint workflow
docs: update README with runner setup steps
```
