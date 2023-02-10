<script lang="ts">
  import Prism from 'prismjs';

  let code = `
    /**
 * A single button to quick dial a kiosk queue created in Webex Calling
 * Notes: 
 * (1) Device must be provisioned with a Webex Calling subscription
 * (2) A queue and associated agents must be configured in Webex Calling
 */

import xapi from 'xapi';

let destination = null; 
let current_callback_num = null;
let current_call_state = null;
let connected_dept = null;
let is_commercial_playing = false;

//"Call for assistance" button configuration
const support_button = \`
  <Extensions>
    <Version>1.9</Version>
    <Panel>
      <Order>1</Order>
      <Location>HomeScreen</Location>
      <Origin>local</Origin>
      <Visibility>Auto</Visibility>
      <Icon>Concierge</Icon>
      <Color>#0000ff</Color>
      <Name>Call for assistance</Name>
      <ActivityType>Custom</ActivityType>
    </Panel>
  </Extensions>\`;

//Function to implement "Call for assistance" button
function createVCQButton() {
  xapi.Command.UserInterface.Extensions.Panel.Save(
    { PanelId: 'wxsd_demo' }, 
    support_button
  )
}

const commercials = {
  wxsd_demo: 'https://socketeer.glitch.me/kiosk-voh.html',
  //mortgage: '',
  //insurance: '',
  //healthcare:'',
}
// These current match the button (panel) ids of the UI Extensions buttons - only 1 is active
const queues = {
  wxsd_demo: '1111',
  //mortage: '1112',
  //insurace: 'tbd',
  //healthcare: 'tbd'
};

function dial(number) {
  console.log(\`Dialing \${number}\`);
  xapi.Command.Dial({ Number: number });
}


function listenToGui() {
  xapi.Event.UserInterface.Extensions.Panel.Clicked.on((event) => {
      destination = queues[event.PanelId];
      connected_dept = event.PanelId;
      if (destination) {
        dial(destination);
      }
  });
}

xapi.Status.Call.AnswerState.on((event) => {
      console.log(\`test-tag: Callstate event - \${event}\`);
      current_call_state = JSON.stringify(event);
      console.log(\`test-tag2: \${current_callback_num} has \${current_call_state} + destination was \${destination}\`);
      if(current_callback_num && current_callback_num.includes(destination) && current_call_state.includes("Answered")){
        console.log(\`test-tag3: Should I play \${connected_dept} sincs its - \${current_call_state}?\`);
        showCommercial(connected_dept);
      }
  });

xapi.Status.Call.CallbackNumber.on((data) => {
  //xapi.Event.UserInterface.Extensions.Panel.Clicked.on((event) => {
      let connected_to = data;
      current_callback_num = data;
      console.log(\`test-tag: Callback num event - \${connected_to} and destination is \${destination}\`);
      if (connected_to.includes(destination) && is_commercial_playing == false){
        console.log(\`test-tag3: commercial should be playing for \${connected_dept}\`);
        showCommercial(connected_dept);
      } else if (connected_to.includes(destination) && is_commercial_playing == true) {
        console.log("Nothing to do");
        //hideCommercial();
      } else {
        console.log("Killing Commercial");
        hideCommercial();
      }  
  });

//not in use - future feature
function showCommercial(target){
  is_commercial_playing = true;
  let my_url = commercials[target];
  console.log(\`test-tag3: Let's show a commercial from \${JSON.stringify(my_url)}\`);
        xapi.Command.UserInterface.WebView.Display({
          Target: 'OSD',
          Url: commercials[target],
          Title: "Please hold while we connect you to an expert...",
          Mode: 'FullScreen'
        });
}

function hideCommercial(){
  xapi.Command.UserInterface.WebView.Clear();
  is_commercial_playing = false;
}

function listenForCallEvents() {
  xapi.Status.Call.on((event) => {
  //xapi.Event.UserInterface.Extensions.Panel.Clicked.on((event) => {
      console.log(\`Call event - \${JSON.stringify(event)}\`);
      if(event.Status == 'Disconnecting' || event.ghost){
        hideCommercial();
      }
  });
}

function get_current_call_state(){

}

createVCQButton();
listenToGui();
listenForCallEvents();



  
  
  `;

  export let language: string;
</script>

<svelte:head>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/themes/prism.min.css" rel="stylesheet" />
</svelte:head>

<div class="code">
  {@html Prism.highlight(code, Prism.languages[language])}
</div>

<style>
  .code {
    white-space: pre-wrap;
  }
</style>
