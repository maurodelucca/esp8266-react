#include <TempProject.h>

TempProject::TempProject(AsyncWebServer* server, FS* fs, SecurityManager* securityManager) :
    AdminSettingsService(server, fs, securityManager, TEMP_SETTINGS_PATH, TEMP_SETTINGS_FILE) {
      server->on(TEMP_READ_SERVICE_PATH,
             HTTP_GET,
             securityManager->wrapRequest(std::bind(&TempProject::readTemperatures, this, std::placeholders::_1),
                                          AuthenticationPredicates::NONE_REQUIRED));
}

TempProject::~TempProject() {
}

void TempProject::readTemperatures(AsyncWebServerRequest* request) {
  AsyncJsonResponse* response = new AsyncJsonResponse();
  JsonObject root = response->getRoot();
  JsonArray tempReads = root.createNestedArray("reads");
  for (int i = 0; i < 10; i++) {
    JsonObject tempRead = tempReads.createNestedObject();
    tempRead["time"] = 1584816212 + i;
    tempRead["temp"] = 30 + i;
  }

  response->setLength();
  request->send(response);
}

void TempProject::loop() {
}

void TempProject::readFromJsonObject(JsonObject& root) {
  _settings.readFreq = root["read_frequency"] | DEFAULT_READ_FREQ;
}

void TempProject::writeToJsonObject(JsonObject& root) {
  // connection settings
  root["read_frequency"] = _settings.readFreq;
}
