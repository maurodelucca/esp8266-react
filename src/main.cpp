#include <TempProject.h>
#include <ESP8266React.h>
#include <FS.h>

#define SERIAL_BAUD_RATE 115200

AsyncWebServer server(80);
ESP8266React esp8266React(&server, &SPIFFS);
TempProject tempProject = TempProject(&server, &SPIFFS, esp8266React.getSecurityManager());

void setup() {
  // start serial and filesystem
  Serial.begin(SERIAL_BAUD_RATE);

  // start the file system (must be done before starting the framework)
#ifdef ESP32
  SPIFFS.begin(true);
#elif defined(ESP8266)
  SPIFFS.begin();
#endif

  // start the framework
  esp8266React.begin();

  // start the temp project
  tempProject.begin();

  // start the server
  server.begin();
}

void loop() {
  // run the framework's loop function
  esp8266React.loop();

  // run the temp project's loop function
  tempProject.loop();
}
