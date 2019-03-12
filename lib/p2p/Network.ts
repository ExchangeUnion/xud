import { XUNetwork, xuNetworkMagicVals } from '../constants/enums';

class Network {
  public magic: number;

  constructor(public xuNetwork: XUNetwork) {
    this.magic = xuNetworkMagicVals[xuNetwork];
  }
}

export default Network;
