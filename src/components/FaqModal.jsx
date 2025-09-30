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
            <AccordionContent>
              There are two ways to become a member:
              <ol className="list-decimal ml-6 mt-3 space-y-2">
                <li>
                  Receive an <strong>invitation</strong> from a Clare Premium Board Member or a Clare Co-founder.
                </li>
                <li>
                  Join through one of our <strong>Premier Partners</strong> (e.g., select private communities or
                  physician/hospitality groups) that may <strong>sponsor</strong> their clients for membership.
                </li>
              </ol>
              Clare does not sell memberships to the general public.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q3">
            <AccordionTrigger>What are the annual dues for membership?</AccordionTrigger>
            <AccordionContent>
              The annual membership fee is <strong>$499 USD</strong>. Some partner communities may underwrite this fee.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q4">
            <AccordionTrigger>
              How long does it take to activate my membership after my partner community enrollment?
            </AccordionTrigger>
            <AccordionContent>
              Activation typically takes up to <strong>30 days</strong> after your partner community confirms your eligibility.
              You’ll then receive a Welcome email and Login details from Clare Premium Services.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q5">
            <AccordionTrigger>Can I arrange an induction to review benefits and member obligations?</AccordionTrigger>
            <AccordionContent>
              Absolutely. You can book a one-on-one induction with a Member-Services specialist to review benefits,
              scope, and privacy standards. Please note that Clare should already have received your membership
              information from the sponsoring partner.
              <div className="mt-4">
                <Button
                  onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                  className="rounded-xl"
                >
                  Book Induction
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
