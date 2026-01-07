import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BackgroundAmbience } from "../ui/welcome/BackgroundAmbience";
import { Send, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ContactPage() {
    useEffect(() => {
        document.title = "During Pregnancy Tracker - Free Pregnancy Week by Week Tracker & Due Date Calculator";
    }, []);

    const [formState, setFormState] = useState({
        name: "",
        email: "",
        message: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50/30 font-sans overflow-hidden relative">
            <BackgroundAmbience variant="purple" />

            {/* Navbar Placeholder/Back Button */}
            <div className="absolute top-6 left-6 z-50">
                <Link to="/" className="flex items-center text-gray-600 hover:text-pink-600 transition-colors font-medium">
                    <motion.div
                        whileHover={{ x: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <ArrowRight className="rotate-180 w-5 h-5 mr-2" />
                    </motion.div>
                    Back to Home
                </Link>
            </div>

            <main className="container mx-auto px-6 py-20 min-h-screen flex flex-col lg:flex-row items-center justify-center gap-16 relative z-10">

                {/* Text & Info Section */}
                <motion.div
                    className="flex-1 max-w-xl will-change-transform"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        Let's Have a <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                            Conversation
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-lg text-foreground mb-12 leading-relaxed"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        Reach out to us for support, feedback, or just say hello.
                    </motion.p>

                    <div className="space-y-8 ">
                        {[
                            { icon: Mail, title: "Email Us", content: "bishwash468@gmail.com", delay: 0.5 },
                            { icon: Phone, title: "Call Us", content: "Comming Soon", delay: 0.6 },
                            { icon: MapPin, title: "Visit Us", content: "Comming Soon", delay: 0.7 }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                className="flex items-center space-x-4 will-change-transform"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: item.delay, duration: 0.5 }}
                            >
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center text-pink-500">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                                    <p className="text-gray-500 text-sm">{item.content}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Form Section */}
                <motion.div
                    className="flex-1 w-full max-w-md perspective-[1000px] will-change-transform"
                    initial={{ 
                        opacity: 0, 
                        rotateY: typeof window !== 'undefined' && window.innerWidth > 768 ? 15 : 0, 
                        x: typeof window !== 'undefined' && window.innerWidth > 768 ? 50 : 0, 
                        y: typeof window !== 'undefined' && window.innerWidth > 768 ? 0 : 30 
                    }}
                    whileInView={{ opacity: 1, rotateY: 0, x: 0, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
                >
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50 relative overflow-hidden">
                        {/* Decorative background blob within card */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl pointer-events-none will-change-transform" />

                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formState.name}
                                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={formState.email}
                                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                                        placeholder="jane@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={4}
                                        value={formState.message}
                                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all resize-none"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-pink-500/25 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                                    {!isSubmitting && <Send className="w-4 h-4" />}
                                </motion.button>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10"
                            >
                                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Send className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                <p className="text-gray-600 mb-8">We'll get back to you as soon as possible.</p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-pink-600 font-semibold hover:text-pink-700"
                                >
                                    Send another message
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
