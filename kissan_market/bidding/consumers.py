import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

class BidConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("WebSocket connecting...", self.scope['url_route']['kwargs'])
        try:
            self.veg_id = self.scope['url_route']['kwargs']['veg_id']
            self.room_group_name = f"bid_{self.veg_id}"

            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()
            print("WebSocket connected.")
        except Exception as e:
            print("WebSocket connect error:", e)


    async def disconnect(self, close_code):
        print("WS Disconnected:", close_code)
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WS client (optional; we broadcast from server side)
    async def receive(self, text_data):
        # You can forward client messages if needed; not required for server broadcast flow.
        pass

    # Handler for messages sent to the group
    async def broadcast_bid(self, event):
        # event['payload'] expected to be a dict with keys we want to send
        await self.send(text_data=json.dumps(event['payload']))
