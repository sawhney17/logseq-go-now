import '@logseq/libs';
import { BlockEntity, SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';
import SimpleDateFormat from 'simple_dt.js';

const settings: SettingSchemaDesc[] = [
  {
    key: "keyboardShortcut",
    title: "Keyboard shortcut",
    description: "Keyboard shortcut to trigger going home",
    type: "string",
    default: "mod+g",
  },
  {
    key: "enterEditingMode",
    title: "Scroll to or enter editing mode for block?",
    description:
      "When you click the shortcut, should the ball enter editing mode or not?",
    type: "enum",
    default: "scroll",
    enumChoices: ["scroll", "enter"],
    enumPicker: "radio",
  },
  {
    key: "customTimeout",
    title: "Custom timeout",
    description: "Custom timeout entering the editing mode, if you notice excess lag, reduce this number, if you notice entering edit mode isn't working properly, increase this number",
    type: "number",
    default: 300,
  },
];

const triggerEnter = () => {
  setTimeout(() => {
    //Trigger the enter key on the keyboard
    top?.window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "enter",
      })
    );
    console.log("enter key pressed");
  }, logseq.settings?.customTimeout || 300);
};
const main = async () => {
  logseq.useSettingsSchema(settings);
  logseq.App.registerCommandPalette(
    {
      key: "Go home now!",
      label: "Go to todays journal, append a new block and scroll to it",
      keybinding: { binding: logseq.settings?.keyboardShortcut },
    },
    async () => {
      const dateFormat = (await logseq.App.getUserConfigs()).preferredDateFormat
    const language = (await logseq.App.getUserConfigs()).preferredLanguage
    const date = SimpleDateFormat.get(language).format('#'+dateFormat, new Date())
    const homepage: BlockEntity[] = (await logseq.Editor.getPageBlocksTree(date))
    const lastItem: BlockEntity = homepage[homepage.length - 1]
      if (lastItem.content == "") {
        logseq.Editor.scrollToBlockInPage(date, lastItem.uuid);
        triggerEnter();
      } else {
        const block = await logseq.Editor.appendBlockInPage(date, "");
        logseq.Editor.scrollToBlockInPage(date, block!.uuid);
        if (logseq.settings?.enterEditingMode == "enter") {
          triggerEnter();
        }
      }
    }
  );
};

logseq.ready(main).catch(console.error);
