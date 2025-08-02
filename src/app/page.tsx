import Link from "next/link";
import Image from "next/image";
import {
  Wrench,
  Paintbrush,
  Zap,
  Construction,
  SprayCan,
  Hammer,
  UserCheck,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { featuredWorkers, serviceCategories } from "@/lib/data";

export default function Home() {
  const categoryIcons: { [key: string]: React.ReactNode } = {
    Plumbing: <Wrench className="w-8 h-8 text-primary" />,
    Painting: <Paintbrush className="w-8 h-8 text-primary" />,
    Electrical: <Zap className="w-8 h-8 text-primary" />,
    Carpentry: <Construction className="w-8 h-8 text-primary" />,
    Cleaning: <SprayCan className="w-8 h-8 text-primary" />,
    "General Handyman": <Hammer className="w-8 h-8 text-primary" />,
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-primary/10 py-20 md:py-32">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground tracking-tight font-headline">
            Your Local Handyman, One Tap Away
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
            Find trusted local professionals for any job, big or small. From
            plumbing to painting, we connect you with the right hands for the
            task.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/jobs">Find a Professional</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/signup">I'm a Professional</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 font-headline">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-primary/20 rounded-full p-4 mb-4">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-headline">Post a Job</h3>
              <p className="text-muted-foreground">
                Describe the task you need help with, set your location and
                preferred time.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/20 rounded-full p-4 mb-4">
                <UserCheck className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-headline">
                Get Matched
              </h3>
              <p className="text-muted-foreground">
                Browse profiles of skilled workers, or let them find you and
                send their offers.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/20 rounded-full p-4 mb-4">
                <BadgeCheck className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-headline">Hire & Relax</h3>
              <p className="text-muted-foreground">
                Choose the best professional for your job. Once the work is done, pay securely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category Section */}
      <section className="w-full py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 font-headline">
            Browse By Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {serviceCategories.map((category) => (
              <Link href={`/jobs?category=${encodeURIComponent(category)}`} key={category}>
                <Card className="text-center p-4 hover:shadow-lg hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="flex flex-col items-center justify-center gap-2 pt-6">
                    {categoryIcons[category]}
                    <span className="font-semibold text-center">{category}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Workers Section */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 font-headline">
            Meet Our Top Professionals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredWorkers.map((worker) => (
              <Card key={worker.id} className="overflow-hidden">
                <CardHeader className="p-0">
                   <Image
                      src={worker.imageUrl}
                      alt={worker.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                      data-ai-hint="professional portrait"
                    />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={worker.avatarUrl} alt={worker.name} data-ai-hint="person"/>
                      <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-headline">{worker.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{worker.specialty}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {worker.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                   <Button asChild className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href={`/workers/${worker.id}`}>View Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
