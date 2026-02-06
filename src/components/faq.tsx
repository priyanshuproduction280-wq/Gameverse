'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, ShieldCheck, Download, CreditCard } from "lucide-react";

const faqItems = [
    {
        icon: CreditCard,
        question: "How do I purchase a game?",
        answer: "Simply navigate to the game you want, click 'Buy Now' or 'Add to Cart', and proceed to checkout. We offer a secure and streamlined payment process."
    },
    {
        icon: ShieldCheck,
        question: "Is my payment information secure?",
        answer: "Absolutely. We use industry-standard encryption and work with trusted payment processors to ensure your financial data is always protected."
    },
    {
        icon: Download,
        question: "How do I download and install my games?",
        answer: "Once your purchase is complete, you'll receive a digital key and a download link. Follow the instructions to redeem your key on the respective platform (like Steam or Epic Games) and install your game."
    }
]

export function Faq() {
    return (
        <section className="bg-secondary/30 py-24">
            <div className="container max-w-4xl">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Quick answers to common questions.
                    </p>
                </div>
                <Accordion type="single" collapsible className="w-full">
                   {faqItems.map((item, i) => {
                       const Icon = item.icon;
                       return (
                        <AccordionItem key={i} value={`item-${i}`}>
                            <AccordionTrigger className="text-lg hover:no-underline">
                                <div className="flex items-center gap-4">
                                    <Icon className="h-6 w-6 text-primary" />
                                    {item.question}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground pl-10">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                       )
                   })}
                </Accordion>
            </div>
        </section>
    )
}
