#ifndef TempProject_h
#define TempProject_h

#include <AdminSettingsService.h>
#include <ESP8266React.h>

#define DEFAULT_READ_FREQ 600
#define TEMP_SETTINGS_FILE "/config/tempSettings.json"
#define TEMP_SETTINGS_PATH "/rest/tempSettings"
#define TEMP_READ_SERVICE_PATH "/rest/readTemp"

class TempSettings {
 public:
  uint8_t readFreq; // Temp reading frequency (sec)
};

class TempProject : public AdminSettingsService<TempSettings> {
 public:
  TempProject(AsyncWebServer* server, FS* fs, SecurityManager* securityManager);
  ~TempProject();

  void loop();

 private:
  //unsigned long _lastBlink = 0;
  void readTemperatures(AsyncWebServerRequest* request);

 protected:
  void readFromJsonObject(JsonObject& root);
  void writeToJsonObject(JsonObject& root);
};

#endif