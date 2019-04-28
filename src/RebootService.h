#ifndef RebootService_h
#define RebootService_h

#if defined(ESP8266)
  #include <ESP8266WiFi.h>
  #include <ESPAsyncTCP.h>
#elif defined(ESP_PLATFORM)
  #include <WiFi.h>
  #include <AsyncTCP.h>
#endif

#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <AsyncArduinoJson6.h>

#define MAX_REBOOT_SERVICE_SIZE 1024
#define REBOOT_SERVICE_PATH "/rest/rebootService"

class RebootService {

  public:

    RebootService(AsyncWebServer *server);

    void loop();

  private:

    AsyncWebServer* _server;
    bool _rebootRequested = false;

    void rebootService(AsyncWebServerRequest *request);

};

#endif // end RebootService_h