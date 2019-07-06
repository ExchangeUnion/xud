import * as pb from '../../proto/xudp2p_pb';
import { removeUndefinedProps, convertKvpArrayToKvps, setObjectToMap } from '../../utils/utils';
import { NodeState } from '../types';

export const validateNodeState = (nodeState?: pb.NodeState.AsObject) => {
  // TODO: validate that pairsList does not contain duplicates
  return !!(nodeState
    && nodeState.pairsList
    && nodeState.lndPubKeysMap
    && nodeState.tokenIdentifiersMap
    && nodeState.addressesList.every(addr => !!addr.host)
  );
};

export const convertNodeState = (nodeState: pb.NodeState.AsObject) => {
  return removeUndefinedProps({
    pairs: nodeState.pairsList,
    addresses: nodeState.addressesList,
    raidenAddress: nodeState.raidenAddress,
    lndPubKeys: convertKvpArrayToKvps(nodeState.lndPubKeysMap),
    tokenIdentifiers: convertKvpArrayToKvps(nodeState.tokenIdentifiersMap),
  });
};

export const serializeNodeState = (nodeState: NodeState): pb.NodeState => {
  const pbNodeState = new pb.NodeState();
  pbNodeState.setPairsList(nodeState.pairs);
  pbNodeState.setAddressesList(nodeState.addresses.map((addr) => {
    const pbAddr = new pb.Address();
    pbAddr.setHost(addr.host);
    pbAddr.setPort(addr.port);
    return pbAddr;
  }));
  pbNodeState.setRaidenAddress(nodeState.raidenAddress);
  if (nodeState.lndPubKeys) {
    setObjectToMap(nodeState.lndPubKeys, pbNodeState.getLndPubKeysMap());
  }
  if (nodeState.tokenIdentifiers) {
    setObjectToMap(nodeState.tokenIdentifiers, pbNodeState.getTokenIdentifiersMap());
  }
  return pbNodeState;
};
