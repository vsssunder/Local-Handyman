import { workers } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, MessageCircle } from "lucide-react";

export default function WorkerProfilePage({ params }: { params: { id: string } }) {
  const worker = workers.find((w) => w.id === params.id);

  if (!worker) {
    notFound();
  }

  return (
    <div className="bg-primary/5">
      <div className="container mx-auto py-12 px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="overflow-hidden">
               <Image
                src={worker.imageUrl}
                alt={worker.name}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
                data-ai-hint="professional portrait"
              />
              <CardContent className="p-6 text-center -mt-16">
                 <Avatar className="w-24 h-24 mx-auto border-4 border-background shadow-md">
                    <AvatarImage src={worker.avatarUrl} alt={worker.name} data-ai-hint="person"/>
                    <AvatarFallback className="text-3xl">{worker.name.charAt(0)}</AvatarFallback>
                 </Avatar>
                <h2 className="text-2xl font-bold mt-4 font-headline">{worker.name}</h2>
                <p className="text-muted-foreground">{worker.specialty}</p>
                <div className="flex justify-center items-center gap-2 mt-2 text-amber-500">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-lg font-bold">{worker.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">({worker.reviews?.length || 0} reviews)</span>
                </div>
                <Button className="mt-4 w-full bg-accent hover:bg-accent/90 text-accent-foreground">Contact {worker.name.split(' ')[0]}</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg">Working Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {worker.workingLocations?.map(loc => (
                    <li key={loc} className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{loc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg">About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{worker.bio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {worker.skills.map((skill) => (
                  <Badge key={skill} variant="default">{skill}</Badge>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg">Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {worker.reviews && worker.reviews.length > 0 ? worker.reviews.map((review) => (
                  <div key={review.id}>
                    <div className="flex gap-4">
                       <Avatar>
                        <AvatarImage src={`https://placehold.co/40x40.png`} alt={review.author} data-ai-hint="person avatar"/>
                        <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                       </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{review.author}</p>
                          <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            {[...Array(5-review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-muted-foreground/50" />)}
                          </div>
                        </div>
                        <p className="text-foreground/80 mt-1">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-muted-foreground text-center py-4">No reviews yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
