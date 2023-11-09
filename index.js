/* global module */
/* eslint no-undef: "error" */

// Plugin method that runs on plugin load
async function setupPlugin({ config }) {

}

async function makePostRequest(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Accept": "*/*",
      },
      body: JSON.stringify(data)
    });

    if (response.status === 200) {
      const responseData = await response.json();
      return responseData;
    } else {
      console.error("Request code " + response.status);
      throw new Error("Request failed with status code " + response.status);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error; 
  }
}



async function processEvent(event, { config, cache }) {

    const httpString = config.HTTP_HTTPS + "://"
    const hostUrl = config.HOST_URL;
    const path = '/conversation_emotions';

    const fullUrl = httpString + hostUrl + path;
    if (!event.properties) {
        event.properties = {};
    }

    if (!event.properties['$dialog']) {
        return event
    }

    var dialog = event.properties['$dialog']
    dialog = JSON.parse(dialog);
    const res = await makePostRequest(fullUrl, dialog);

    for (const key in res) {
        if (res[key] !== '') {
          event.properties[key] = res[key];
        }
    }
    return event;
}

// The plugin itself
module.exports = {
    setupPlugin,
    processEvent
}
