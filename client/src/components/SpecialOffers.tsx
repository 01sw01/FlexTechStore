import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function SpecialOffers() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 365,
    hours: 23,
    minutes: 7,
    seconds: 49,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Card className="overflow-hidden bg-gradient-to-r from-primary/20 to-primary/10">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="space-y-3 text-center md:text-left">
              <div className="flex items-center gap-2 md:justify-start">
                <Badge variant="destructive" className="text-base font-bold">
                  50% OFF
                </Badge>
                <h2 className="font-display text-2xl font-bold md:text-3xl">Special Offer!</h2>
              </div>
              <p className="text-muted-foreground">
                Hurry up! Offer ends in:
              </p>
            </div>

            <div className="flex gap-2 md:gap-4" data-testid="countdown-timer">
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary md:h-16 md:w-16">
                  <span className="text-xl font-bold text-primary-foreground md:text-2xl" data-testid="timer-days">
                    {timeLeft.days}
                  </span>
                </div>
                <span className="mt-1 text-xs text-muted-foreground">DAYS</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary md:h-16 md:w-16">
                  <span className="text-xl font-bold text-primary-foreground md:text-2xl" data-testid="timer-hours">
                    {timeLeft.hours}
                  </span>
                </div>
                <span className="mt-1 text-xs text-muted-foreground">HRS</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary md:h-16 md:w-16">
                  <span className="text-xl font-bold text-primary-foreground md:text-2xl" data-testid="timer-minutes">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                </div>
                <span className="mt-1 text-xs text-muted-foreground">MINS</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary md:h-16 md:w-16">
                  <span className="text-xl font-bold text-primary-foreground md:text-2xl" data-testid="timer-seconds">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                </div>
                <span className="mt-1 text-xs text-muted-foreground">SECS</span>
              </div>
            </div>

            <Button size="lg" data-testid="button-shop-now">
              SHOP NOW
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
