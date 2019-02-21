const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://test.mosquitto.org')

client.on('connect', function () {
  client.publish('presence', 'Hello mqtt');
  client.publish('presence', 'Hello mqtt 1');
  client.publish('presence', 'Hello mqtt 2');
  client.subscribe({'client1/presence':{qos: 1}}, function (err) {
    if (!err) {
      console.log('Subscribed to client1/presence topic.');
    }
  });
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic, message.toString())
  client.end()
})
