import '@logseq/libs';
import 'logseq-dateutils'
import { getDateForPageWithoutBrackets } from 'logseq-dateutils';
const main = async () => {

  logseq.App.registerCommandPalette({
    key: 'Go home now!',
    label: 'Go to todays journal, append a new block and scroll to it',
    keybinding: {binding: "mod+g"},
  }, async () => {
    const dateFormat = (await logseq.App.getUserConfigs()).preferredDateFormat
    const date = getDateForPageWithoutBrackets(new Date(), dateFormat);
    const block = await logseq.Editor.appendBlockInPage(date, "");
    logseq.Editor.scrollToBlockInPage(date, block.uuid);
  }
  )

}

logseq.ready(main).catch(console.error);
