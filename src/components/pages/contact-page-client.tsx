"use client";

import { animate } from "animejs";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ContactForm } from "@/components/portfolio/contact-form";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Github, MessageSquare, Shield } from "@/components/retroui/icons";
import { githubUrl, linkedinUrl } from "@/lib/site-config";

const contactFaqItems = [
  {
    question: "How long will it take for you to respond?",
    answer:
      "I generally respond within 24 to 48 hours for technical inquiries, research collaboration, and security reports.",
  },
  {
    question: "How will I receive your response?",
    answer:
      "You will receive a response directly at the email address provided in the form. If you prefer GitHub, you can also open an issue or discussion on one of my repositories.",
  },
] as const;

export function ContactPageClient() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) {
      return;
    }

    const sections = root.querySelectorAll("[data-contact-reveal]");
    animate(sections, {
      opacity: [0, 1],
      translateY: [16, 0],
      stagger: 80,
      duration: 300,
      ease: "outQuad",
    });
  }, []);

  return (
    <div ref={pageRef} className="space-y-6 pb-16">
      <section
        className="border-4 border-black bg-card p-4 shadow-retro-lg sm:p-6 md:p-8"
        data-contact-reveal
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-pixel text-3xl uppercase sm:text-4xl md:text-5xl">
            Contact
          </h1>
          <span className="inline-block w-fit px-3 py-1.5 bg-primary text-primary-foreground font-black uppercase text-sm sm:text-base border-2 border-black rotate-[-2deg] shadow-retro-sm">
            Open For Research & Systems Collaboration
          </span>
        </div>
        <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed sm:text-base">
          Have a question about Spoor, security research, systems architecture,
          or open-source collaboration? Submit your details below or reach out
          directly via GitHub.
        </p>
      </section>

      <section
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
        data-contact-reveal
      >
        {[
          {
            icon: Shield,
            title: "Security & Threat Audits",
            description:
              "Evaluating attack surfaces, analyzing credential exposure, and auditing cryptographic invariants.",
          },
          {
            icon: MessageSquare,
            title: "Technical Discussions",
            description:
              "Collaborating on low-level systems programming, Linux internals, Rust libraries, and CLI tooling.",
          },
          {
            icon: Github,
            title: "Open Source Collaboration",
            description:
              "Contributing to inspectable tools, reproducible benchmarks, and community security tooling.",
          },
        ].map((item) => (
          <Card
            key={item.title}
            className="border-4 border-black bg-card shadow-retro-md"
          >
            <Card.Content className="space-y-3">
              <item.icon className="h-5 w-5" />
              <h3 className="font-display text-2xl uppercase">{item.title}</h3>
              <p className="font-medium leading-relaxed">{item.description}</p>
            </Card.Content>
          </Card>
        ))}
      </section>

      <section
        className="border-4 border-black bg-secondary p-6 shadow-retro-lg md:p-8"
        data-contact-reveal
      >
        <h2 className="font-display text-3xl uppercase text-secondary-foreground sm:text-4xl">
          Project Inquiry Form
        </h2>
        <div className="mt-5 border-4 border-black bg-background p-4 shadow-retro-md">
          <ContactForm />
        </div>
      </section>

      <section className="space-y-4" data-contact-reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl uppercase sm:text-4xl">
            Prefer Direct Channels?
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
          >
            <Link href={githubUrl} target="_blank" rel="noreferrer noopener">
              GitHub Profile
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="border-4 border-black bg-card shadow-retro-md">
            <Card.Header>
              <Card.Title className="font-display text-2xl uppercase">
                GitHub Discussions & Issues
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-3">
              <p className="font-medium leading-relaxed">
                For tool feedback, bug reports, and research discussions on
                Spoor or other projects, GitHub is the primary public channel.
              </p>
              <Button
                asChild
                className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
              >
                <Link
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Open GitHub
                </Link>
              </Button>
            </Card.Content>
          </Card>
          <Card className="border-4 border-black bg-card shadow-retro-md">
            <Card.Header>
              <Card.Title className="font-display text-2xl uppercase">
                Professional Network
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-3">
              <p className="font-medium leading-relaxed">
                For research collaboration and professional networking, connect
                directly via LinkedIn.
              </p>
              <Button
                asChild
                variant="secondary"
                className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
              >
                <Link
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Connect on LinkedIn
                </Link>
              </Button>
            </Card.Content>
          </Card>
        </div>
      </section>

      <section className="space-y-4" data-contact-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          Contact FAQ
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {contactFaqItems.map((item) => (
            <Card
              key={item.question}
              className="border-4 border-black bg-card shadow-retro-md"
            >
              <Card.Header>
                <Card.Title className="font-display text-xl uppercase">
                  {item.question}
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="font-medium leading-relaxed">{item.answer}</p>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
