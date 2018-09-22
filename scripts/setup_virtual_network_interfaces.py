try:
    import re
    import netifaces
    import ipaddress
    import os
except:
    print("Please install netifaces and ipaddress")
    print("sudo apt-get install python-pip")
    print("python -m pip install netifaces")
    print("python -m pip install ipaddress")

# Keep this simple and don't support IPv6 for now.
def find_default_gateway():
    # address_families = [netifaces.AF_INET, netifaces.AF_INET6] IPv4 only for now
    address_families = [netifaces.AF_INET]
    gateways = netifaces.gateways()

    # No default gateway found.
    if "default" not in gateways:
        raise Exception("Internet not connected.")

    # Search list of default gateways that matches understood
    # list of valid address families.
    for gateway_by_af in gateways["default"]:
        for address_family in address_families:
            # Valid address family found.
            if address_family == gateway_by_af:
                # e.g. 2: ('ip', 'interface name')
                return gateways["default"][gateway_by_af]

    raise Exception("Unknown exception finding default interface.")

def config_virtual_interfaces(physical_iface_name, virtual_iface_no):
    addr = netifaces.ifaddresses(physical_iface_name)[netifaces.AF_INET][0]
    static_ip = addr["addr"]
    netmask = addr["netmask"]
    broadcast = addr["broadcast"]
    broadcast2 = ".".join(static_ip.split(".")[0:2]) + ".255"
    vif = ""
    for i in range(1, virtual_iface_no + 1):
        vip = str(ipaddress.IPv4Address(static_ip) + i)
        if i < virtual_iface_no:
            nl = "\n"
        else:
            nl = ""
        line = "    up ip addr add %s brd %s dev " % (vip, broadcast)
        line += "%s label %s:%s%s" % (physical_iface_name, physical_iface_name, str(i), nl)
        vif += line

    return vif

def build_network_interface_file(physical_iface_name, gateway_address, virtual_iface_config):
    addr = netifaces.ifaddresses(physical_iface_name)[netifaces.AF_INET][0]
    static_ip = addr["addr"]
    netmask = addr["netmask"]
    broadcast = addr["broadcast"]
    broadcast2 = ".".join(static_ip.split(".")[0:2]) + ".255"

    interface_file = """    # The loopback network interface
    auto lo
    iface lo inet loopback

    # The primary network interface
    auto %s
    iface %s inet static
        label %s
        address %s
        netmask %s
        broadcast %s
        gateway %s
        dns-servers 8.8.4.4 8.8.8.8
        dns-nameservers 8.8.4.4 8.8.8.8

    # Virtual interface config
%s
    """ % (physical_iface_name, physical_iface_name, physical_iface_name, \
           static_ip, netmask, broadcast2, gateway_address, virtual_iface_config)

    return interface_file

def replace_network_interface_file(new_contents):
    with open("/etc/network/interfaces", 'w') as fp:
        fp.truncate()
        fp.write(new_contents)
        fp.close()

def restart_network_interfaces(physical_iface_name):
    os.system("ifconfig lo up")
    os.system("ip addr flush dev %s" % (physical_iface_name))
    os.system("ifdown %s && ifup -v %s" % (physical_iface_name, physical_iface_name))    

def setup_virtual_network_interfaces():
    # Root is needed to change interface file.
    if os.geteuid() != 0:
        print("Error: please re-run script as root.")
        return

    # Find iface name.
    default_gateway = find_default_interface()
    physical_iface_name = default_gateway[1]
    gateway_address = default_gateway[0]
    
    # Prompt for virtual iface no to configure.
    virtual_iface_no = int(raw_input("Number of virtual interfaces to configure = "))
    
    # Build new config file.
    virtual_iface_config = config_virtual_interfaces(physical_iface_name, virtual_iface_no)
    iface_file = build_network_interface_file(physical_iface_name, gateway_address, virtual_iface_config)

    # Write the changes.
    replace_network_interface_file(iface_file)

    # Use new config file.
    restart_network_interfaces(physical_iface_name)

    print("")
    print("Virtual interfaces should now be up.")
    print("Type ifconfig to see them listed at their new IP addresses.")

setup_virtual_network_interfaces()