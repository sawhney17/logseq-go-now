import '@logseq/libs';
import { BlockEntity, SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';
import 'logseq-dateutils'
import { getDateForPageWithoutBrackets } from 'logseq-dateutils';

const settings: SettingSchemaDesc[] = [{
  key: 'keyboardShortcut',
  title: "Keyboard shortcut",
  description: 'Keyboard shortcut to trigger going home',
  type: 'string',
  default: 'mod+g',
}]
const main = async () => {
  logseq.useSettingsSchema(settings);
  logseq.App.registerCommandPalette({
    key: 'Go home now!',
    label: 'Go to todays journal, append a new block and scroll to it',
    keybinding: { binding: logseq.settings?.keyboardShortcut },
  }, async () => {
    const dateFormat = (await logseq.App.getUserConfigs()).preferredDateFormat
    const date = getDateForPageWithoutBrackets(new Date(), dateFormat);
    const homepage: BlockEntity[] = (await logseq.Editor.getPageBlocksTree(date))
    const lastItem: BlockEntity = homepage[homepage.length - 1]
    if (lastItem.content == '') {
      
      logseq.Editor.scrollToBlockInPage(date, lastItem.uuid);
    }
    else {
      const block = await logseq.Editor.appendBlockInPage(date, "");
      logseq.Editor.scrollToBlockInPage(date, block.uuid);

    }
  }
  )

}

logseq.ready(main).catch(console.error);