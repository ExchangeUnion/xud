import { XuNetwork, xuNetworkMagicVals } from '../constants/enums';

class Network {
  public magic: number;

  constructor(public xuNetwork: XuNetwork) {
    this.magic = xuNetworkMagicVals[xuNetwork];
  }
}

export default Network;
