const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://test.mosquitto.org')

client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      console.log('Subscribed to presence topic.');
    }
  });

  client.publish('client1/presence', 'Hello from client1/presence 1', {qos: 1});
  client.publish('client1/presence', 'Hello from client1/presence 2');
  client.publish('client1/presence', 'Hello from client1/presence 3');

})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic, message.toString());
  //client.end()
})
