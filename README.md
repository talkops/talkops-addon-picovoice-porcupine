# TalkOps Addon: Picovoice Porcupine
![Docker Pulls](https://img.shields.io/docker/pulls/talkops/talkops-addon-picovoice-porcupine)

A TalkOps Addon made to work with [TalkOps](https://link.talkops.app/talkops).

This Addon based on [Picovoice Porcupine](https://picovoice.ai/platform/porcupine/) allows the agent to be activated by a custom keyword without requiring continuous listening. It runs efficiently on-device, ensuring privacy and low latency, making it ideal for hands-free voice interaction.

## Installation Guide

_[TalkOps](https://link.talkops.app/install-talkops) must be installed beforehand._

* Generate and download your keywords from the [Picovoice Console](https://console.picovoice.ai).
* Place the `keywords` directory inside the `data` volume.

## Integration Guide

Add the service and setup the environment variables if needed:

_compose.yml_
``` yml
name: talkops

services:
...
  talkops-addon-picovoice-porcupine:
    image: talkops/talkops-addon-picovoice-porcupine
    environment:
      ACCESS_KEY: [your-value]
    volumes:
      - talkops-addon-picovoice-porcupine_data:/data
    restart: unless-stopped

volumes:
...
  talkops-addon-picovoice-porcupine_data: ~

```

## Environment Variables

#### ACCESS_KEY

The access key provided by Picovoice. Sign up at [Picovoice Console](https://console.picovoice.ai/signup) to obtain your access key.

#### LANGUAGE

The language of keywords.
* Default value: `English`
* Available values: `Arabic` `Chinese` `Dutch` `English` `French` `German` `Hindi` `Italian` `Japanese` `Korean` `Persian` `Polish` `Portuguese` `Russian` `Spanish` `Swedish` `Vietnamese`

#### SENSITIVITY

The sensitivity between 0 and 1. A higher sensitivity reduces miss rate at cost of increased false alarm rate.
* Default value: `0.7`

#### AGENT_URLS

A comma-separated list of WebSocket server URLs for real-time communication with specified agents.
* Default value: `ws://talkops`
* Possible values: `ws://talkops1` `ws://talkops2`
