#ifndef TempProject_h
#define TempProject_h

#include <AdminSettingsService.h>
#include <ESP8266React.h>
#include <DHT.h>

#define DEFAULT_READ_FREQ 600
#define DEFAULT_TEMP_UNIT "celsius"
#define DEFAULT_DHT_PIN 2
#define DEFAULT_DHT_TYPE "dht22"

#define TEMP_SETTINGS_FILE "/config/tempSettings.json"
#define TEMP_SETTINGS_PATH "/rest/tempSettings"
#define TEMP_READ_SERVICE_PATH "/rest/readTemp"
#define TEMP_RESET_SERVICE_PATH "/rest/resetTemp"
#define TEMP_BUFFER_SIZE 256
#define TEMP_MAX_JSON_BUFFER_SIZE 20000

class TempSettings {
 public:
  uint readFreq; // Temp reading frequency (sec)
  String tempUnit; // Temp display unit
  uint8_t dhtPin; // DHT data pin port
  String dhtType; // DHT sensor type: dht11, dht22
};

class TempRead {
  public:
   unsigned long time;
   short temp; // temperature
   short hum; // humidity
};

class TempProject : public AdminSettingsService<TempSettings> {
 public:
  TempProject(AsyncWebServer* server, FS* fs, SecurityManager* securityManager);
  ~TempProject();
  void begin();

  void loop();

 private:
  DHT *_dhtsensor = NULL;

  unsigned long _lastReadTime = 0;
  TempRead _lastReadsBuf[TEMP_BUFFER_SIZE];
  boolean _bufferOverflow = false;
  unsigned short _nextWritePos = 0;

  bool _reconfigureService = false;

  void readTemperatures(AsyncWebServerRequest* request);
  void resetTemperatures(AsyncWebServerRequest* request);

 protected:
  void readFromJsonObject(JsonObject& root);
  void writeToJsonObject(JsonObject& root);
  void onConfigUpdated();
  void startDHTSensor();
};

#endif