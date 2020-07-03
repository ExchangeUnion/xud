import NodeList from '../../lib/p2p/NodeList';
import P2PRepository from '../../lib/p2p/P2PRepository';
import { ReputationEvent } from '../../lib/constants/enums';

jest.mock('../../lib/p2p/P2PRepository');
const mockedP2pRepo = <jest.Mock<P2PRepository>><any>P2PRepository;

describe('NodeList', () => {
  let nodeList: NodeList;
  const p2pRepo = new mockedP2pRepo();

  beforeEach(async () => {
    nodeList = new NodeList(p2pRepo);
  });

  afterEach(async () => {
    jest.clearAllMocks();
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
      const negativeReputationEvents = await nodeList['getNegativeReputationEvents'](nodeInstance, ReputationEvent.SwapDelay);
      expect(negativeReputationEvents).toEqual([ReputationEvent.SwapDelay, ReputationEvent.PacketTimeout, ReputationEvent.SwapFailure]);
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
      const negativeReputationEvents = await nodeList['getNegativeReputationEvents'](nodeInstance, ReputationEvent.SwapDelay);
      expect(negativeReputationEvents.length).toEqual(10);
    });
  });
});
