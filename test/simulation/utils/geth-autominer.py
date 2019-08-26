from web3 import Web3
import asyncio
import sys

if len(sys.argv) > 1:
    geth_ipc = sys.argv[1]
else:
    raise Exception("Expecting a path to geth.ipc as argument.")
provider = Web3.IPCProvider(geth_ipc)
w3 = Web3(provider)
connected = w3.isConnected()
if not connected:
    raise Exception("Could not connect to geth.")

def handle_event(event):
    if len(w3.eth.getBlock("pending").transactions) > 0:
        print("Pending transactions exist... mining 100 blocks.")
        w3.geth.miner.start(100)

async def log_loop(event_filter, poll_interval):
    while True:
        for event in event_filter.get_new_entries():
            handle_event(event)
        await asyncio.sleep(poll_interval)

def watch_for_unconfirmed():
    block_filter = w3.eth.filter('latest')
    tx_filter = w3.eth.filter('pending')
    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(
            asyncio.gather(
                log_loop(block_filter, 2),
                log_loop(tx_filter, 2)))
    finally:
        loop.close()

if len(sys.argv) > 2:
    blocks_to_generate = int(sys.argv[2])
    print("Generating", blocks_to_generate, "blocks.")
    w3.geth.miner.start(blocks_to_generate)
else:
    print("Automatically mining unconfirmed transactions.")
    watch_for_unconfirmed()
