import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, RotateCcw, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { EnhancedStopAndWait } from "@/components/protocols/EnhancedStopAndWait";
import { EnhancedGoBackN } from "@/components/protocols/EnhancedGoBackN";
import { EnhancedSelectiveRepeat } from "@/components/protocols/EnhancedSelectiveRepeat";
import { EnhancedTCPHandshake } from "@/components/protocols/EnhancedTCPHandshake";
import { EnhancedUDP } from "@/components/protocols/EnhancedUDP";
import { EnhancedHTTP } from "@/components/protocols/EnhancedHTTP";
import { EnhancedDNS } from "@/components/protocols/EnhancedDNS";
import { EnhancedARP } from "@/components/protocols/EnhancedARP";
import { EnhancedICMP } from "@/components/protocols/EnhancedICMP";
import { EnhancedDHCP } from "@/components/protocols/EnhancedDHCP";
import { EnhancedFTP } from "@/components/protocols/EnhancedFTP";
import { EnhancedSMTP } from "@/components/protocols/EnhancedSMTP";
import { EnhancedTLS } from "@/components/protocols/EnhancedTLS";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { toast } from "sonner";

const protocolData = {
  "stop-and-wait": {
    name: "Stop-and-Wait ARQ",
    description: "A simple flow control protocol where the sender transmits one frame and waits for an acknowledgment before sending the next frame.",
    steps: [
      { step: 1, title: "Send Frame", desc: "Sender transmits Frame 0 to receiver" },
      { step: 2, title: "Wait for ACK", desc: "Sender waits and starts timeout timer" },
      { step: 3, title: "Receive & Process", desc: "Receiver processes the frame" },
      { step: 4, title: "Send ACK", desc: "Receiver sends acknowledgment back" },
      { step: 5, title: "Next Frame", desc: "Sender receives ACK and sends next frame" },
    ],
    component: EnhancedStopAndWait,
  },
  "go-back-n": {
    name: "Go-Back-N ARQ",
    description: "Sliding window protocol where sender can transmit multiple frames before waiting for acknowledgment, but retransmits all frames after a lost one.",
    steps: [
      { step: 1, title: "Send Window", desc: "Sender transmits frames 0-3 in window" },
      { step: 2, title: "ACK Received", desc: "Receiver acknowledges Frame 0" },
      { step: 3, title: "Slide Window", desc: "Window slides, Frame 4 sent" },
      { step: 4, title: "Frame Lost", desc: "Frame 2 is lost during transmission" },
      { step: 5, title: "Go Back", desc: "Timeout occurs, retransmit from Frame 2" },
      { step: 6, title: "Resume", desc: "Continue transmission after retransmit" },
    ],
    component: EnhancedGoBackN,
  },
  "selective-repeat": {
    name: "Selective Repeat ARQ",
    description: "Advanced sliding window protocol that retransmits only the lost or corrupted frames, not all subsequent frames.",
    steps: [
      { step: 1, title: "Send Frame 0", desc: "First frame transmitted" },
      { step: 2, title: "Send Frame 1", desc: "Second frame transmitted" },
      { step: 3, title: "Frame 2 Lost", desc: "Third frame is lost in transit" },
      { step: 4, title: "Send Frame 3", desc: "Fourth frame transmitted successfully" },
      { step: 5, title: "NAK/Timeout", desc: "Receiver detects missing Frame 2" },
      { step: 6, title: "Selective Retransmit", desc: "Only Frame 2 is retransmitted" },
    ],
    component: EnhancedSelectiveRepeat,
  },
  "tcp-handshake": {
    name: "TCP 3-Way Handshake",
    description: "Connection establishment protocol that ensures both client and server are ready to exchange data.",
    steps: [
      { step: 1, title: "SYN", desc: "Client sends SYN packet with initial sequence number" },
      { step: 2, title: "SYN-ACK", desc: "Server responds with SYN-ACK, acknowledging client's SYN" },
      { step: 3, title: "ACK", desc: "Client sends ACK to acknowledge server's SYN" },
      { step: 4, title: "Connected", desc: "Connection established, ready for data transfer" },
    ],
    component: EnhancedTCPHandshake,
  },
  "udp": {
    name: "UDP",
    description: "User Datagram Protocol - a connectionless protocol for fast data transmission without delivery guarantees or ordering.",
    steps: [
      { step: 1, title: "Send Packet 1", desc: "Client sends first datagram" },
      { step: 2, title: "Send Packet 2", desc: "Second datagram sent immediately" },
      { step: 3, title: "Send Packet 3", desc: "Third datagram sent without waiting" },
      { step: 4, title: "No ACK", desc: "No acknowledgment required - fire and forget" },
    ],
    component: EnhancedUDP,
  },
  "http": {
    name: "HTTP/HTTPS",
    description: "Hypertext Transfer Protocol - request-response protocol for web communication between browsers and servers.",
    steps: [
      { step: 1, title: "HTTP Request", desc: "Browser sends GET request with headers" },
      { step: 2, title: "Request Travel", desc: "Request travels to web server" },
      { step: 3, title: "Server Process", desc: "Server processes request and prepares response" },
      { step: 4, title: "HTTP Response", desc: "Server sends 200 OK with content" },
      { step: 5, title: "Page Rendered", desc: "Browser receives and renders the page" },
    ],
    component: EnhancedHTTP,
  },
  "dns": {
    name: "DNS Resolution",
    description: "The process of translating a human-readable domain name into an IP address through DNS servers.",
    steps: [
      { step: 1, title: "Query", desc: "Client sends DNS query for domain name" },
      { step: 2, title: "Recursive Lookup", desc: "DNS resolver contacts root server" },
      { step: 3, title: "TLD Server", desc: "Query forwarded to TLD server (.com, .org, etc.)" },
      { step: 4, title: "Authoritative Server", desc: "Final lookup at authoritative nameserver" },
      { step: 5, title: "Response", desc: "IP address returned to client" },
    ],
    component: EnhancedDNS,
  },
  "arp": {
    name: "ARP",
    description: "Address Resolution Protocol maps IP addresses to MAC addresses on local networks.",
    steps: [
      { step: 1, title: "ARP Request", desc: "Host broadcasts 'Who has this IP?'" },
      { step: 2, title: "Broadcast", desc: "Request sent to all devices on network" },
      { step: 3, title: "ARP Reply", desc: "Target host responds with MAC address" },
      { step: 4, title: "MAC Address", desc: "Requester receives MAC address" },
      { step: 5, title: "Cache Update", desc: "ARP cache updated with IP-MAC mapping" },
    ],
    component: EnhancedARP,
  },
  "icmp": {
    name: "ICMP (Ping)",
    description: "Internet Control Message Protocol used for network diagnostics and error reporting.",
    steps: [
      { step: 1, title: "Echo Request", desc: "Source sends ICMP Echo Request (ping)" },
      { step: 2, title: "Packet Travel", desc: "Request travels to destination" },
      { step: 3, title: "Echo Reply", desc: "Destination sends Echo Reply back" },
      { step: 4, title: "Reply Travel", desc: "Reply returns to source" },
      { step: 5, title: "RTT Calculated", desc: "Round-trip time measured and displayed" },
    ],
    component: EnhancedICMP,
  },
  "dhcp": {
    name: "DHCP",
    description: "Dynamic Host Configuration Protocol automatically assigns IP addresses to devices on a network.",
    steps: [
      { step: 1, title: "Discover", desc: "Client broadcasts DHCP Discover message" },
      { step: 2, title: "Offer", desc: "Server responds with IP address offer" },
      { step: 3, title: "Request", desc: "Client requests the offered IP address" },
      { step: 4, title: "Acknowledge", desc: "Server confirms and assigns the IP address" },
    ],
    component: EnhancedDHCP,
  },
  "ftp": {
    name: "FTP",
    description: "File Transfer Protocol uses separate control and data channels for reliable file transfer.",
    steps: [
      { step: 1, title: "Connection", desc: "Client connects to FTP server (Port 21)" },
      { step: 2, title: "Authentication", desc: "Username and password verification" },
      { step: 3, title: "Command", desc: "Client sends RETR command for file" },
      { step: 4, title: "Data Transfer", desc: "File transferred via data channel (Port 20)" },
      { step: 5, title: "Complete", desc: "Transfer complete, connection closed" },
    ],
    component: EnhancedFTP,
  },
  "smtp": {
    name: "SMTP",
    description: "Simple Mail Transfer Protocol handles email transmission between mail servers.",
    steps: [
      { step: 1, title: "Compose", desc: "User composes email in mail client" },
      { step: 2, title: "SMTP Handshake", desc: "Client connects and authenticates with SMTP server" },
      { step: 3, title: "Mail Data", desc: "Email headers and body transmitted" },
      { step: 4, title: "Forward", desc: "SMTP server forwards to recipient's mail server" },
      { step: 5, title: "Delivered", desc: "Email delivered to recipient's mailbox" },
    ],
    component: EnhancedSMTP,
  },
  "tls": {
    name: "TLS/SSL",
    description: "Transport Layer Security provides encryption and authentication for secure communication.",
    steps: [
      { step: 1, title: "Client Hello", desc: "Client initiates handshake with supported ciphers" },
      { step: 2, title: "Server Hello", desc: "Server responds with certificate and chosen cipher" },
      { step: 3, title: "Key Exchange", desc: "Pre-master secret exchanged and encrypted" },
      { step: 4, title: "Session Keys", desc: "Both sides generate session keys" },
      { step: 5, title: "Encrypted", desc: "Secure communication established" },
    ],
    component: EnhancedTLS,
  },
};

const ProtocolVisualization = () => {
  const { protocolId } = useParams<{ protocolId: string }>();
  const protocol = protocolId ? protocolData[protocolId as keyof typeof protocolData] : null;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState([1]);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);

  useEffect(() => {
    if (!isPlaying || !protocol) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= protocol.steps.length - 1) {
          setIsPlaying(false);
          const log = `[${new Date().toLocaleTimeString()}] Simulation completed - ${protocol.name}`;
          setSimulationLog(logs => [...logs, log]);
          return prev;
        }
        const nextStep = prev + 1;
        const log = `[${new Date().toLocaleTimeString()}] Step ${nextStep}: ${protocol.steps[nextStep].title}`;
        setSimulationLog(logs => [...logs, log]);
        return nextStep;
      });
    }, 2000 / speed[0]);

    return () => clearInterval(interval);
  }, [isPlaying, speed, protocol]);

  const exportLogs = () => {
    const logsText = simulationLog.join('\n');
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${protocolId}-simulation-log.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Simulation log exported!");
  };

  if (!protocol) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Protocol Not Found</h2>
          <Link to="/protocols">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Protocols
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const ProtocolComponent = protocol.component;

  return (
    <div className="min-h-screen">
      <StarfieldBackground />
      <ThemeToggle />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <Link to="/protocols">
          <Button variant="ghost" className="mb-6 hover:bg-primary/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Protocols
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
            <Card className="glass-card p-6">
              <h1 className="text-3xl font-bold mb-2 text-gradient">{protocol.name}</h1>
              <p className="text-muted-foreground mb-6">{protocol.description}</p>

              {/* Canvas */}
              <div className="bg-card/20 rounded-xl border border-primary/20 p-8 mb-6 min-h-[400px] flex items-center justify-center">
                <ProtocolComponent currentStep={currentStep} isPlaying={isPlaying} />
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    {isPlaying ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setCurrentStep((prev) => Math.min(prev + 1, protocol.steps.length - 1));
                      setIsPlaying(false);
                    }}
                    disabled={currentStep >= protocol.steps.length - 1}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setCurrentStep(0);
                      setIsPlaying(false);
                    }}
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Reset
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={exportLogs}
                    disabled={simulationLog.length === 0}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Export Log
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium whitespace-nowrap">Speed: {speed[0]}x</span>
                  <Slider
                    value={speed}
                    onValueChange={setSpeed}
                    min={0.5}
                    max={2}
                    step={0.5}
                    className="flex-1"
                  />
                </div>
              </div>
            </Card>
            </motion.div>
          </div>

          {/* Explanation Panel */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4 text-primary">How It Works</h2>
              <div className="space-y-3">
                {protocol.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      index === currentStep
                        ? "border-primary bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                        : "border-primary/20 bg-card/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        {step.step}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="glass-card p-6">
              <h3 className="font-bold mb-2 text-secondary">Current Step</h3>
              <p className="text-2xl font-bold text-gradient">
                {protocol.steps[currentStep]?.title || "Start"}
              </p>
            </Card>

            {/* Simulation Log */}
            {simulationLog.length > 0 && (
              <Card className="glass-card p-4">
                <h3 className="font-bold mb-2 text-sm text-muted-foreground">Simulation Log</h3>
                <div className="bg-background/50 rounded p-2 max-h-32 overflow-y-auto text-xs font-mono space-y-1">
                  {simulationLog.slice(-5).map((log, i) => (
                    <div key={i} className="text-muted-foreground">{log}</div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolVisualization;
