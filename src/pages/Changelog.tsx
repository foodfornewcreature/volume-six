import React from 'react';
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react'; // Assuming lucide-react is available

const Changelog: React.FC = () => {
  const books = [
    {
      title: 'புது சிருஷ்டி – தொகுதி 6',
      description: '',
      badge: 'Upcoming Release',
      badgeVariant: 'default' as const,
      image: '/book.svg'
    },
    {
      title: 'உம்முடைய ராஜ்யம் வருவதாக – தொகுதி 3',
      description: '',
      badge: 'Coming Soon',
      badgeVariant: 'outline' as const,
      image: '/book.svg'
    },
    {
      title: 'அர்மகெதோன் யுத்தம் – தொகுதி 4',
      description: '',
      badge: 'Coming Soon',
      badgeVariant: 'outline' as const,
      image: '/book.svg'
    },
    {
      title: 'தேவனுக்கும் மனிதனுக்கும் இடையே ஒப்புரவாகுதல் – தொகுதி 5',
      description: '',
      badge: 'Coming Soon',
      badgeVariant: 'outline' as const,
      image: '/book.svg'
    },

  ];

  const availableBooks = [
    {
      title: 'யுகங்கள்ப் பற்றிய தேவ ஏற்பாடு – தொகுதி 1',
      description: '',
      image: '/book.svg',
      link: 'https://v1.foodfornewcreature.com/'
    }
  ];

  const versionFeatures = [
    'Initial app structure with chapter navigation.',
    'Theme toggle for light/dark mode.',
    'Search functionality for content.',
    'Tamil and English page numbering for chapters.',
    'Tabulations.',
  ];

  return (
    <Layout>
      <div className="min-h-screen py-8 px-4 animate-fade-in">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Version Section */}
          <section className="animate-fade-in">
            <Card className="bg-muted border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-accent-foreground">Version 1.1</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Released on November 21, 2025
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {versionFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 animate-fade-in [animation-delay:calc(0.1s*var(--i))]" style={{ '--i': index } as React.CSSProperties}>
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Available Section */}
          <section className="animate-fade-in">
            <h2 className="text-2xl font-bold text-accent-foreground mb-6">Available</h2>
            <div className="grid grid-cols-1 gap-6">
              {availableBooks.map((book, index) => (
                <Card key={index} className="animate-fade-in [animation-delay:calc(0.2s*var(--i))]" style={{ '--i': index } as React.CSSProperties}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img src={book.image} alt="Book" className="w-12 h-12 mr-4 rounded" />
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-foreground line-clamp-2 font-tiro-tamil">{book.title}</CardTitle>
                        <Button asChild className="mt-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                          <a href={book.link} target="_blank" rel="noopener noreferrer">Read Now</a>
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground line-clamp-3 font-tiro-tamil">{book.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Upcoming Section */}
          <section className="animate-fade-in">
            <h2 className="text-2xl font-bold text-accent-foreground mb-6">Upcoming</h2>
            <div className="grid grid-cols-1 gap-6">
              {books.map((book, index) => (
                <Card key={index} className="animate-fade-in [animation-delay:calc(0.2s*var(--i))]" style={{ '--i': index } as React.CSSProperties}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img src={book.image} alt="Book" className="w-12 h-12 mr-4 rounded" />
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-foreground line-clamp-2 font-tiro-tamil">{book.title}</CardTitle>
                        <Badge variant={book.badgeVariant} className="mt-2">{book.badge}</Badge>
                      </div>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground line-clamp-3 font-tiro-tamil">{book.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Contact Support Section */}
          <section className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-accent-foreground">Contact Us</CardTitle>
                <CardDescription>
                  Reach out for corrections, suggestions, or help.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <a href="https://wa.me/919790369256?text=Shalom%20Brother" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Admin
                  </a>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Changelog;
