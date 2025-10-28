import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";
import { Button } from "./ui/button";

export default function FaqModal({ open, onOpenChange, inductionUrl }) {
  const url = inductionUrl || "/new-members";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Frequently Asked Questions</DialogTitle>
          <DialogDescription>
            Learn about Clare Senior Care’s invitation-only Premium Services.
          </DialogDescription>
        </DialogHeader>

        {/* Welcome */}
        <div className="space-y-3 mb-6">
          <h3 className="text-lg font-semibold">Welcome</h3>
          <p className="text-white/80">
            It is our pleasure to welcome you to <strong>Clare Senior Care Premium Services</strong>,
            an invitation-only private program that serves an elite circle by delivering excellence in
            lifestyle, travel, and business assistance.
          </p>
          <p className="text-white/80">
            We invite you to embark on a journey full of possibilities. Our team brings diverse
            backgrounds, decades of experience, and worldwide connections to craft rich and unique
            experiences for you and your family. With the assistance of a Clare Concierge, your
            experiences are elevated and managed flawlessly—no details spared—while ensuring the best
            value for your time and resources.
          </p>
          <p className="text-white/80">
            In the tradition of our signature touch, every project is carried out with strict confidentiality.
            We respect and protect our members’ privacy at all times.
          </p>
          <p className="text-white/80">You’re now ready to enjoy the benefits of your Membership.</p>
          <p className="text-white/70 italic">— The Clare Premium Services Team</p>
        </div>

        {/* Who we are */}
        <div className="space-y-3 mb-6">
          <h3 className="text-lg font-semibold">Who we are</h3>
          <p className="text-white/80">
            Clare’s DNA blends care coordinators, avid travelers, experience designers, hospitality experts,
            and technology visionaries with a deep-rooted passion for service. Our vision is to enhance the
            lives of members by delivering the most trusted white-glove service on earth.
          </p>
          <p className="text-white/80">
            With decades of combined experience across travel and lifestyle concierge, we help families
            discover new places, live new experiences, develop new skills, taste new flavors—and often, find
            themselves—by connecting dreams and ideas to awe-inspiring realities.
          </p>
        </div>

        {/* FAQ */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>Do I have to be a member to use Clare Premium Services?</AccordionTrigger>
            <AccordionContent>
              Yes. Clare Premium Services is a <strong>members-only</strong> program.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q2">
            <AccordionTrigger>How can I become a Clare Premium member?</AccordionTrigger>
            <AccordionContent> Click on Join Now Button on the Home Page
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q3">
            <AccordionTrigger>What are the annual dues for membership?</AccordionTrigger>
            <AccordionContent>
              Exclusive Member Only Benefit is available free to all Privately Paid Clients
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
