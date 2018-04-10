/* eslint-disable no-undef */
import * as crypto from 'crypto'
import * as data from './data' // eslint-disable-line no-unused-vars
const Store = require('electron-store')
const savesJSON = new Store({name: 'saves', cwd: 'storage'})

// saves.json interface
interface BossInfo {
  name: string,
  time: number,
  deaths: number
}

interface Bosses {
  [x: string]: BossInfo
}

interface Save {
  name: string
  bosses: Bosses
}

interface Saves {
  [x: string]: Save
}

// Functions
async function getSaves (gameId: string): Promise<Saves> {
  try {
    console.log('Fetching list of saves')
    const saveList: Saves = await savesJSON.get(`games.${gameId}`)
    console.log('Fetched list of saves', saveList)
    return saveList
  } catch (err) {
    console.error('Error while fetching list of saves:', err)
  }
}

async function getSaveInfo (gameId: string, saveId: string): Promise<Save> {
  try {
    console.log('Fetching save info')
    const saveInfo: Save = await savesJSON.get(`games.${gameId}.${saveId}`)
    console.log('Fetched save info', saveInfo)
    return saveInfo
  } catch (err) {
    console.error('Erorr while fetching save info:', err)
  }
}

async function createSave (name: string): Promise<void> {
  try {
    console.log('Creating a new save')

    let saveName: string = name
    const gameId: string = localStorage.getItem('gameId')
    const gameInfo: data.Game = await data.getGameInfo(gameId)
    const savePath: string = `games.${gameId}`
    // Generate an ID for the save
    const saveId: string = crypto.randomBytes(16).toString('hex')

    // Check if a name has been provided
    if (!saveName) {
      // No name provided for save, use default name
      console.log('No name provided for save')
      saveName = gameInfo.name
    }

    // Abort save creation if boss list is empty
    if (!gameInfo.bosses) {
      console.log('Boss list for game is empty, aborting save creation')
      return
    }

    // Import boss list for the game
    const bossList: Bosses = gameInfo.bosses as Bosses
    console.log('Imported boss list for the game')
    // Insert a 'time' property to each boss
    Object.keys(bossList).forEach((key: string): void => {
      bossList[key].time = 0
      bossList[key].deaths = 0
    })
    console.log('Inserted time and death property to each boss')

    // Insert the info
    const saveInfo: Save = {
      name: saveName,
      bosses: bossList
    }
    // Write the created save to saves.json
    savesJSON.set(`${savePath}.${saveId}`, saveInfo)
    console.log('Inserted new save information')

    console.log('Created new save')
  } catch (err) {
    console.error('Error while creating new save', err)
  }
}

export {BossInfo, Bosses, Save, Saves, getSaves, getSaveInfo, createSave}
