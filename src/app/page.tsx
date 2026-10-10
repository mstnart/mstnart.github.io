import { ViewTransition } from "react";
import { getProjects } from "@/lib/projects";
import { Hero, Reel } from "@/components/site/Hero";
import { Work } from "@/components/site/Work";
import { Career } from "@/components/site/Career";
import { Contact, Skills } from "@/components/site/Contact";

/** The whole portfolio on one page: intro → highlights → work → career → skills → contact. */
export default function Home() {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>
        <Hero />
        <Reel />
        <Work projects={getProjects()} />
        <Career />
        <Skills />
        <Contact />
      </div>
    </ViewTransition>
  );
}
