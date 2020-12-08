import { ReputationEvent } from '../../lib/constants/enums';
import NodeList from '../../lib/p2p/NodeList';
import P2PRepository from '../../lib/p2p/P2PRepository';
import { NodeConnectionInfo } from '../../lib/p2p/types';

const nodePubKey = '028599d05b18c0c3f8028915a17d603416f7276c822b6b2d20e71a3502bd0f9e0a';
const nodeConnectionInfo: NodeConnectionInfo = {
  nodePubKey,
  addresses: [],
};

jest.mock('../../lib/p2p/P2PRepository');
const mockedP2pRepo = <jest.Mock<P2PRepository>>(<any>P2PRepository);

describe('NodeList', () => {
  let nodeList: NodeList;
  const p2pRepo = new mockedP2pRepo();

  beforeEach(async () => {
    nodeList = new NodeList(p2pRepo);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  test('it should ban and unban a node', async () => {
    const nodeId = 1;
    const save = jest.fn();
    p2pRepo.addNodeIfNotExists = jest.fn().mockImplementation(() => {
      return {
        save,
        nodePubKey,
        id: nodeId,
      };
    });
    p2pRepo.addReputationEvent = jest.fn();
    p2pRepo.getReputationEvents = jest.fn().mockImplementation(() => []);

    await nodeList.createNode(nodeConnectionInfo);

    await nodeList.ban(nodePubKey);
    expect(nodeList.get(nodePubKey)!.banned).toEqual(true);
    expect(p2pRepo.addReputationEvent).toBeCalledTimes(1);
    expect(save).toBeCalledTimes(1);
    expect(p2pRepo.addReputationEvent).toBeCalledWith({
      nodeId,
      event: ReputationEvent.ManualBan,
    });

    await nodeList.unBan(nodePubKey);
    expect(nodeList.get(nodePubKey)!.banned).toEqual(false);
    expect(p2pRepo.addReputationEvent).toBeCalledTimes(2);
    expect(save).toBeCalledTimes(2);
    expect(p2pRepo.addReputationEvent).toBeCalledWith({
      nodeId,
      event: ReputationEvent.ManualUnban,
    });
  });

  describe('getNegativeReputationEvents', () => {
    const nodeInstance = { id: 1 } as any;

    test('it should return an empty array when there are no events', async () => {
      p2pRepo.getReputationEvents = jest.fn().mockImplementation(() => []);
      const negativeReputationEvents = await nodeList['getNegativeReputationEvents'](nodeInstance);
      expect(negativeReputationEvents.length).toEqual(0);
    });

    test('it should only return negative events', async () => {
      p2pRepo.getReputationEvents = jest.fn().mockImplementation(() => [
        { event: ReputationEvent.PacketTimeout, nodeId: 1 },
        { event: ReputationEvent.SwapSuccess, nodeId: 1 },
        { event: ReputationEvent.SwapFailure, nodeId: 1 },
      ]);
      const negativeReputationEvents = await nodeList['getNegativeReputationEvents'](nodeInstance);
      expect(negativeReputationEvents).toEqual([ReputationEvent.PacketTimeout, ReputationEvent.SwapFailure]);
    });

    test('it should append a new event to the beginning of the array', async () => {
      p2pRepo.getReputationEvents = jest.fn().mockImplementation(() => [
        { event: ReputationEvent.PacketTimeout, nodeId: 1 },
        { event: ReputationEvent.SwapFailure, nodeId: 1 },
      ]);
      const negativeReputationEvents = await nodeList['getNegativeReputationEvents'](
        nodeInstance,
        ReputationEvent.SwapDelay,
      );
      expect(negativeReputationEvents).toEqual([
        ReputationEvent.SwapDelay,
        ReputationEvent.PacketTimeout,
        ReputationEvent.SwapFailure,
      ]);
    });

    test('it should return no more than 10 events', async () => {
      p2pRepo.getReputationEvents = jest.fn().mockImplementation(() => [
        { event: ReputationEvent.PacketTimeout, nodeId: 1 },
        { event: ReputationEvent.SwapFailure, nodeId: 1 },
        { event: ReputationEvent.PacketTimeout, nodeId: 1 },
        { event: ReputationEvent.SwapFailure, nodeId: 1 },
        { event: ReputationEvent.PacketTimeout, nodeId: 1 },
        { event: ReputationEvent.SwapFailure, nodeId: 1 },
        { event: ReputationEvent.PacketTimeout, nodeId: 1 },
        { event: ReputationEvent.SwapFailure, nodeId: 1 },
        { event: ReputationEvent.PacketTimeout, nodeId: 1 },
        { event: ReputationEvent.SwapFailure, nodeId: 1 },
        { event: ReputationEvent.PacketTimeout, nodeId: 1 },
        { event: ReputationEvent.SwapFailure, nodeId: 1 },
      ]);
      const negativeReputationEvents = await nodeList['getNegativeReputationEvents'](
        nodeInstance,
        ReputationEvent.SwapDelay,
      );
      expect(negativeReputationEvents.length).toEqual(10);
    });
  });
});
