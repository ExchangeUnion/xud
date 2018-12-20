import { NodeState } from '../../../types/p2p';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';

export const createPbNodeState = (nodeState: NodeState): pb.NodeState => {
  const pbNodeState = new pb.NodeState();
  pbNodeState.setVersion(nodeState.version);
  pbNodeState.setNodepubkey(nodeState.nodePubKey);
  pbNodeState.setPairsList(nodeState.pairs);
  pbNodeState.setAddressesList(nodeState.addresses!.map((addr) => {
    const pbAddr = new pb.Address();
    pbAddr.setHost(addr.host);
    pbAddr.setPort(addr.port);
    return pbAddr;
  }));
  pbNodeState.setRaidenaddress(nodeState.raidenAddress!);
  pbNodeState.setLndbtcpubkey(nodeState.lndbtcPubKey!);
  pbNodeState.setLndltcpubkey(nodeState.lndltcPubKey!);

  return pbNodeState;
};

export const validatePbNodeStateObj = (obj: pb.NodeState.AsObject | undefined): boolean => {
  return !!(obj
    && obj.nodepubkey
    && obj.pairsList
    && obj.addressesList.filter(addr => addr.host).length === obj.addressesList.length
  );
};

export const convertNodeState = (obj: pb.NodeState.AsObject): NodeState => {
  return removeUndefinedProps({
    version: obj.version,
    nodePubKey: obj.nodepubkey,
    pairs: obj.pairsList,
    addresses: obj.addressesList,
    raidenAddress: obj.raidenaddress || undefined,
    lndbtcPubKey: obj.lndbtcpubkey || undefined,
    lndltcPubKey: obj.lndltcpubkey || undefined,
  });
};
