import React from "react";
import { motion } from "framer-motion";
import { Instagram, Twitter, Facebook, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
    const legalLinks = [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms-of-service" },
        { name: "Cookie Policy", path: "#" },
        { name: "Contact", path: "/contact" }
    ];

    return (
        <footer className="bg-transparent py-20 border-t border-gray-50/50 relative z-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Heart className="w-6 h-6 text-white fill-white" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Her Health</h2>
                        </div>
                        <p className="text-gray-500 text-lg max-w-sm leading-relaxed mb-8">
                            Empowering modern mothers with nedded tracking tools and trusted health insights for every step of the journey.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                <motion.a
                                    key={i}
                                    whileHover={{ y: -3, color: '#EC4899' }}
                                    href="#"
                                    className="p-3 bg-gray-50 rounded-full text-gray-400 transition-colors"
                                >
                                    <Icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-gray-900 font-bold mb-6 uppercase tracking-widest text-sm">Product</h4>
                        <ul className="space-y-4">
                            {["Features", "Tools"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors font-medium">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-gray-900 font-bold mb-6 uppercase tracking-widest text-sm">Legal</h4>
                        <ul className="space-y-4">
                            {legalLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-gray-500 hover:text-pink-600 transition-colors font-medium">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-400 font-medium">
                        © {new Date().getFullYear()} Her Health. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-gray-400 font-medium">
                        Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for mothers everywhere.
                    </div>
                </div>
            </div>
        </footer>
    );
};
