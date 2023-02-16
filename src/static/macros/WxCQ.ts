export const generateMacro = (videoLink: string, extensionNumber: number) =>
  `
/*********************************************************************
Copyright (c) 2022 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.
***********************************************************************
 * 
 * Author:              Harish Chawla
 *                    	Leader, Systems Engineering 
 *                    	hachawla@cisco.com
 *                    	Cisco Systems
 * 
 * Co-Author:           William Mills
 *                    	Technical Solutions Specialist 
 *                    	wimills@cisco.com
 *                    	Cisco Systems
 * 
 * Version: 1-0-0
 * Released: 02/08/23
 * 
 * This is a Webex Device Macro which displays a video while 
 * waiting in a Webex Calling call queue:
 * 
 * Features:
 * 1. Provides easily configurable & self creating speed dial buttons
 * 2. Supports multiple call queues & video content display
 * 3. Can auto hide/unhide Call control UI in and out of call
 * 
 * Requirements:
 * 1. Webex Device must be provisioned with a Webex Calling subscription
 * 2. A call queue must be setup on control hub and its number added to the macro
 * 3. Agents must be added to the call queue so the call can be answered
 * 
 * Full Readme and source code available on Github:
 * https://github.com/wxsd-sales/video-queue-macro
 * 
 ********************************************************/
import xapi from 'xapi';

/*********************************************************
 * Configure the settings below
**********************************************************/

const config = {
  buttons: [        // Array of buttons, will be auto added to the device
    {
      name: 'Call For Assistance',
      icon: 'Concierge',
      color: '#0000ff',
      target: '${extensionNumber}'
    }
    // Add your additional speed dial buttons here
  ],
  queues: [       // Array of queues to monitor and display commercials
    {
      title: 'Please wait 😊', // The title which is display when in modal mode
      number: '${extensionNumber}', // Number to monitor
      url: '${videoLink}',  // URL to display
      mode: 'Fullscreen',       // Fullscreen | Modal
      target: 'OSD'     // OSD | Controller
    }
    // Add your additional queue monitoring settings here
  ],
  hideUI: true, // true = hide out of call controls, false = show controls
  hideIncallUI: false,  // true = hide in call call controls, false = show controls
  panelId: 'call-queue',  // Our base Panel Id for all speed dial buttons
}


/*********************************************************
 * Below contains all macros functions
**********************************************************/

//Create our speed dial buttons
config.buttons.forEach((button, i) => createPanel(button, i))

// Subscribe to Events & Status changes
xapi.Event.UserInterface.Extensions.Panel.Clicked.on(processClicks)
xapi.Status.SystemUnit.State.NumberOfActiveCalls.on(processCallCount);
xapi.Status.Call.RemoteNumber.on(processRemoteNumber)

// Initially check the number of calls to set the UI config
xapi.Status.SystemUnit.State.NumberOfActiveCalls.get()
.then(r => processCallCount(r))

function processCallCount(event) {
  console.log('Number of calls: ' + event)
  if(event === Number('0')) {
    hideCommercial();
    setUIVisibility(!config.hideUI)
  } else {
    setUIVisibility(!config.hideIncallUI)
  }
}

function processRemoteNumber(event){
  console.log(\`Remote Number[\${ event }]\`)
  // Check if a monitoring number is present
  const match = config.queues.find(queue => event.startsWith(queue.number))
  // Ignore calls with not matched number
  if(!match) {
    console.log('No number matched');
    hideCommercial();
    return;
  }
  showCommercial(match)
}

function processClicks(event) {
  // Ignore all button presses which don't begin with our panelId
  if (!event.PanelId.startsWith(config.panelId)) return;
  // Get the panelId number and match to our button array.
  const index = event.PanelId.substr(config.panelId.length);
  console.log(\`Button[\${ config.buttons[index].name }]clicked\`)
  // Dial the target associated with button
  dial(config.buttons[index].target)
}

function showCommercial({title, url, mode, target }) {
  console.log(\`Opening Webview on[\${ target }]- Title: \${ title } | Mode: \${ mode } | Url: \${ url } \`)
  xapi.Command.UserInterface.WebView.Display(
    { Mode: mode, Target: target, Title: title, Url: url })
    .catch(e => console.log('Error opening webview: ' + e.message))
}

function hideCommercial() {
  console.log('Hiding Any Commercial')
  xapi.Command.UserInterface.WebView.Clear();
}

function setUIVisibility(state){
  console.log('Setting UI Visibility to: ' + state)
  xapi.Config.UserInterface.Features.HideAll.set(state ? 'False' : 'True');
}

function dial(number) {
  console.log(\`Dialing number[\${ number }]\`);
  xapi.Command.Dial({ Number: number })
  .catch(e=> console.log(\`Unable to dial[\${ number }]- Error: \${ e.message } \`))
}

function createPanel(button, i) {
  const panel = \`
    <Extensions>
      <Panel>
        <Type>Statusbar</Type>
        <Location>HomeScreen</Location>
        <Icon>\${button.icon}</Icon>
        <Color>\${button.color}</Color>
        <Name>\${button.name}</Name>
        <ActivityType>Custom</ActivityType>
      </Panel>
    </Extensions > \`

  xapi.Command.UserInterface.Extensions.Panel.Save(
    { PanelId: config.panelId + i },
    panel
  )
    .catch(e => console.log('Error saving panel: ' + e.message))
}
`;
