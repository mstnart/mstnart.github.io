import { ViewTransition } from "react";
import { getProjects } from "@/lib/projects";
import { Hero } from "@/components/site/Hero";
import { Work } from "@/components/site/Work";
import { About } from "@/components/site/Career";
import { Contact } from "@/components/site/Contact";

/** The whole portfolio on one page: reel → work → about → contact. */
export default function Home() {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>
        <Hero />
        <Work projects={getProjects()} />
        <About />
        <Contact />
      </div>
    </ViewTransition>
  );
}
