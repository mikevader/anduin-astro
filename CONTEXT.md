# CONTEXT

Shared vocabulary for this repo. Read it before writing anything about the subject
matter, so you stop re-explaining things I already know and stop guessing at things I
have not told you.

Rule of thumb: if a fact is in this file, use it without hedging. If it is not, either
ask me or mark it as an assumption (C3 in [AGENTS.md](AGENTS.md)).

## Who

- Michael Muehlebach. GitHub handle: `mikevader`.
- Site: **anduin.ch**. Today it is WordPress (Twenty Seventeen) with six posts from
  2011-2014. The new site keeps the same domain.
- Byline uses both the name and the handle; the handle links to GitHub.

## What the blog is about

All of my work. Not only the homelab, not only Kubernetes. The homelab is currently
the most active *source* of material; it is not the *subject* of the blog.

Domains that have actually appeared, roughly newest first:

- Kubernetes / k3s, Helm charts, GitOps, Ansible, container images
- Teaching (iOS class at FHNW)
- iOS / Objective-C
- Java / SWT / Eclipse RCP
- Hardware and physical projects (word clock, 3D printing)

## Audience

1. **Future me**, first and always. The post has to still be usable in five years,
   when I have forgotten why the obvious approach did not work.
2. **People with similar interests**, second.

The literacy assumption is per post, not global: assume the reader is fluent in that
post's own domain. Do not explain what a Pod is in a Kubernetes post; do not explain
what a segue is in an iOS post. Never assume the reader knows anything about *my*
setup, my naming, or my history with the problem — that part always gets spelled out.

"Professional" in the brief means **not sloppy**. It does not mean corporate, and it
does not mean writing for recruiters.

## Homelab facts

Stable enough to state without checking:

- k3s **1.35.5**. Three control-plane nodes on Raspberry Pi 5, three workers on mini
  PCs.
- **Traefik** is the k3s-bundled ingress and is still in use. **nginx** runs in
  parallel and handles external ingresses. Both, not one or the other.
- **`HelmChartConfig` is used for exactly one thing:** overriding k3s bundled
  components. Never present it as a general-purpose pattern.
- MetalLB for load balancing, Longhorn for storage, cert-manager for TLS.
- ArgoCD deploys the cluster app repos. A separate private repo uses Flux.
- Timezone Europe/Zurich.

### Cluster naming

- **Infra Cluster** — the real cluster. Everything that matters runs here. "Infra" is
  an artifact of the repo name, not a description. Never write about it as if it were
  a staging or secondary environment.
- **Dev Cluster** — a throwaway Raspberry Pi setup for trying out new ideas. Nothing
  on it is expected to survive.

## Projects page

Undecided. Candidates: word clock, 3D work, the cluster. No priority, no structure, no
copy yet. Do not invent one.

## Redaction - hard rules

Not style preferences. These apply to every public artifact: posts, diagrams, commit
messages, code samples, alt text, file names, URLs.

Never publish:

- IP addresses or ranges, internal hostnames, ports, internal URLs
- Vault files, secret files, `.env` files, anything containing a password or token
- Account names or identifiers I use with any provider
- Anything sourced from the private GitOps repo — its namespaces, app names and hosts
  are off-limits, including in passing and including as an aside
- Anything that lets a reader reconstruct my actual internal topology or enumerate the
  services I run

Sanitising is **not** a final review step. A redacted value never enters a draft in the
first place: invent an example value and label it as invented.

### What "services" means here

Two different things were being conflated, so this is the confirmed reading:

- **Things running in my cluster** — Kubernetes Services, workloads, the technologies
  I run — may be written about, within the rules above. "I run Traefik and nginx side
  by side" is publishable; it is already visible in the public charts repo.
- **External internet services and the accounts I hold with them** are not. Not "I have
  an account at $Provider and it is called xyz", not the endpoints, not the
  identifiers, not the configuration tied to a login.

The governing test is: **does this hand an attacker direct attack surface?** If yes, it
stays private unless I explicitly approve it for that specific post. Approval is per
post; it is never standing.

Naming a provider as part of a technical evaluation — "I compared A, B and C, and B
lost on X" — is normally the content of the post and is fine. Tying a provider to my
account, my endpoint or my running configuration is not.

**This file obeys its own rules.** It lives in the website repo, which may become
public, so it does not name the private things it tells you not to name.
