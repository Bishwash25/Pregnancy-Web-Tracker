import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, addWeeks, subWeeks, isBefore, isAfter } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, AlertCircle, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { db } from "@/lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";

// Minimum allowed date = 40 weeks ago
const minAllowedDate = subWeeks(new Date(), 40);
const maxAllowedDate = new Date();

// Schema for the form
const formSchema = z.object({
  lastPeriodDate: z
    .date({
      required_error: "Please select your last period start date.",
    })
    .refine(
      (date) => isAfter(date, minAllowedDate) || +date === +minAllowedDate,
      {
        message: "Date cannot be more than 40 weeks in the past.",
      }
    )
    .refine((date) => isBefore(date, maxAllowedDate) || +date === +maxAllowedDate, {
      message: "Date cannot be in the future.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

const calculateDueDate = (lastPeriodDate: Date): Date => {
  return addWeeks(lastPeriodDate, 40);
};

const calculatePregnancyWeeks = (lastPeriodDate: Date): number => {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastPeriodDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;

  if (weeks >= 40 || (weeks === 39 && days >= 6)) {
    return 40;
  }

  return weeks;
};

export default function PregnancyStart() {
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [pregnancyWeeks, setPregnancyWeeks] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    const checkExistingDetails = async () => {
      if (!user?.uid) return;
      try {
        const pregnancyDocRef = doc(db, "users", user.uid, "pregnancyDetails", "current");
        const snapshot = await getDoc(pregnancyDocRef);
        if (snapshot.exists()) {
          navigate("/pregnancy-dashboard", { replace: true });
        }
      } catch {
        // ignore
      }
    };
    checkExistingDetails();
  }, [user?.uid, navigate]);

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const calculatedDueDate = calculateDueDate(data.lastPeriodDate);
    const weeks = calculatePregnancyWeeks(data.lastPeriodDate);

    setDueDate(calculatedDueDate);
    setPregnancyWeeks(weeks);

    localStorage.setItem("lastPeriodDate", data.lastPeriodDate.toISOString());
    localStorage.setItem("dueDate", calculatedDueDate.toISOString());
    localStorage.setItem("pregnancyStartDate", new Date().toISOString());

    // Dispatch event to update layouts in real-time
    window.dispatchEvent(new Event("pregnancyDataUpdate"));
    window.dispatchEvent(new Event("storage"));

    if (user?.uid) {
      const pregnancyDocRef = doc(db, "users", user.uid, "pregnancyDetails", "current");
      await setDoc(pregnancyDocRef, {
        lastPeriodDate: Timestamp.fromDate(data.lastPeriodDate),
        dueDate: Timestamp.fromDate(calculatedDueDate),
        pregnancyStartDate: serverTimestamp(),
        updatedAt: serverTimestamp(),
        source: "pregnancy-start-form",
      }, { merge: true });
    }

    toast({
      title: "Journey Started! ✨",
      description: "Your pregnancy profile has been created successfully.",
      duration: 2000,
    });

    setTimeout(() => {
      navigate("/pregnancy-dashboard");
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50/30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-pink-100 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl shadow-pink-100/50">
            <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-pink-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-3 sm:mb-4 px-2 leading-tight">
            Begin Your Journey
          </h1>
          <p className="text-base sm:text-lg text-gray-500 font-medium px-4">
            Provide your details to unlock clinical tracking and insights.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-pink-200/40 border border-white p-5 sm:p-10"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
              <FormField
                control={form.control}
                name="lastPeriodDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-700 font-bold text-base sm:text-lg mb-1 sm:mb-2">Last Period Start Date</FormLabel>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-14 sm:h-16 pl-4 text-left font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl border-pink-100 hover:border-pink-300 hover:bg-pink-50/30 transition-all shadow-sm",
                              !field.value && "text-gray-400"
                            )}
                          >
                            <span className="truncate">
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick your date</span>
                              )}
                            </span>
                            <CalendarIcon className="ml-auto h-5 w-5 text-pink-500 flex-shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[calc(100vw-2rem)] sm:w-auto p-0 rounded-2xl border-pink-100 overflow-hidden" align="center">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) =>{field.onChange(date);setCalendarOpen(false);}}
                          disabled={(date) =>
                            date > maxAllowedDate ||
                            isBefore(date, minAllowedDate)
                          }
                          initialFocus
                          className="p-3 sm:p-4"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-gray-400 text-xs sm:text-sm font-medium mt-1 sm:mt-2 leading-snug">
                      Select the first day of your last menstrual period.
                    </FormDescription>
                    <FormMessage className="font-bold text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />

              <Alert className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-100 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600 flex-shrink-0" />
                <AlertDescription className="text-gray-700 text-xs sm:text-sm font-medium ml-2 leading-relaxed">
                  To ensure clinical accuracy, dates are restricted to within the last 40 weeks.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-lg sm:text-xl shadow-xl shadow-pink-200 transition-all group flex items-center justify-center gap-2 sm:gap-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Calculating...
                  </div>
                ) : (
                  <>
                    Initialize Dashboard
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <AnimatePresence>
            {dueDate && pregnancyWeeks !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 sm:mt-10 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-pink-50/50 border border-pink-100 text-center shadow-inner"
              >
                <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6 text-pink-600">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
                  <h2 className="text-lg sm:text-xl font-bold">Clinical Summary</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                  <div className="p-4 bg-white/60 rounded-2xl border border-white">
                    <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 sm:mb-2">Due Date</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{format(dueDate, "MMM d, yyyy")}</p>
                  </div>
                  <div className="p-4 bg-white/60 rounded-2xl border border-white">
                    <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 sm:mb-2">Progress</p>
                    <p className="text-lg sm:text-xl font-bold text-pink-600 leading-tight">{pregnancyWeeks} Weeks</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
