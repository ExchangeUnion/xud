/** Represents a list of hosts for managing network peers activity */
class Hosts {
  public init = (): void => {
    // TODO: implement (load from db)
  };

  public ban = (host: string): void => {
    // TODO: implement
    console.log('ban ' + host)
  };

  public isBanned = (host: string): boolean => {
    // TODO: implement
    console.log('isBanned: ' + host);
    return false;
  };
}

export default Hosts;