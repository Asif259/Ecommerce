"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Mail, Instagram, Facebook as FacebookIcon } from "lucide-react";

export const Footer = () => {
  return (
    <div>
      {/* Animated Footer with Wave Effect */}
      <footer className="relative bg-gradient-to-b from-[#3D3D3D] to-[#2a2a2a] text-white overflow-hidden">
        {/* Animated Wave Background */}
        <div className="absolute inset-x-0 bottom-0 z-0">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <motion.path
              initial={{
                d: "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              }}
              animate={{
                d: [
                  "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,154.7C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              fill="rgba(156, 169, 134, 0.2)"
            />
            <motion.path
              initial={{
                d: "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,160C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              }}
              animate={{
                d: [
                  "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,160C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,133.3C672,139,768,181,864,186.7C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,160C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                ],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              fill="rgba(127, 98, 68, 0.3)"
            />
            <motion.path
              initial={{
                d: "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              }}
              animate={{
                d: [
                  "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,256L48,234.7C96,213,192,171,288,170.7C384,171,480,213,576,218.7C672,224,768,192,864,181.3C960,171,1056,181,1152,197.3C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                ],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              fill="rgba(212, 197, 185, 0.15)"
            />
          </svg>
        </div>

        {/* Footer Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Logo and Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center mb-6"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 mb-2"
            >
              <img
                src="/logo.png"
                alt="Home Decor And More Logo"
                className="w-full h-full object-contain"
              />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-1">
              Home Decor And More
            </h3>
            <p className="text-white/60 text-center max-w-md text-sm">
              Transform your house into a home with our curated collection of
              beautiful decor and furniture.
            </p>
          </motion.div>

          {/* Social Media Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center gap-4 mb-6"
          >
            {[
              {
                Icon: FacebookIcon,
                href: "https://www.facebook.com/share/1F6uS9KnJ8/",
                label: "Facebook",
              },
              {
                Icon: Instagram,
                href: "https://www.instagram.com/homedecorandmore_1?igsh=Y2FxaWdnMTEybmU0",
                label: "Instagram",
              },
              {
                Icon: Mail,
                href: "mailto:info@homedecor-more.com",
                label: "Email",
              },
            ].map(({ Icon, href, label }, index) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ transitionDelay: `${index * 0.1}s` }}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-[#7F6244] hover:border-[#7F6244] transition-all duration-300 group"
                aria-label={label}
              >
                <Icon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              </motion.a>
            ))}
          </motion.div>

          {/* Navigation Links */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 mb-6"
          >
            {[
              { name: "Home", href: "/home" },
              { name: "Products", href: "/products" },
              { name: "Categories", href: "/category" },
              { name: "About", href: "#about" },
              { name: "Contact", href: "#contact" },
            ].map((link, index) => (
              <motion.div
                key={link.name}
                whileHover={{ scale: 1.1, y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="text-white/80 hover:text-white font-medium text-sm transition-colors duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9CA986] group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Official Email Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-5"
          >
            <motion.a
              href="mailto:homedecorandmore001@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-[#9CA986] hover:border-[#9CA986] transition-all duration-300 group"
            >
              <Mail className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span className="text-white text-sm">
                homedecorandmore001@gmail.com
              </span>
            </motion.a>
          </motion.div>

          {/* Bottom Section - Developer Credit & Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center pt-4 border-t border-white/10"
          >
            {/* Developer Credit */}
            <div className="mb-3">
              <p className="text-white/40 text-xs mb-1">
                Designed & Developed by{" "}
                <motion.span
                  className="text-white/70 font-semibold"
                  whileHover={{ color: "rgba(156, 169, 134, 1)" }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href="https://www.linkedin.com/in/ashraful-asif/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 font-semibold hover:text-[#9CA986] transition-colors duration-300"
                  >
                    Ashraful Asif
                  </Link>
                </motion.span>
              </p>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-white/50 text-xs">
                © {new Date().getFullYear()} Home Decor & More. All rights
                reserved.
              </p>
              <p className="text-white/40 text-xs mt-1">
                Made with{" "}
                <Heart className="inline w-3 h-3 text-red-400 fill-current" />{" "}
                for beautiful homes
              </p>
            </div>
          </motion.div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#9CA986]/20 rounded-full blur-2xl animate-pulse"></div>
        <div
          className="absolute top-20 right-20 w-32 h-32 bg-[#7F6244]/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-24 h-24 bg-[#D4C5B9]/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </footer>
    </div>
  );
};
