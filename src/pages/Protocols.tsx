import { Link } from "react-router-dom";
import { ArrowLeft, Network, Wifi, Globe, Shield, Server, Mail, Radio, Lock, FileText, Cloud } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

const protocols = [
  {
    id: "stop-and-wait",
    name: "Stop-and-Wait ARQ",
    category: "Data Link Layer",
    description: "Basic flow control protocol where sender waits for acknowledgment before sending next frame",
    icon: Network,
    color: "from-cyan-500 to-blue-500",
    difficulty: "Beginner",
  },
  {
    id: "go-back-n",
    name: "Go-Back-N ARQ",
    category: "Data Link Layer",
    description: "Sliding window protocol that retransmits all frames after a lost frame",
    icon: Network,
    color: "from-blue-500 to-indigo-500",
    difficulty: "Intermediate",
  },
  {
    id: "selective-repeat",
    name: "Selective Repeat ARQ",
    category: "Data Link Layer",
    description: "Advanced sliding window protocol that retransmits only lost frames",
    icon: Network,
    color: "from-indigo-500 to-purple-500",
    difficulty: "Advanced",
  },
  {
    id: "tcp-handshake",
    name: "TCP 3-Way Handshake",
    category: "Transport Layer",
    description: "Connection establishment protocol using SYN, SYN-ACK, and ACK packets",
    icon: Wifi,
    color: "from-blue-500 to-purple-500",
    difficulty: "Intermediate",
  },
  {
    id: "udp",
    name: "UDP",
    category: "Transport Layer",
    description: "Connectionless protocol for fast, lightweight data transmission without delivery guarantees",
    icon: Radio,
    color: "from-orange-500 to-red-500",
    difficulty: "Beginner",
  },
  {
    id: "http",
    name: "HTTP/HTTPS",
    category: "Application Layer",
    description: "Web communication protocol with request-response model and secure variant",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    difficulty: "Intermediate",
  },
  {
    id: "dns",
    name: "DNS Resolution",
    category: "Application Layer",
    description: "Domain name to IP address translation process through DNS servers",
    icon: Globe,
    color: "from-purple-500 to-pink-500",
    difficulty: "Beginner",
  },
  {
    id: "arp",
    name: "ARP",
    category: "Network Layer",
    description: "Address Resolution Protocol mapping IP addresses to MAC addresses",
    icon: Network,
    color: "from-yellow-500 to-orange-500",
    difficulty: "Beginner",
  },
  {
    id: "icmp",
    name: "ICMP (Ping)",
    category: "Network Layer",
    description: "Internet Control Message Protocol for network diagnostics and error reporting",
    icon: Radio,
    color: "from-cyan-500 to-teal-500",
    difficulty: "Beginner",
  },
  {
    id: "dhcp",
    name: "DHCP",
    category: "Application Layer",
    description: "Dynamic IP configuration: Discover → Offer → Request → Acknowledge",
    icon: Server,
    color: "from-green-500 to-cyan-500",
    difficulty: "Intermediate",
  },
  {
    id: "ftp",
    name: "FTP",
    category: "Application Layer",
    description: "File Transfer Protocol with separate control and data channels",
    icon: FileText,
    color: "from-indigo-500 to-purple-500",
    difficulty: "Intermediate",
  },
  {
    id: "smtp",
    name: "SMTP",
    category: "Application Layer",
    description: "Simple Mail Transfer Protocol for email transmission between servers",
    icon: Mail,
    color: "from-pink-500 to-red-500",
    difficulty: "Intermediate",
  },
  {
    id: "tls",
    name: "TLS/SSL",
    category: "Presentation Layer",
    description: "Secure communication with encryption handshake and certificate validation",
    icon: Lock,
    color: "from-red-500 to-pink-500",
    difficulty: "Advanced",
  },
];

const Protocols = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarfieldBackground variant="protocols" />
      <ThemeToggle />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <Link to="/">
            <Button variant="ghost" className="mb-6 hover:bg-primary/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-5xl font-bold mb-4 text-gradient">
            Protocol Library
          </h1>
          <p className="text-xl text-white max-w-2xl">
            Explore interactive visualizations of network protocols. Each protocol comes with step-by-step animations and detailed explanations.
          </p>
        </div>

        {/* Protocol Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {protocols.map((protocol, index) => (
            <Link key={protocol.id} to={`/protocol/${protocol.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="group glass-card p-6 h-full transition-all duration-300 hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${protocol.color} group-hover:scale-110 transition-transform duration-300`}>
                    <protocol.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                        {protocol.name}
                      </h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                        {protocol.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-sm text-primary/70 mb-3">{protocol.category}</p>
                    <p className="text-muted-foreground">{protocol.description}</p>
                    
                    <div className="mt-4 flex items-center text-sm text-primary group-hover:translate-x-2 transition-transform duration-300">
                      View Animation →
                    </div>
                  </div>
                </div>
              </Card>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 glass-card p-8 text-center">
          <Cloud className="h-12 w-12 mx-auto mb-4 text-secondary" />
          <h2 className="text-2xl font-bold mb-2">Complete Protocol Collection</h2>
          <p className="text-muted-foreground">
            All major network protocols with interactive animations and educational explanations. Perfect for students, educators, and network professionals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Protocols;
