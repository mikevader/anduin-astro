---
name: redaction-check
description: Apply the redaction rules to one concrete value before it gets written down. Use whenever a hostname, endpoint, IP address, port, account name, provider identifier, repo name, file path, namespace or URL is about to enter a draft, a commit message, a diagram, alt text or a file name.
user-invocable: false
---

# redaction-check

[CONTEXT.md](../../../CONTEXT.md) is the authority. This skill is the procedure for
applying it to a single value, so that three other skills do not each carry their own
copy of the rules and drift apart.

## The governing test

> Does this hand an attacker direct attack surface on the public internet?
> Concretely: is it reachable through the router.

Everything below is that test, resolved for the cases that keep coming up.

## When this applies

Redaction is **not a review step.** A redacted value must never enter the text in the
first place. Run this check at the moment you are about to type the value, not after
the paragraph is finished.

Since [ADR-0006](../../../.agents/adr/0006-pipeline-in-repo.md) the boundary is
**publication, not the repo**:

| Where | Rules apply? |
|---|---|
| The raw dump section of a record | No. Verbatim, IPs and all. |
| The interrogation section | No. Raw repo findings are allowed here. |
| **The draft section** | **Yes, in full.** |
| Commit messages, file names, diagrams, alt text | Yes, in full. |

`pipeline/` is working notes in a private repo. The draft is the thing that becomes
public, and it is where this check has to be perfect.

## Procedure

Ask these in order. The first one that matches decides.

1. Is it reachable through the router from the public internet — an external endpoint,
   a public hostname of one of my services, a port open to the outside? → **never**
2. Is it an account or identifier held with an external provider, or anything tied to
   a login? → **never.** Note the shape of this: naming the provider is fine, tying it
   to *my* account is not.
3. Is it a password, token, key, or does it come from a vault file, a secret file or a
   `.env`? → **never**
4. Is it an IP address or a range? → **never.** Unconditional. Private ranges included.
5. Does it come from the private GitOps repo — a namespace, an app name, a host, even
   in passing, even as an aside? → **never**
6. Is it a cluster-internal service name or port, not routable from outside? → **fine.**
   `smtp-relay.smtp.svc.cluster.local:25` is the worked example and is already in
   Michael's public docs.
7. Is it a technology or a workload I run? → **fine.** "I run Traefik and nginx side by
   side" is content, not exposure.
8. Is it a provider named as part of an evaluation? → **fine.** The comparison is the
   post. Only the tie to an account or credentials is not.
9. Anything else, or any doubt at all → **treat as never, and ask Michael.**

Rule 9 is not politeness. The whole point of the harness is that a plausible guess and
a known fact are indistinguishable in the output, and that applies to redaction
judgements too.

## What to write instead

Invent an example value and **label it as invented, in the prose.** Not in a footnote,
not in a comment.

> The printer is reachable at `printer.example.invalid:631` — an invented host name,
> the real one is internal.

Never do the third thing, which is the tempting one: taking the real value and
*cleaning it up* into something that still looks real. A sanitised host name that
resembles the original is worse than the original, because it reads as a fact, it is
not one, and nobody can tell which.

## Repositories

From [ADR-0005](../../../.agents/adr/0005-interrogate-the-repo.md):

- Whether a repo is public is determined **live**: `gh repo list mikevader --visibility public`.
  There is no checked-in whitelist, because a stale one is exactly the risk this
  reduces. If `gh` is missing or unauthenticated, treat every repo as private.
- Public means the repo may be **named and linked**. It does not mean its contents are
  safe. Rules 1-5 above apply to a public repo exactly as they do to a private one.
- Sanitised information from a private repo may be published when it helps the post.
  A commit hash, a file name, a config key, the shape of a bug. Never the values in
  rules 1-5.

## Failure modes

You have failed this check if:

- You wrote a value and then went back to look at it. The check happens first.
- You resolved a doubtful value by picking the safer-looking version of it instead of
  asking.
- You let a value through because it appeared in the dump. The dump is not vetted; that
  is the entire reason this exists.
- You produced an example value without saying in the text that it is invented.
