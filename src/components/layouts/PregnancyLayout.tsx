import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Baby,
  Heart,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Book,
  History,
  PlayCircle,
  Brain,
  Lightbulb
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { getWeeklyTip, getPregnancyWeekFromStorage } from "@/data/weeklyTips";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { differenceInWeeks } from "date-fns";

export default function PregnancyLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState<number>(() => getPregnancyWeekFromStorage());
  const [weeklyTip, setWeeklyTip] = useState(() => getWeeklyTip(getPregnancyWeekFromStorage()));

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const updateWeek = (week: number) => {
      setCurrentWeek(week);
      setWeeklyTip(getWeeklyTip(week));
    };

    // Initial load from storage
    updateWeek(getPregnancyWeekFromStorage());

    // Firebase Realtime Listener
    if (user?.uid) {
      const pregnancyDocRef = doc(db, "users", user.uid, "pregnancyDetails", "current");
      unsubscribe = onSnapshot(pregnancyDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          // start with stored value (may be 0) to avoid forcing to 1
          let week = getPregnancyWeekFromStorage();

          if (data.weeksPregnant !== undefined) {
            week = Math.min(Math.max(data.weeksPregnant, 0), 42);
          } else if (data.lastPeriodDate) {
            const lmpDate = data.lastPeriodDate instanceof Timestamp
              ? data.lastPeriodDate.toDate()
              : new Date(data.lastPeriodDate);
            const today = new Date();
            week = differenceInWeeks(today, lmpDate);
            week = Math.min(Math.max(week, 0), 42);
          }

          updateWeek(week);
        }
      }, (error) => {
        console.error("Error listening to pregnancy details:", error);
      });
    }

    const handleStorageChange = () => {
      updateWeek(getPregnancyWeekFromStorage());
    };

    // Poll local storage every 2s as a fallback to quickly pick up changes or race conditions
    const poll = setInterval(() => {
      updateWeek(getPregnancyWeekFromStorage());
    }, 2000);

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("pregnancyDataUpdate", handleStorageChange);

    return () => {
      if (unsubscribe) unsubscribe();
      clearInterval(poll);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("pregnancyDataUpdate", handleStorageChange);
    }; 
  }, [user?.uid]);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    {
      name: "Home",
      path: "",
      icon: <Baby className="h-5 w-5" />,
    },
    {
      name: "Mom",
      path: "mom",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      name: "Myths",
      path: "myths",
      icon: <Brain className="h-5 w-5" />,
    },
    {
      name: "Learn",
      path: "learn",
      icon: <Book className="h-5 w-5" />,
    },
    {
      name: "Videos",
      path: "videos",
      icon: <PlayCircle className="h-5 w-5" />,
    },
    {
      name: "History",
      path: "history",
      icon: <History className="h-5 w-5" />,
    },
    {
      name: "Profile",
      path: "profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9FB] relative">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <Baby className="h-5 w-5 text-white" />
            </div>
            <h1
              className="font-heading font-bold text-pink-700 text-xl cursor-pointer"
              onClick={() => navigate("/pregnancy-dashboard")}
            >
              Girl Health
            </h1>
          </div>

          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-pink-600 hover:bg-pink-50">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 border-r-pink-100">
              <div className="flex flex-col h-full bg-white">
                <div className="p-6 border-b border-pink-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                      <Baby className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="font-heading font-bold text-pink-700 text-xl">Girl Health</h2>
                  </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-pink-50 text-pink-700 font-semibold shadow-sm"
                          : "text-slate-600 hover:bg-pink-50/50 hover:text-pink-600"
                      )}
                      onClick={() => {
                        if (isMobile) {
                          setMobileSidebarOpen(false);
                        }
                      }}
                    >
                      <span className={cn(
                        "p-2 rounded-lg transition-colors",
                        "bg-white shadow-sm"
                      )}>
                        {React.cloneElement(item.icon as React.ReactElement, { className: "h-5 w-5" })}
                      </span>
                      <span className="text-sm">{item.name}</span>
                    </NavLink>
                  ))}

                  <div className="pt-4 px-2">
                    <div className="bg-gradient-to-br from-pink-50 to-lavender/20 rounded-2xl p-4 border border-pink-100/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="h-3 w-3 text-pink-600" />
                        <p className="text-xs font-semibold text-pink-600 uppercase tracking-wider">Week {currentWeek} Tip</p>
                      </div>
                      <p className="text-sm text-pink-800/80 leading-relaxed break-words whitespace-normal">{weeklyTip.tip} {weeklyTip.emoji}</p>
                    </div>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden md:flex flex-col border-r border-pink-100 bg-white transition-all duration-300 ease-in-out relative z-10",
            sidebarOpen ? "w-72" : "w-20"
          )}
        >
          <div className="absolute -right-3 top-10 z-20">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-6 w-6 rounded-full bg-white border-pink-100 text-pink-500 hover:bg-pink-50 hover:text-pink-600 shadow-sm"
            >
              {sidebarOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 p-2 rounded-2xl transition-all duration-200 group",
                  isActive
                    ? "bg-pink-50 text-pink-700 font-semibold shadow-sm"
                    : "text-slate-500 hover:bg-pink-50/50 hover:text-pink-600",
                  !sidebarOpen && "justify-center px-0"
                )}
              >
                {({ isActive }) => (
                  <>
                    <div className={cn(
                      "flex items-center justify-center p-2.5 rounded-xl transition-all duration-200",
                      "bg-white shadow-sm group-hover:scale-110",
                      sidebarOpen ? "ml-1" : "ml-0"
                    )}>
                      {React.cloneElement(item.icon as React.ReactElement, { className: "h-5 w-5" })}
                    </div>
                    {sidebarOpen && (
                      <span className="text-[15px] tracking-tight">{item.name}</span>
                    )}
                    {isActive && sidebarOpen && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-500 mr-2" />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {sidebarOpen && (
              <div className="pt-4">
                <div className="bg-gradient-to-br from-pink-50 to-lavender/20 rounded-2xl p-4 border border-pink-100/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="h-3 w-3 text-pink-600" />
                    <p className="text-xs font-semibold text-pink-600 uppercase tracking-wider">Week {currentWeek} Tip</p>
                  </div>
                  <p className="text-sm text-pink-800/80 leading-relaxed break-words whitespace-normal">{weeklyTip.tip} {weeklyTip.emoji}</p>
                </div>
              </div>
            )}
          </nav>

        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-[#FFF9FB]">
          <div className="max-w-7xl mx-auto w-full p-6 md:p-8 lg:p-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
