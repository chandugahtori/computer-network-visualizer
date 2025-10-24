import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Network, Zap, BookOpen, Target } from "lucide-react";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarfieldBackground />
      <ThemeToggle />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-32">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="mb-8 inline-block"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="relative">
                <Network className="h-20 w-20 text-primary animate-pulse-glow mx-auto" />
                <div className="absolute inset-0 blur-xl bg-primary/50 animate-pulse-glow" />
              </div>
            </motion.div>

            <motion.h1 
              className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="text-gradient">Network Protocols</span>
              <br />
              Come to Life
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-white drop-shadow-lg mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Interactive visualizations that make computer networking concepts crystal clear through stunning animations and step-by-step explanations.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Link to="/protocols">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all duration-300 hover:shadow-[0_0_50px_hsl(var(--primary)/0.8)]">
                  Explore Protocols
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-primary/50 hover:bg-primary/10"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating network nodes animation */}
          <div className="mt-20 relative h-40">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 rounded-full bg-primary/60 animate-float"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${Math.random() * 60}%`,
                  animationDelay: `${i * 0.5}s`,
                  boxShadow: "0 0 20px hsl(var(--primary))",
                }}
              />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="glass-card p-8 text-center group hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block p-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 mb-6 group-hover:rotate-12 transition-transform duration-300">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Interactive Learning</h3>
              <p className="text-foreground/90">
                Step through each protocol phase with play, pause, and speed controls. See exactly how data flows through networks.
              </p>
            </motion.div>

            <motion.div 
              className="glass-card p-8 text-center group hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="inline-block p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6 group-hover:rotate-12 transition-transform duration-300">
                <Network className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Visual Clarity</h3>
              <p className="text-foreground/90">
                Beautiful animations make complex protocols easy to understand. Perfect for students and educators.
              </p>
            </motion.div>

            <motion.div 
              className="glass-card p-8 text-center group hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="inline-block p-4 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 mb-6 group-hover:rotate-12 transition-transform duration-300">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Deep Understanding</h3>
              <p className="text-foreground/90">
                Every step comes with detailed explanations. Learn not just what happens, but why it happens.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="glass-card p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-gradient">
              Ready to Master Network Protocols?
            </h2>
            <p className="text-xl text-foreground/90 mb-8">
              Start exploring interactive visualizations of TCP, UDP, DNS, DHCP, and more.
            </p>
            <Link to="/protocols">
              <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Get Started Now
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
