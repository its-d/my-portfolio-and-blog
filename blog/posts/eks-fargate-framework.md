---
layout: layouts/blog.njk
title: Why I Built the EKS Fargate Framework
date: 2025-02-01
description: A Terraform-based EKS Fargate framework for reusable, production-grade container orchestration — secure, automated, and observable.
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

In short: you trade some flexibility for simplicity — and that's often worth it for lean teams or consulting setups that value speed and reliability.

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

## Quick Start

To get started from scratch:

**Clone the repo**

```bash
git clone https://github.com/its-d/terraform-aws-eks-microservice-framework.git
cd terraform-aws-eks-microservice-framework
```

**Prepare your environment**

- Create `env/dev/backend.hcl` and `env/dev/terraform.tfvars` (examples included)
- Confirm your public IP: `make _confirm_ip`  
  This step restricts EKS API access to your current IP, preventing accidental 0.0.0.0/0 exposure.

**Deploy**

```bash
make init
make plan
make apply
```

**Validate outputs**

```bash
make outputs
```

You'll receive the cluster name, ALB endpoints, and Grafana URLs after deployment.

## Why _confirm_ip Exists

Terraform and Helm both need to reach the EKS API endpoint during apply. If your IP isn't listed in `public_access_cidrs`, you'll hit TLS handshake or timeout errors.

The `_confirm_ip` helper ensures:

- You never expose the cluster to the entire internet
- You always know which IP is allowed
- CI/CD runs safely in private mode later

It's a small but critical step that prevents accidental misconfiguration and keeps your cluster locked down.

## Security and Best Practices

- **Use OIDC for GitHub Actions:** never store long-lived AWS keys.
- **Adopt IRSA everywhere:** each controller or workload gets its own IAM role.
- **Enable observability early:** Grafana and CloudWatch should be part of the MVP, not an afterthought.
- **Destroy safely:** always remove Helm workloads before `terraform destroy` to avoid dependency conflicts.

## Lessons Learned

- Start small: one namespace, one CI pipeline. Kubernetes and Terraform complexity compounds quickly.
- Confirm your IP before every apply, especially if you're using a VPN.
- Don't skip metrics: debugging Fargate pods without logs or dashboards is brutal.
- Validate OIDC trust relationships in IAM before running CI/CD pipelines.
- Match namespace selectors carefully when defining Fargate profiles — it's an easy mistake to overlook.

## Closing Thoughts

EKS on Fargate delivers the best of both worlds: full Kubernetes control with zero node management. It's ideal for platform engineers, consultants, and small teams that want infrastructure that's secure, auditable, and low-maintenance.

The [Terraform AWS EKS Microservice Framework](https://github.com/its-d/terraform-aws-eks-microservice-framework) I built aims to make this setup repeatable and production-ready, helping you focus on what matters most: building and shipping applications.

**Keywords:** AWS, EKS, Fargate, Terraform, DevOps, CI/CD, GitHub Actions, IRSA, Serverless Containers
