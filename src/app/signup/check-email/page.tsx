
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Loader2 } from 'lucide-react';

function CheckEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12">
            <Card className="mx-auto max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
                        <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-headline">Check Your Email</CardTitle>
                    <CardDescription>
                        We've sent a magic link to your inbox.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground">
                        A sign-in link has been sent to <br/>
                        <strong className="text-foreground">{email || 'your email address'}</strong>.
                    </p>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Click the link in the email to complete your sign-up and log in.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

function CheckEmailSkeleton() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12">
             <Card className="mx-auto max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
                        <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-headline">Check Your Email</CardTitle>
                    <CardDescription>
                        We've sent a magic link to your inbox.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function CheckEmailPage() {
    return (
        <Suspense fallback={<CheckEmailSkeleton />}>
            <CheckEmailContent />
        </Suspense>
    );
}
