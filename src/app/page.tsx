"use client";
import { CommandCenterShell } from "@/components/scif/command-shell";
import { useHashRoute } from "@/lib/scif/nav";
import { Module00Exec } from "@/components/scif/modules/m00-exec";
import { Module01History } from "@/components/scif/modules/m01-history";
import { Module02Scale } from "@/components/scif/modules/m02-scale";
import { Module03Customers } from "@/components/scif/modules/m03-customers";
import { Module04Products } from "@/components/scif/modules/m04-products";
import { Module05Platforms } from "@/components/scif/modules/m05-platforms";
import { Module06Tech } from "@/components/scif/modules/m06-tech";
import { Module07AI } from "@/components/scif/modules/m07-ai";
import { Module08Innovation } from "@/components/scif/modules/m08-innovation";
import { Module09Lifecycle } from "@/components/scif/modules/m09-lifecycle";
import { Module10Partnerships } from "@/components/scif/modules/m10-partnerships";
import { Module11Signals } from "@/components/scif/modules/m11-signals";
import { Module12Risk } from "@/components/scif/modules/m12-risk";
import { Module13Compare } from "@/components/scif/modules/m13-compare";
import { Module14Lessons } from "@/components/scif/modules/m14-lessons";
import { Module15Roadmap } from "@/components/scif/modules/m15-roadmap";
import { Module16Sources } from "@/components/scif/modules/m16-sources";

const MODULES: Record<string, React.ComponentType> = {
  exec: Module00Exec,
  history: Module01History,
  scale: Module02Scale,
  customers: Module03Customers,
  products: Module04Products,
  platforms: Module05Platforms,
  tech: Module06Tech,
  ai: Module07AI,
  innovation: Module08Innovation,
  lifecycle: Module09Lifecycle,
  partnerships: Module10Partnerships,
  signals: Module11Signals,
  risk: Module12Risk,
  compare: Module13Compare,
  lessons: Module14Lessons,
  roadmap: Module15Roadmap,
  sources: Module16Sources,
};

export default function Home() {
  const { route } = useHashRoute();
  const Module = MODULES[route] ?? Module00Exec;
  return (
    <CommandCenterShell>
      <Module />
    </CommandCenterShell>
  );
}
