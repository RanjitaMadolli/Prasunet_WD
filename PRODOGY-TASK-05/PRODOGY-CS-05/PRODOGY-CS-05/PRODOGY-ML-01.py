from scapy.all import sniff, IP, TCP, UDP, Raw


def packet_callback(packet):
    if IP in packet:
        ip_src = packet[IP].src
        ip_dst = packet[IP].dst
        proto = packet[IP].proto

        # Identify the protocol
        if proto == 6:
            protocol = "TCP"
        elif proto == 17:
            protocol = "UDP"
        else:
            protocol = str(proto)

        print(f"Source IP: {ip_src}")
        print(f"Destination IP: {ip_dst}")
        print(f"Protocol: {protocol}")

        # Display payload data if present
        if Raw in packet:
            payload = packet[Raw].load
            print(f"Payload: {payload}")

        print("-" * 50)


# Start sniffing on the specified interface (e.g., "eth0" for Ethernet or "wlan0" for Wi-Fi)
# You might need root privileges to capture packets on some interfaces
interface = "eth0"  # Change this to your network interface
print(f"Starting packet sniffing on {interface}...")
sniff(iface=interface, prn=packet_callback, store=0)
