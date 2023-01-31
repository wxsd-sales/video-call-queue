# Video Call Queue

**An app for Demoing Webex meeting capabilities.**

This is a proof-of-concept application that generates customized web application links to create a video call queue system backed by Webex Engine with two options: our built-in [Guest Demo](https://github.com/wxsd-sales/wxsd-guest-demo) or [Instant Connect](https://instant.webex.com/) solution.

<p align="center">
   <a href="https://app.vidcast.io/share/bb910329-f398-4f04-baec-18ddaf46f493" target="_blank">
       <img src="static/readme/videoQueue.gif" alt="roomos-device-widgets"/>
    </a>
</p>

## Overview

As you see in the figure above, there is a list of request for a responder to manage or setup a call with. In order for the responder to view any requests, they would need any requester to submit a request. Once a requester has submitted a request, responder will have few options to manage the request. responder could either cancel the request or accept and start a session with the requester. After the session had ended, both responder and the requester will be redirected to the initial view.

### Built With

- [Webex Browser SDK](https://github.com/webex/webex-js-sdk)
- [SvelteJS](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org/)

<!-- GETTING STARTED -->

## Getting Started

If you would like to contribute to our source code and to improve our demo, please follow the steps mentioned below:

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/wxsd-sales/call-queue.git
   ```
2. We use NVM to manage our node.js machine versioning. You can learn more about NVM [here](https://github.com/nvm-sh/nvm)
   ```sh
   nvm use
   ```
3. Install the packages via [Yarn](https://classic.yarnpkg.com/en/)
   ```sh
   npm i
   ```
4. Start the server
   ```sh
   npm start
   ```

### Trouble Shooting

In case of not receiving the request on the responder's view, the fastest approach to fix the issue would be to restart the `soapbox-redis` instance in lens platform. This would resolve the issue by clearing out the queue which might have been populated in an incorrect order.

<!-- CONTRIBUTING -->

## Contributing

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

Please reach out to the WXSD team at [wxsd@external.cisco.com](mailto:wxsd@external.cisco.com?cc=ashessin@cisco.com&subject=Azure%20Group%20Sync) or contact me on Webex (akoushke@cisco.com).
