---
layout: layouts/blog.njk
title: "Secure Cloud Baseline: A Cost-Conscious Starting Point for AWS"
date: 2026-04-12
summary: A Terraform-based secure baseline for AWS that deploys logging, IAM roles, guardrails, and optional networking for under $25 a month.
description: How I built a modular, cost-conscious AWS security baseline for startups and cloud newcomers, and why every design decision prioritized simplicity and affordability.
categories:
  - guide
  - aws
  - security
---

When I started independent consulting, I kept hearing the same thing from friends and colleagues getting into AWS: "Where do I even start?"

With over 200 services, diving into AWS head first is daunting. And if you're learning while trying to keep your account secure, it gets overwhelming fast. Most people either skip security entirely and deal with the consequences later, or they follow enterprise-grade guides that cost hundreds a month and deploy infrastructure they don't need.

I wanted something in between. A baseline that's secure by default, cost-conscious by design, and simple enough that someone new to the cloud can deploy it and actually understand what it does.

## Why I Built This

As someone who learns by building, I needed infrastructure I could test and deploy without breaking the bank. My first version worked, but it had problems. Overly complex Config automation rules, some of which weren't applicable or flagged false negatives. Unused resources creating dependency chains. The kind of waste that happens when you copy patterns from enterprise templates without questioning whether they fit your use case.

I rebuilt it from scratch with a clear goal: deploy a secure, auditable AWS foundation for under $25 a month with the defaults. Everything optional should be opt-in, not opt-out.

## What It Does

The Secure Cloud Baseline (SCB) provisions four domains in a single AWS account, all through Terraform:

**Logging** (always on)
- CloudTrail with multi-region coverage, log validation, and encryption via a customer-managed KMS key
- CloudWatch log group for centralized audit logs
- S3 bucket with versioning, encryption, and a policy that restricts access to CloudTrail and enforces HTTPS
- Metric filters and alarms for high-risk events: root account usage, console login without MFA, unauthorized API calls, and IAM policy changes
- SNS topic for security alert notifications

**IAM** (always on)
- Account password policy (16 char minimum, complexity, reuse prevention, 90-day rotation)
- Break-glass admin role with MFA required, 1-hour session limit, full admin access for emergencies only
- Operator role with MFA required, 8-hour session, PowerUser access minus the ability to tamper with CloudTrail or audit logs
- Read-only role without MFA requirement, safe for automation and tooling

No long-lived IAM user keys. All access is through roles.

**Network** (opt-in)
- VPC with private and optional public subnets across availability zones
- S3 and DynamoDB gateway endpoints so private traffic stays in-region
- Optional NAT gateway (single AZ to keep costs down)
- Optional VPC flow logs to CloudWatch
- Default security group locked to deny-all, so nothing is open by accident

Serverless-only accounts can leave the network module off entirely.

**Guardrails** (configurable)
- GuardDuty for threat detection (on by default, includes S3 and EBS malware scanning)
- AWS Config for compliance checks (off by default due to cost, available when needed)
- Budget alerts at 80% and 100% of your monthly target

## Design Decisions

A few choices that shaped the project:

**Cost first.** The default configuration runs under $25/month. NAT gateways, Config, and VPC are all opt-in because they add real cost. You shouldn't pay for infrastructure you don't use while you're learning.

**Operators can't touch the audit trail.** The operator role explicitly denies CloudTrail deletion and S3 audit log tampering. Day-to-day work happens with PowerUser access, but the security logs are protected.

**No long-lived keys.** Every human and automation path uses IAM roles. Break-glass is MFA-gated with a 1-hour session. This is how AWS recommends it, but most starter templates still create IAM users with access keys.

**Tested without credentials.** The full test suite runs with a mocked AWS provider. No credentials, no backend, no cost. You can validate the configuration on your laptop or in CI before touching a real account.

## Getting Started

The full setup guide, Makefile workflow, and post-deployment checklist are in the [GitHub repo](https://github.com/its-d/secure-cloud-baseline). Clone it, set your variables, bootstrap the state backend, and you can have a secure baseline deployed in under an hour.

After your first deploy, walk through the [post-deployment checklist](https://github.com/its-d/secure-cloud-baseline/blob/main/CHECKLIST.md) to verify everything is in place.

## Who This Is For

This isn't an enterprise landing zone. It's a starting point.

If you're new to AWS and want to learn without worrying about whether your account is a security liability, this gives you a solid foundation. If you're experienced but want a clean, auditable baseline for a new account or side project, it gets you there in an hour instead of a weekend.

The goal was always to make secure infrastructure accessible, not just to the teams with dedicated platform engineers, but to anyone willing to learn.

**Keywords:** <span class="blog-keywords">AWS, Terraform, Security, CloudTrail, GuardDuty, IAM, Infrastructure as Code, Cloud Security, Cost Optimization</span>
