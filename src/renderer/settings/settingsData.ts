import * as settingsService from './settingsService'

export interface ISettings {
  keybinds: {
    incrementDeaths: settingsService.SettingKeybind
    // decrementDeaths: settingsService.SettingKeybind
    // switchTimer: settingsService.SettingKeybind
    // previousBoss: settingsService.SettingKeybind
    // nextBoss: settingsService.SettingKeybind
    // hideShowOverlay: settingsService.SettingKeybind
    // hideShowBossListOnOverlay: settingsService.SettingKeybind
  }
}

const settings: ISettings = {
  keybinds: {
    incrementDeaths: new settingsService.SettingKeybind('keybinds.incrementDeaths', 'test', 'test', [65, 66])
  }
}
export default settings
