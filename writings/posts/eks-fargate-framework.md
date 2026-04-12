---
layout: layouts/blog.njk
title: Deploying EKS on AWS Fargate: A Cleaner Way to Run Containers
date: 2025-02-01
summary: A hands-on look at deploying a production-ready EKS Fargate framework with Terraform and GitHub Actions. Fully serverless, secure, and CI-friendly.
description: A Terraform-based EKS Fargate framework for reusable, production-grade container orchestration. Secure, automated, and observable.
image: images/writings/eks-fargate-hero.png
categories:
  - guide
  - aws
---

As I worked to strengthen my DevOps and infrastructure skills, I wanted to grow in both Infrastructure as Code (IaC) and container orchestration using Kubernetes. I had experience with Terraform, AWS CDK, and CloudFormation but I wanted something more cloud-agnostic, modular, and automation-focused.

While experimenting with modern container platforms, I noticed how complexity scales faster than traffic. You start with a few pods, and before long, you're managing node groups, patching EC2 instances, juggling IAM permissions, and troubleshooting CNI plugins.

That's where AWS Fargate shines: it eliminates the need to manage worker nodes entirely. You just deploy containers, and AWS handles the compute layer behind the scenes.

I built a **Terraform-based EKS Fargate Framework** to create a reusable, production-grade baseline that makes container orchestration simple, secure, and consistent.

**Key goals:**

- Deploy workloads securely using EKS + Fargate
- Automate infrastructure with Terraform
- Enforce least-privilege IAM via IRSA
- Build CI pipelines with GitHub Actions
- Gain observability through Grafana

## Why Fargate?

Fargate removes the node management burden while retaining full Kubernetes control. It's perfect for teams that want predictable costs, consistent security boundaries, and less operational overhead.

**Ideal for:**

- Workloads that don't need custom AMIs or privileged pods
- Teams prioritizing pod-level isolation and IAM boundaries
- Projects needing easy autoscaling without managing EC2 nodes

**Trade-offs:**

- No DaemonSets or custom kernel modules
- Maximum of 4 vCPU / 30GB per pod
- Slightly higher per-unit cost for 24/7 workloads

In short: you trade some flexibility for simplicity, and that's often worth it for lean teams or consulting setups that value speed and reliability.

## Architecture Overview

Here's the high-level flow automated by the framework:

**Terraform**

- Provisions VPC, subnets, and the EKS cluster
- Configures Fargate profiles for system and application namespaces
- Attaches IAM Roles for Service Accounts (IRSA)
- Installs the AWS Load Balancer Controller via Helm
- Deploys a preconfigured Grafana instance for monitoring

**GitHub Actions (CI/CD)**

- Runs lint, format, and `terraform validate` checks
- Generates Terraform plan artifacts with manual approval steps
- Uses OIDC authentication (no static AWS credentials)
- Optionally runs tfsec and Trivy for security scanning

**Grafana + CloudWatch**

- Visualizes metrics and logs automatically
- Sends alerts through SNS
- Supports ephemeral dashboards for short-lived environments

## Security and Best Practices

- **Use OIDC for GitHub Actions:** never store long-lived AWS keys.
- **Adopt IRSA everywhere:** each controller or workload gets its own IAM role.
- **Enable observability early:** Grafana and CloudWatch should be part of the MVP, not an afterthought.
- **Destroy safely:** the framework includes automated teardown that handles dependency ordering. See the repo README for details.

## Lessons Learned

- Start small: one namespace, one CI pipeline. Kubernetes and Terraform complexity compounds quickly.
- Restrict EKS API access to your IP before every apply, especially when using a VPN.
- Don't skip metrics: debugging Fargate pods without logs or dashboards is brutal.
- Validate OIDC trust relationships in IAM before running CI/CD pipelines.
- Match namespace selectors carefully when defining Fargate profiles. It's an easy mistake to overlook.

## Get Started

The full framework, setup guide, and Makefile workflow are in the [GitHub repo](https://github.com/its-d/terraform-aws-eks-microservice-framework). Clone it, set your variables, and you can have a production-ready EKS Fargate cluster running in minutes.

## Closing Thoughts

EKS on Fargate delivers the best of both worlds: full Kubernetes control with zero node management. It's ideal for platform engineers, consultants, and small teams that want infrastructure that's secure, auditable, and low-maintenance.

The [Terraform AWS EKS Microservice Framework](https://github.com/its-d/terraform-aws-eks-microservice-framework) I built aims to make this setup repeatable and production-ready, helping you focus on what matters most: building and shipping applications.

**Keywords:** <span class="blog-keywords">AWS, EKS, Fargate, Terraform, DevOps, CI/CD, GitHub Actions, IRSA, Serverless Containers</span>
