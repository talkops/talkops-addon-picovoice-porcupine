# TalkOps Addon: Picovoice Porcupine
![Docker Pulls](https://img.shields.io/docker/pulls/talkops/talkops-addon-picovoice-porcupine)

A TalkOps Addon made to work with [TalkOps](https://link.talkops.app/talkops).


## Installation Guide

Install [TalkOps](https://link.talkops.app/install-talkops).


## Integration Guide

Add the service and setup the environment variables if needed:

_compose.yml_
```
name: talkops

services:
...
  talkops-addon-picovoice-porcupine:
    image: talkops/talkops-addon-picovoice-porcupine
    environment:
      ACCESS_KEY: [your-value]
    volumes:
      - ./keywords:/data
    restart: unless-stopped
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
* Default value: `0.6`

#### AGENT_URLS

A comma-separated list of WebSocket server URLs for real-time communication with specified agents.
* Default value: `ws://talkops`
