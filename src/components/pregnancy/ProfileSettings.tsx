import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addWeeks, subWeeks, isBefore, isAfter, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, AlertCircle, LogOut, User, Mail, RefreshCw, Settings2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProfileSettings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signOutUser } = useFirebaseAuth();

  const { user } = useAuth();
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [pregnancyWeeks, setPregnancyWeeks] = useState<number | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const minAllowedDate = subWeeks(new Date(), 40);

  const formSchema = z.object({
    lastPeriodDate: z.date({
      required_error: "Please select your last period start date.",
    }).refine(
      (date) => isAfter(date, minAllowedDate),
      {
        message: "Date cannot be more than 40 weeks in the past.",
      }
    ).refine(
      (date) => isBefore(date, new Date()),
      {
        message: "Date cannot be in the future.",
      }
    ),
    dueDate: z.date({
      required_error: "Please select your due date.",
    }).refine(
      (date) => !isBefore(date, new Date()),
      {
        message: "Due date cannot be before today.",
      }
    ),
    manualDueDate: z.boolean().optional(),
  }).refine(
    (data) => {
      if (!data.lastPeriodDate || !data.dueDate) return true;
      const diff = data.dueDate.getTime() - data.lastPeriodDate.getTime();
      const minDiff = 280 * 24 * 60 * 60 * 1000;
      return diff >= minDiff;
    },
    {
      message: "Due date must be at least 280 days from last period start date.",
      path: ["dueDate"],
    }
  );

  type FormValues = z.infer<typeof formSchema>;

  const calculatePregnancyWeeks = (lastPeriodDate: Date): number => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastPeriodDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    if ((weeks === 41 && days >= 6) || (weeks === 41 && days === 0 && diffDays >= 294)) {
      return 42;
    }
    return weeks;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      manualDueDate: false,
    },
  });

  const watchedLastPeriodDate = form.watch("lastPeriodDate");
  React.useEffect(() => {
    if (watchedLastPeriodDate) {
      const calculatedDueDate = addDays(watchedLastPeriodDate, 280);
      form.setValue("dueDate", calculatedDueDate);
    }
  }, [watchedLastPeriodDate, form]);

  function onSubmit(data: FormValues) {
    if (data.dueDate < new Date()) {
      toast({
        title: "Invalid Due Date",
        description: "Due date cannot be before today.",
        variant: "destructive",
      });
      return;
    }

    const diff = data.dueDate.getTime() - data.lastPeriodDate.getTime();
    const minDiff = 280 * 24 * 60 * 60 * 1000;
    if (diff < minDiff) {
      toast({
        title: "Invalid Due Date",
        description: "Due date must be at least 280 days from last period start date.",
        variant: "destructive",
      });
      return;
    }

    setDueDate(data.dueDate);
    setPregnancyWeeks(calculatePregnancyWeeks(data.lastPeriodDate));

    localStorage.setItem("lastPeriodDate", data.lastPeriodDate.toISOString());
    localStorage.setItem("dueDate", data.dueDate.toISOString());
    localStorage.setItem("pregnancyStartDate", new Date().toISOString());

    if (user?.uid) {
      const pregnancyDocRef = doc(db, "users", user.uid, "pregnancyDetails", "current");
      setDoc(pregnancyDocRef, {
        lastPeriodDate: Timestamp.fromDate(data.lastPeriodDate),
        dueDate: Timestamp.fromDate(data.dueDate),
        pregnancyStartDate: serverTimestamp(),
        updatedAt: serverTimestamp(),
        source: "profile-settings-reset-form"
      }, { merge: true });
    }

    toast({
      title: "Success",
      description: "Pregnancy information updated.",
    });

    navigate("/pregnancy-dashboard");
  }

  const handleConfirmLogout = async () => {
    localStorage.clear();
    await signOutUser();
    navigate("/");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto space-y-8 pb-12 px-4"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-pink-100 rounded-2xl">
          <Settings2 className="w-8 h-8 text-pink-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Profile</h1>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Account Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-white/20 bg-white/60 backdrop-blur-xl shadow-2xl shadow-pink-100/20 rounded-[2rem]">
            <CardHeader className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-6">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-pink-500" />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 min-w-0 w-full">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span title={user?.email || "No email linked"} className="text-xs sm:text-sm md:text-base font-semibold text-slate-600 truncate whitespace-nowrap overflow-hidden flex-1">{user?.email || "No email linked"}</span>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full h-12 rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-bold gap-2">
                    <LogOut className="w-4 h-4" />
                    Secure Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold">Logging out?</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500">
                      You will need to sign back in to access your pregnancy timeline and clinical tools.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl border-slate-200 h-11">Stay Logged In</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmLogout} className="rounded-xl bg-red-500 hover:bg-red-600 h-11">
                      Confirm Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>

        {/* Right: Reset Form */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden border-white/20 bg-white/60 backdrop-blur-xl shadow-2xl shadow-pink-100/20 rounded-[2rem]">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-bold">Update Pregnancy Timeline</CardTitle>
              </div>
              <CardDescription className="text-slate-500 font-medium text-base">
                Recalculate your progress if your estimated due date has changed.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="lastPeriodDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm font-bold text-slate-700">Last Period Start</FormLabel>
                          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "h-14 rounded-2xl border-slate-200 pl-4 text-left font-semibold hover:bg-slate-50",
                                    !field.value && "text-slate-400"
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Select date</span>}
                                  <CalendarIcon className="ml-auto h-5 w-5 text-pink-400" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl overflow-hidden" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => { field.onChange(date); setCalendarOpen(false); }}
                                disabled={(date) => date > new Date() || isBefore(date, minAllowedDate)}
                                className="p-3 bg-white"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => {
                        const lastPeriod = form.getValues("lastPeriodDate");
                        const maxDue = lastPeriod ? addWeeks(lastPeriod, 42) : addWeeks(new Date(), 42);
                        return (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-sm font-bold text-slate-700">Estimated Due Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "h-14 rounded-2xl border-slate-200 pl-4 text-left font-semibold hover:bg-slate-50",
                                      !field.value && "text-slate-400"
                                    )}
                                    disabled={!lastPeriod}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Select date</span>}
                                    <CalendarIcon className="ml-auto h-5 w-5 text-pink-400" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl overflow-hidden" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => !lastPeriod || date < new Date() || date > maxDue}
                                  className="p-3 bg-white"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  <Alert className="bg-blue-50/50 border-blue-100 rounded-2xl p-6">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                    <AlertTitle className="text-blue-900 font-bold mb-1">Timeline Validation</AlertTitle>
                    <AlertDescription className="text-blue-700 font-medium">
                      Calculations are based on clinical 40-week standard. Your healthcare provider's manual ultrasound scan is the most accurate reference.
                    </AlertDescription>
                  </Alert>

                  <Button
                    type="submit"
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-lg shadow-xl shadow-pink-200 hover:scale-[1.01] transition-all"
                  >
                    Sync Pregnancy Data
                  </Button>
                </form>
              </Form>

              {dueDate && pregnancyWeeks !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white shadow-2xl"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-pink-500 rounded-full" />
                    New Timeline Snapshot
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">New Due Date</p>
                      <p className="text-lg font-bold">{format(dueDate, "MMM d, yyyy")}</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Progress</p>
                      <p className="text-lg font-bold">{pregnancyWeeks} Weeks</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
