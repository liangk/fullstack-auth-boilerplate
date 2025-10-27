import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Feature {
  icon: string;
  title: string;
  description: string;
  demoAction: string;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  buttonDisabled?: boolean;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  features: Feature[] = [
    {
      icon: "🔐",
      title: "Email/Password Login",
      description: "Authenticate using the secure email and password flow.",
      demoAction: "Go to /login"
    },
    {
      icon: "✉️",
      title: "Email Verification",
      description: "Register and confirm your email via the verification link.",
      demoAction: "Register → Check MailDev for the email"
    },
    {
      icon: "🔁",
      title: "Password Reset",
      description: "Request a reset link and update your password securely.",
      demoAction: "Forgot Password → Follow the reset email"
    },
    {
      icon: "👤",
      title: "Profile Management",
      description: "Update your name and email from the authenticated profile page.",
      demoAction: "Dashboard → Profile"
    },
    {
      icon: "📊",
      title: "Dashboard Analytics",
      description: "Review user metrics in the protected dashboard views.",
      demoAction: "Dashboard → Stats"
    }
  ];

  techStack: string[] = [
    "Angular 20",
    "Express.js",
    "Prisma",
    "PostgreSQL",
    "JWT Authentication",
    "SCSS"
  ];

  pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      features: [
        "✅ Up to 10 tasks",
        "✅ Basic task management",
        "✅ Email support",
        "❌ No team collaboration",
        "❌ No priority support"
      ],
      buttonText: "Current Plan",
      buttonDisabled: true
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      features: [
        "✅ Unlimited tasks",
        "✅ Team collaboration (5 members)",
        "✅ Priority email support",
        "✅ Advanced analytics",
        "✅ Custom task categories"
      ],
      isPopular: true,
      buttonText: "Upgrade to Pro"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      features: [
        "✅ Everything in Pro",
        "✅ Unlimited team members",
        "✅ Dedicated support",
        "✅ Custom integrations",
        "✅ SLA guarantee"
      ],
      buttonText: "Contact Sales"
    }
  ];

  testimonials: Testimonial[] = [
    {
      quote: "This starter kit saved us 3 months of development time. The authentication system is rock-solid and production-ready.",
      author: "Sarah Chen",
      role: "CTO, TechStartup Inc",
      avatar: "👩‍💼"
    },
    {
      quote: "Finally, an enterprise-grade auth solution that doesn't require a PhD to implement. Worth every penny.",
      author: "Michael Rodriguez",
      role: "Lead Developer, CloudCo",
      avatar: "👨‍💻"
    },
    {
      quote: "The RBAC and multi-tenancy features work flawlessly. We launched our SaaS in weeks, not months.",
      author: "Emily Watson",
      role: "Founder, DataFlow",
      avatar: "👩‍🚀"
    }
  ];

  demoFeatures: string[] = [
    "✅ Email verification flow",
    "✅ Password reset workflow",
    "✅ JWT-secured API access",
    "✅ Dashboard analytics"
  ];
}

