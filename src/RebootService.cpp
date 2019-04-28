#include <RebootService.h>

RebootService::RebootService(AsyncWebServer *server) : _server(server) {
  _server->on(REBOOT_SERVICE_PATH, HTTP_GET, std::bind(&RebootService::rebootService, this, std::placeholders::_1));
}

void RebootService::rebootService(AsyncWebServerRequest *request) {
  AsyncJsonResponse * response = new AsyncJsonResponse(MAX_REBOOT_SERVICE_SIZE);
  JsonObject root = response->getRoot();

  root["status"] = "ok";

  _rebootRequested = true;

  response->setLength();
  request->send(response);
}

void RebootService::loop() {
  if(_rebootRequested) {
    delay(100); // Wait for the response to be send
    ESP.restart();
  }
}
