function Peer({
  host, address, port,
}) {
  this.host = host;
  this.address = address;
  this.port = port;
}

Peer.prototype.getKey = function getKey() {
  return `${this.address}:${this.port}`;
};

Peer.prototype.toString = function toString() {
  const { host, address, port } = this;
  return !host || address === host
    ? `${address}:${port}`
    : `${host}[${address}]:${port}`;
};

module.exports = Peer;
