import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

export const Accordion = AccordionPrimitive.Root;
export const AccordionItem = AccordionPrimitive.Item;

export const AccordionTrigger = React.forwardRef(function AccordionTrigger(
  { className = "", children, ...props },
  ref
) {
  return (
    <AccordionPrimitive.Header className="border-b border-white/10">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={
          "w-full text-left py-3 flex items-center justify-between " +
          "text-white/90 hover:text-white transition " + className
        }
        {...props}
      >
        <span>{children}</span>
        <span className="transition-transform data-[state=open]:rotate-90">›</span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

export const AccordionContent = React.forwardRef(function AccordionContent(
  { className = "", children, ...props },
  ref
) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={"overflow-hidden data-[state=closed]:max-h-0 data-[state=open]:max-h-96 transition-[max-height] duration-300 " + className}
      {...props}
    >
      <div className="pb-4 text-white/80">{children}</div>
    </AccordionPrimitive.Content>
  );
});
