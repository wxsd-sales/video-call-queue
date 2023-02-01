# Webex WebRTC Video Call Queue

**Create a fully customized WebRTC video call queue system.**

This is a proof-of-concept application that generates customized web application links to create a WebRTC video call queue system with two options: our built-in [Guest Demo](https://github.com/wxsd-sales/wxsd-guest-demo) or [Instant Connect](https://instant.webex.com/) solution.

<p align="center">
   <a href="https://app.vidcast.io/share/d5289588-9810-4e4a-9ea5-b85b61816cc3" target="_blank">
       <img src="static/readme/videoQueue.gif" alt="video-call-queue"/>
    </a>
</p>

</br >

# Table Of Contents

- [Overview](#overview)
- [High-Level Architecture](#high-level-architecture)
  - [Browser Meeting SDK](#browser-meeting-sdk)
  - [Instant Connect Solution](#instnat-connect-solution)
- [Setup](#setup)
- [Built With](#built-with)
- [Demo](#demo)
- [Support](#support)

<br />

# Overview

As you see in the figure above, there is a list of request for a responder to manage or setup a call with. In order for the responder to view any requests, they would need any requester to submit a request. Once a requester has submitted a request, responder will have few options to manage the request. responder could either cancel the request or accept and start a session with the requester. After the session had ended, both responder and the requester will be redirected to the initial view.

<br />

# High Level Architecture

This PoC has leveraged a few microservices behind the scene to provide a LIFO orderly queue system to manage requests and establish a WebRTC connections between the responder and requester.

## Browser Meeting SDK

### Requester Flow

Establishes a WebSocket connection to SoapBox to publish the request data and subscribe to queue & meeting management events.

### Responder Flow

<ol>
<li>Establishes a WebSocket connection to SoapBox to register queue related events</li>
<li>Sends HTTPs POST request to Mindy BOT</li>
<li>Mindy BOT Node Service
   <ol>
      <li> Creates two guest tokens</li>
      <li> Create an Space</li>
      <li> Adds the guests to the Space</li>
      <li> Sends a POST request to our <a href="https://github.com/wxsd-sales/wxsd-guest-demo" target="_blank" >Guest Demo</a> PoC</li>
   </ol>
</li>
<li> Guest Demo PoC publishes the meeting information back to the responder client</li>
<li> Responder Client initiates Browser Meeting SDK to register Meeting related events </li>
<li> Responder Client publishes queue <strong>pop</strong> & meeting related events back to requester client </li>
</li>
</ol>
<p align="center">
   <img src="static/SDK.jpg" alt="video-call-queue"/>
</p>

<br />

## Instant Connect Solution

### Requester Flow

Establishes a WebSocket connection to SoapBox to publish the request data and subscribe to queue & meeting management events.

### Responder Flow

<ol>
<li> Establishes a WebSocket connection to SoapBox to register queue related events</li>
<li> Sends HTTPs POST request Instant Connect</li>
<li> Receives IC meeting url to join </li>
<li> Responder Client initiates Browser Meeting SDK to register Meeting related events </li>
<li> Responder Client publishes queue <strong>pop</strong> & meeting related events back to requester client </li>
</li>
</ol>
<p align="center">
   <img src="static/IC.png" alt="video-call-queue"/>
</p>

<br />

# Setup

These instructions assume that you have:

- [Docker installed](https://docs.docker.com/engine/install/) and running on a Windows (via WSL2), macOS, or Linux machine.

Open a new terminal window and follow the instructions below to setup the project locally for development/demo.

1. Clone this repository and change directory:

   ```
   git clone https://github.com/wxsd-sales/video-queue && cd video-queue
   ```

2. Copy `.env.example` file as `.env`:

   ```
   cp .env.example .env
   ```

3. Review and follow to [Register your Integration on Webex](https://developer.webex.com/docs/integrations#registering-your-integration) guide.

   - Your registration must have the following [Webex REST API scopes](https://developer.webex.com/docs/integrations#scopes):
     | Scope | Description |
     |---------------------------|----------------------------------------------------------------------------------|
     | spark-admin:devices_read | See details for any device in your organization |
     | spark-admin:devices_write | Create, update and delete devices and device configurations in your organization |
     | spark:kms | Permission to interact with encrypted content |
   - Use these Redirect URIs:
     - `https://localhost/auth/webex/callback`
     - `http://localhost/auth/webex/callback`
   - Take note of your Client ID and Client Secret. Assign these values to the `WEBEX_AUTHORIZATION_CODE_CLIENT_ID`
     and `WEBEX_AUTHORIZATION_CODE_CLIENT_SECRET` environment variables within the `.env` file respectively.

4. Review and follow to [Register your Integration on Webex](https://developer.webex.com/docs/integrations#registering-your-integration) guide.

   - Your registration must have the following [Webex REST API scopes](https://developer.webex.com/docs/integrations#scopes):
     | Scope | Description |
     |-------------------------|-----------------------------------------------|
     | spark:people_read | Access to read your user's company directory |
     | spark:kms | Permission to interact with encrypted content |
   - Use this Redirect URI: `https://oauth-helper-a.wbx2.com/helperservice/v1/actions/device/callback`
   - Take note of your Client ID and Client Secret. Assign these values to the `WEBEX_DEVICE_CODE_CLIENT_ID`
     and `WEBEX_DEVICE_CODE_CLIENT_SECRET` environment variables within the `.env` file respectively.

5. Review and follow the [Creating a Webex Bot](https://developer.webex.com/docs/bots#creating-a-webex-bot) guide.
   Take note of your Bot ID and Bot access token. Assign these values to the `WEBEX_BOT_ID` and
   `WEBEX_BOT_TOKEN` environment variables within the `.env` file respectively.

6. Set other environment variables as needed in the `.env` file.

7. Start the application using:
   ```
   docker-compose up
   ```

Lastly, navigate to `http://localhost` in your browser and follow instructions.

<br />

# Built With

- [Webex Browser SDK](https://github.com/webex/webex-js-sdk)
- [Webex Instant Connect](https://instant.webex.com/)
- [SvelteJS](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org/)

<br />

# Trouble Shooting

In case of not receiving the request on the responder's view, the fastest approach to fix the issue would be to restart the `soapbox-redis` instance in lens platform. This would resolve the issue by clearing out the queue which might have been populated in an incorrect order.

<!-- CONTRIBUTING -->
<br />

# Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch in your forked repo (`git checkout -b myrepo/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin myrepo/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Please reach out to the WXSD team at [wxsd@external.cisco.com](mailto:wxsd@external.cisco.com?cc=ashessin@cisco.com&subject=Azure%20Group%20Sync).
