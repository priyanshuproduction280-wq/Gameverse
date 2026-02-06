
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LifeBuoy, Search, Mail, User, CreditCard, Download, Gamepad2 } from "lucide-react";
import Link from "next/link";

const helpTopics = [
    {
        category: "Getting Started",
        icon: Gamepad2,
        questions: [
            {
                q: "How do I create an account?",
                a: "You can create an account by clicking the 'Login' button in the top right corner and then selecting 'Sign Up'. You can sign up using your email and a password, or with your Google account for faster access."
            },
            {
                q: "How do I find games?",
                a: "You can browse our entire collection by visiting the 'All Games' page. You can also use the search and filter options to find specific titles, genres, or games within your budget."
            }
        ]
    },
    {
        category: "Purchasing & Payments",
        icon: CreditCard,
        questions: [
            {
                q: "How do I purchase a game?",
                a: "Simply navigate to the game you want, add it to your cart, and proceed to checkout. You will be shown a QR code to complete the payment using your preferred payment app."
            },
             {
                q: "Is my payment information secure?",
                a: "Absolutely. We use a QR code system for payments, which means we never directly handle or store your sensitive payment card information. Your transaction is securely processed by your payment app."
            },
        ]
    },
    {
        category: "Orders & Delivery",
        icon: Download,
        questions: [
            {
                q: "How are my orders confirmed?",
                a: "After you place an order, it will appear as 'Pending' on your 'My Orders' page. Once your payment is manually verified by our team, the order status will be updated to 'Completed'."
            },
            {
                q: "How do I get my game after purchase?",
                a: "Once your order status is 'Completed', we will email you the username and password for a Steam account that contains your purchased game. You can then log in with those details to download and play."
            }
        ]
    },
     {
        category: "Account Management",
        icon: User,
        questions: [
            {
                q: "How do I update my profile?",
                a: "You can update your name, username, and phone number by visiting your 'Profile' page, accessible from the user menu in the top right corner."
            },
            {
                q: "How can I see my past orders?",
                a: "All of your pending and completed orders are available on the 'My Orders' page, which you can find in the user menu."
            }
        ]
    }
]

export default function HelpCenterPage() {
  return (
    <div className="container py-12">
        <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
                <LifeBuoy className="mx-auto h-12 w-12 text-primary mb-4" />
                <h1 className="text-4xl font-bold">Help Center</h1>
                <p className="text-muted-foreground mt-2">Find answers to your questions and get the support you need.</p>
                <div className="relative mt-6 max-w-lg mx-auto">
                    <Input placeholder="Search for help..." className="pl-10 h-11" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
            </header>

            <div className="space-y-8">
                 {helpTopics.map((topic) => {
                     const Icon = topic.icon;
                     return (
                        <Card key={topic.category} className="glassmorphism">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <Icon className="h-6 w-6 text-accent"/>
                                    <span>{topic.category}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {topic.questions.map((item, index) => (
                                        <AccordionItem key={index} value={`item-${index}`}>
                                            <AccordionTrigger>{item.q}</AccordionTrigger>
                                            <AccordionContent className="text-base text-muted-foreground">
                                                {item.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                     )
                 })}
            </div>

            <Card className="mt-12 text-center">
                 <CardHeader>
                    <CardTitle>Can't find what you're looking for?</CardTitle>
                    <CardDescription>Our support team is here to help.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/contact">
                            <Mail className="mr-2" /> Contact Support
                        </Link>
                    </Button>
                </CardContent>
            </Card>

        </div>
    </div>
  );
}
