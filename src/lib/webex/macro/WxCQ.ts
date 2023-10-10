import macroTemplate from '$lib/static/sip-macro-template.txt?raw'

export const generateMacro = (queues) => {
  let queuesSTR = '';

  for (const { extensionNumber, videoLink } of queues)
    queuesSTR = queuesSTR.concat(`
       {
          title: 'Please wait 😊', // The title which is display when in modal mode
          number: '${extensionNumber}', // Number to monitor
          url: '${videoLink}',  // URL to display
          mode: 'Fullscreen',       // Fullscreen | Modal
          target: 'OSD'     // OSD | Controller
        },`);

  queuesSTR = queuesSTR.slice(0, -1);

  return macroTemplate.replace('${queues}', queuesSTR);
};
