
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GamerVerseLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Gamepad2, Gift } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container py-12">
        <div className="max-w-4xl mx-auto text-center">
            <GamerVerseLogo className="text-5xl justify-center mb-4" />
            <h1 className="text-4xl font-bold">About GamerVerse</h1>
            <p className="text-xl text-muted-foreground mt-2">Your Universe of Games.</p>
        </div>

        <Card className="mt-12 glassmorphism">
            <CardContent className="p-8 md:p-12 text-lg text-muted-foreground leading-relaxed space-y-6">
                <p>
                    Welcome to <strong>GamerVerse</strong>, your premier destination for digital games. We are a passionate team of gamers dedicated to providing a seamless and affordable way for players everywhere to access their next favorite adventure. Our mission is simple: to make gaming more accessible, convenient, and exciting for everyone.
                </p>
                <p>
                    We believe that gaming is more than just a hobby—it's a community, an art form, and a source of endless entertainment. That's why we've built a platform that puts the player first, offering a curated selection of titles at unbeatable prices.
                </p>
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
            <Card>
                 <CardHeader>
                    <div className="flex items-center gap-4">
                        <Gamepad2 className="h-8 w-8 text-primary" />
                        <CardTitle>Our Mission</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        To build a universe where every gamer can instantly discover and enjoy the games they love, backed by excellent service and a commitment to the gaming community. We strive to offer a diverse library that caters to all tastes, from indie gems to blockbuster titles.
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Gift className="h-8 w-8 text-primary" />
                        <CardTitle>What We Offer</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        We provide official, digital game keys and accounts with instant delivery. Our unique model allows us to offer competitive pricing and a hassle-free experience. Once you complete your purchase, you'll receive everything you need to start playing right away.
                    </p>
                </CardContent>
            </Card>
        </div>

        <div className="text-center mt-12">
             <h2 className="text-3xl font-bold">Ready to Play?</h2>
             <p className="text-muted-foreground mt-2 mb-6">Explore our collection and find your next game.</p>
             <Button size="lg" asChild>
                <Link href="/games">
                    Browse All Games <ArrowRight className="ml-2" />
                </Link>
             </Button>
        </div>
    </div>
  );
}
