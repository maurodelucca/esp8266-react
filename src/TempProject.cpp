#include <TempProject.h>
#include <time.h>

TempProject::TempProject(AsyncWebServer* server, FS* fs, SecurityManager* securityManager) :
    AdminSettingsService(server, fs, securityManager, TEMP_SETTINGS_PATH, TEMP_SETTINGS_FILE) {
  server->on(TEMP_READ_SERVICE_PATH,
          HTTP_GET,
          securityManager->wrapRequest(std::bind(&TempProject::readTemperatures, this, std::placeholders::_1),
                                      AuthenticationPredicates::IS_AUTHENTICATED));
  server->on(TEMP_RESET_SERVICE_PATH,
          HTTP_POST,
          securityManager->wrapRequest(std::bind(&TempProject::resetTemperatures, this, std::placeholders::_1),
                                      AuthenticationPredicates::IS_AUTHENTICATED));
}

TempProject::~TempProject() {
  if(_dhtsensor != NULL) {
    delete _dhtsensor;
  }
}

void TempProject::begin() {
  AdminSettingsService::begin();

  startDHTSensor();
}

void TempProject::startDHTSensor() {
  if(_dhtsensor != NULL) {
    delete _dhtsensor;
    _dhtsensor = NULL;
  }

  if(_settings.dhtType == "dht11") {
    _dhtsensor = new DHT(_settings.dhtPin, DHT11);
  } else if(_settings.dhtType == "dht12") {
    _dhtsensor = new DHT(_settings.dhtPin, DHT12);
  } else if(_settings.dhtType == "dht21") {
    _dhtsensor = new DHT(_settings.dhtPin, DHT21);
  } else if(_settings.dhtType == "dht22") {
    _dhtsensor = new DHT(_settings.dhtPin, DHT22);
  } else if(_settings.dhtType == "am2301") {
    _dhtsensor = new DHT(_settings.dhtPin, DHT22);
  } else {
    return;
  }

  _dhtsensor->begin();
}

void TempProject::readTemperatures(AsyncWebServerRequest* request) {
  AsyncJsonResponse* response = new AsyncJsonResponse(false, TEMP_MAX_JSON_BUFFER_SIZE);
  JsonObject root = response->getRoot();
  JsonArray tempReads = root.createNestedArray("reads");

  if(_bufferOverflow) {
    for (int i = _nextWritePos; i < TEMP_BUFFER_SIZE; i++) {
      JsonObject tempRead = tempReads.createNestedObject();
      tempRead["time"] = _lastReadsBuf[i].time;
      tempRead["temp"] = _lastReadsBuf[i].temp;
      tempRead["hum"] = _lastReadsBuf[i].hum;
    }
  }

  for (int i = 0; i < _nextWritePos; i++) {
    JsonObject tempRead = tempReads.createNestedObject();
    tempRead["time"] = _lastReadsBuf[i].time;
    tempRead["temp"] = _lastReadsBuf[i].temp;
    tempRead["hum"] = _lastReadsBuf[i].hum;
  }

  root["temp_unit"] = _settings.tempUnit;

  response->setLength();
  request->send(response);
}

void TempProject::resetTemperatures(AsyncWebServerRequest* request) {
  _bufferOverflow = false;
  _nextWritePos = 0;

  request->send(202);
}

void TempProject::loop() {
  if(_reconfigureService) {
    _reconfigureService = false;
    startDHTSensor();
  }

  if(_dhtsensor != NULL) {
    unsigned long currentMillis = millis();
    if (!_lastReadTime || (unsigned long)(currentMillis - _lastReadTime) >= (unsigned long)_settings.readFreq * 1000) {
      _lastReadTime = currentMillis;

      float t = _dhtsensor->readTemperature();
      float h = _dhtsensor->readHumidity();

      if (isnan(h) || isnan(t)) {
        Serial.println(F("Failed to read from DHT sensor!"));
        return;
      }

      TempRead newRead;
      newRead.time = time(nullptr);
      newRead.temp = (short)(t * 10);
      newRead.hum = (short)(h * 10);

      _lastReadsBuf[_nextWritePos] = newRead;

      _nextWritePos += 1;
      if(_nextWritePos == TEMP_BUFFER_SIZE) {
        _nextWritePos = 0;
        _bufferOverflow = true;
      }
    }
  }
}

void TempProject::readFromJsonObject(JsonObject& root) {
  _settings.readFreq = root.containsKey("read_frequency") ? root["read_frequency"].as<uint>() : DEFAULT_READ_FREQ;
  _settings.dhtPin = root.containsKey("dht_pin") ? root["dht_pin"].as<uint8_t>() : DEFAULT_DHT_PIN;
  _settings.dhtType = root.containsKey("dht_type") ? root["dht_type"].as<String>() : DEFAULT_DHT_TYPE;
  _settings.tempUnit = root.containsKey("temp_unit") ? root["temp_unit"].as<String>() : DEFAULT_TEMP_UNIT;
}

void TempProject::writeToJsonObject(JsonObject& root) {
  root["read_frequency"] = _settings.readFreq;
  root["dht_pin"] = _settings.dhtPin;
  root["dht_type"] = _settings.dhtType;
  root["temp_unit"] = _settings.tempUnit;
}

void TempProject::onConfigUpdated() {
  _reconfigureService = true;
}
